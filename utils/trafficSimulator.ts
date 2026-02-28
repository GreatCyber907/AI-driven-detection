const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];
const flags = ['SYN', 'ACK', 'FIN', 'RST', 'PSH', 'URG'];
const commonPorts = [80, 443, 22, 21, 25, 53, 3306, 5432, 8080];
const suspiciousPorts = [3389, 445, 135, 139, 1433, 23];

function generateIP(): string {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function generatePort(suspicious: boolean = false): number {
  if (suspicious && Math.random() > 0.5) {
    return suspiciousPorts[Math.floor(Math.random() * suspiciousPorts.length)];
  }
  return Math.random() > 0.7
    ? commonPorts[Math.floor(Math.random() * commonPorts.length)]
    : Math.floor(Math.random() * 65535);
}

export function generateNetworkPacket(forceAttack: boolean = false) {
  const isAttack = forceAttack || Math.random() > 0.7;

  const packet = {
    source_ip: generateIP(),
    destination_ip: generateIP(),
    source_port: generatePort(isAttack),
    destination_port: generatePort(isAttack),
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    packet_size: isAttack
      ? (Math.random() > 0.5 ? Math.floor(Math.random() * 70000) + 60000 : Math.floor(Math.random() * 50))
      : Math.floor(Math.random() * 1500) + 64,
    duration: isAttack
      ? Math.random() * 0.001
      : Math.random() * 10,
    flag: flags[Math.floor(Math.random() * flags.length)],
  };

  if (isAttack && Math.random() > 0.5) {
    packet.source_port = packet.destination_port;
  }

  return packet;
}
