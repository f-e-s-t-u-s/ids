import pcap from 'pcap';
import logger from './config/logger.js';

const networkInterface = 'wlp58s0'; 
const pcapSession = pcap.createSession(networkInterface, {});
const maxICMPPacketSize = 65535;  //?? max packet size

pcapSession.on('packet', (rawPacket) => {
  const packet = pcap.decode.packet(rawPacket);

  // Check if the packet is an ICMP packet
  if (packet.payload.payload.protocol === 'ICMP') {
    const packetSize = rawPacket.length;

    if (packetSize > maxICMPPacketSize) {
      const sourceIP = packet.payload.payload.saddr.toString();
      logger.warn(`ping of death attack detected from ${sourceIP}`);
      // todo block ip and send notificationhere
    }
  }
});

logger.info('Ping of Death detection started');

pcapSession.on('error', (err) => {
  logger.error(`Error in pcap session: ${err}`);
});