import { Activity, ShieldAlert, ShieldCheck } from 'lucide-react';
import { NetworkEvent } from '../types';

interface NetworkTrafficLogProps {
  events: NetworkEvent[];
}

export function NetworkTrafficLog({ events }: NetworkTrafficLogProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-gray-700" />
        <h2 className="text-xl font-bold text-gray-900">Live Network Traffic</h2>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Monitoring</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Time</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Source</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Destination</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Protocol</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Size</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  Waiting for network traffic...
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr
                  key={event.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    event.is_attack ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="py-3 px-2 text-gray-600">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-2 font-mono text-xs">
                    {event.source_ip}:{event.source_port}
                  </td>
                  <td className="py-3 px-2 font-mono text-xs">
                    {event.destination_ip}:{event.destination_port}
                  </td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {event.protocol}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-600">{event.packet_size}B</td>
                  <td className="py-3 px-2">
                    {event.is_attack ? (
                      <div className="flex items-center gap-1 text-red-600">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-xs font-semibold">THREAT</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-semibold">SAFE</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`font-semibold ${
                      event.confidence_score > 0.7 ? 'text-red-600' :
                      event.confidence_score > 0.5 ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {(event.confidence_score * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
