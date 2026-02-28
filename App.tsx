import { useEffect, useState } from 'react';
import { Shield, Activity, AlertTriangle, CheckCircle, Play, Pause } from 'lucide-react';
import { supabase } from './lib/supabase';
import { NetworkEvent, Alert, SystemStats } from './types';
import { generateNetworkPacket } from './utils/trafficSimulator';
import { StatsCard } from './components/StatsCard';
import { AlertsList } from './components/AlertsList';
import { NetworkTrafficLog } from './components/NetworkTrafficLog';

function App() {
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    total_events: 0,
    normal_events: 0,
    attack_events: 0,
    threats_blocked: 0,
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    fetchInitialData();
    setupRealtimeSubscriptions();
  }, []);

  async function fetchInitialData() {
    const { data: eventsData } = await supabase
      .from('network_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: alertsData } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (eventsData) setEvents(eventsData);
    if (alertsData) setAlerts(alertsData);

    updateStats(eventsData || []);
  }

  function setupRealtimeSubscriptions() {
    const eventsChannel = supabase
      .channel('network_events_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'network_events' },
        (payload) => {
          const newEvent = payload.new as NetworkEvent;
          setEvents((prev) => [newEvent, ...prev].slice(0, 50));
          updateStats([newEvent, ...events]);
        }
      )
      .subscribe();

    const alertsChannel = supabase
      .channel('alerts_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          const newAlert = payload.new as Alert;
          setAlerts((prev) => [newAlert, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      eventsChannel.unsubscribe();
      alertsChannel.unsubscribe();
    };
  }

  function updateStats(eventsList: NetworkEvent[]) {
    const total = eventsList.length;
    const attacks = eventsList.filter((e) => e.is_attack).length;
    const normal = total - attacks;

    setStats({
      total_events: total,
      normal_events: normal,
      attack_events: attacks,
      threats_blocked: attacks,
    });
  }

  async function simulateTraffic() {
    const packet = generateNetworkPacket();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/detect-anomaly`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ packet }),
        }
      );

      if (!response.ok) {
        console.error('Failed to process packet:', await response.text());
      }
    } catch (error) {
      console.error('Error simulating traffic:', error);
    }
  }

  function toggleMonitoring() {
    if (isMonitoring) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsMonitoring(false);
    } else {
      const id = setInterval(simulateTraffic, 2000) as unknown as number;
      setIntervalId(id);
      setIsMonitoring(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SentinelAI</h1>
                <p className="text-gray-600">Intelligent Network Intrusion Detection System</p>
              </div>
            </div>

            <button
              onClick={toggleMonitoring}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md transition-all ${
                isMonitoring
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Monitoring
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Events"
              value={stats.total_events}
              icon={Activity}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatsCard
              title="Normal Traffic"
              value={stats.normal_events}
              icon={CheckCircle}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatsCard
              title="Threats Detected"
              value={stats.attack_events}
              icon={AlertTriangle}
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
            <StatsCard
              title="Threats Blocked"
              value={stats.threats_blocked}
              icon={Shield}
              color="bg-gradient-to-br from-orange-500 to-orange-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <NetworkTrafficLog events={events} />
          </div>
          <div className="lg:col-span-1">
            <AlertsList alerts={alerts} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">System Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Detection Model</span>
              <span className="text-green-600 font-semibold">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database Connection</span>
              <span className="text-green-600 font-semibold">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Real-time Updates</span>
              <span className="text-green-600 font-semibold">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
