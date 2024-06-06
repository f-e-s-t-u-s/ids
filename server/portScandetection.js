import pcap from 'pcap';
import logger from './config/logger.js';

const networkInterface = 'wlp58s0';
const pcapSession = pcap.createSession(networkInterface, {});

const portScanDetector = new Map();

pcapSession.on('packet', (rawPacket) => {
  const packet = pcap.decode.packet(rawPacket);

  // check id packet is tcp
  if (packet.payload.payload.protocol === 'TCP') {
    const sourceIP = packet.payload.payload.saddr.toString();
    const destinationIP = packet.payload.payload.daddr.toString();
    const destinationPort = packet.payload.payload.destinationPort;

    // check if soerce ip is already in detector map
    if (portScanDetector.has(sourceIP)) {
      const scannedPorts = portScanDetector.get(sourceIP);
      scannedPorts.add(destinationPort);

      // if no. of results exeeds 100, alert
      if (scannedPorts.size >= 100) {
        logger.warn(`Potential port scan attack detected from ${sourceIP}`);
        // todo send email/sms and block ip here
        portScanDetector.delete(sourceIP);
      }
    } else {
      portScanDetector.set(sourceIP, new Set([destinationPort]));
    }
  }
});

logger.info('Port scan detection started');

pcapSession.on('error', (err) => {
  logger.error(`Error in pcap session: ${err}`);
});

