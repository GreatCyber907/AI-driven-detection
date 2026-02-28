export interface NetworkEvent {
  id: string;
  timestamp: string;
  source_ip: string;
  destination_ip: string;
  source_port: number;
  destination_port: number;
  protocol: string;
  packet_size: number;
  duration: number;
  flag: string;
  is_attack: boolean;
  confidence_score: number;
  created_at: string;
}

export interface Alert {
  id: string;
  event_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  resolved_at: string | null;
  created_at: string;
}

export interface SystemStats {
  total_events: number;
  normal_events: number;
  attack_events: number;
  threats_blocked: number;
}
