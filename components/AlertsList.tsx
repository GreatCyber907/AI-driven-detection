import { AlertTriangle, Shield, Bell, AlertCircle } from 'lucide-react';
import { Alert } from '../types';

interface AlertsListProps {
  alerts: Alert[];
}

const severityConfig = {
  critical: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle, badge: 'bg-red-500' },
  high: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertCircle, badge: 'bg-orange-500' },
  medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Bell, badge: 'bg-yellow-500' },
  low: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Shield, badge: 'bg-blue-500' },
};

export function AlertsList({ alerts }: AlertsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Alerts</h2>
        <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
          {alerts.filter(a => a.status === 'new').length} Active
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No alerts detected</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${config.color} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.badge}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{alert.alert_type}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full uppercase ${config.badge} text-white`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm opacity-90 mb-2">{alert.description}</p>
                    <p className="text-xs opacity-75">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
