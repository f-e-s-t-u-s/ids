from scapy.all import sniff, IP, TCP, UDP
from collections import defaultdict
import time
import ipaddress
import sqlite3
from datetime import datetime, timedelta
import threading

intF = 'wlp58s0'

def setup_database():
    conn = sqlite3.connect('packets.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS packets  (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time_stamp TEXT,
            ipsrc TEXT,
            ipdst TEXT,
            srcport TEXT,
            dstport TEXT,
            transport_layer TEXT,
            highest_layer TEXT,
            packet_size INTEGER,
            anomaly_flag BOOLEAN
        )
    ''')
    conn.commit()
    print("Database and table created")
    return conn

conn = setup_database()

class Pckt:
    def __init__(self, time_stamp='', ipsrc='', ipdst='', srcport='', dstport='', transport_layer='', highest_layer='', packet_size=0):
        self.time_stamp = time_stamp
        self.ipsrc = ipsrc
        self.ipdst = ipdst
        self.srcport = srcport
        self.dstport = dstport
        self.transport_layer = transport_layer
        self.highest_layer = highest_layer
        self.packet_size = packet_size

def is_private_ip(ip_address):
    ip = ipaddress.ip_address(ip_address)
    return ip.is_private

def filter_packet(packet):
    if IP in packet:
        data_gram = Pckt()
        ip_layer = packet[IP]
        if is_private_ip(ip_layer.src) and is_private_ip(ip_layer.dst):
            data_gram.ipsrc = ip_layer.src
            data_gram.ipdst = ip_layer.dst
            data_gram.time_stamp = datetime.now().isoformat()
            data_gram.highest_layer = packet.name
            data_gram.transport_layer = 'TCP' if TCP in packet else 'UDP'
            data_gram.packet_size = len(packet)

            if TCP in packet:
                tcp_layer = packet[TCP]
                data_gram.srcport = tcp_layer.sport
                data_gram.dstport = tcp_layer.dport
                track_syn_packet(data_gram.ipsrc)
                if is_syn_flood(data_gram.ipsrc):
                    store_packet(data_gram, conn, True)
                    return data_gram

            if UDP in packet:
                udp_layer = packet[UDP]
                data_gram.srcport = udp_layer.sport
                data_gram.dstport = udp_layer.dport

            if data_gram.transport_layer == 'TCP' and data_gram.dstport == 80:
                track_http_connection(data_gram.ipsrc)
                if is_slowloris(data_gram.ipsrc):
                    store_packet(data_gram, conn, True)
                    return data_gram

            store_packet(data_gram, conn, False)
            return data_gram
    return None

def store_packet(data_gram, conn, anomaly_flag):
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO packets (time_stamp, ipsrc, ipdst, srcport, dstport, transport_layer, highest_layer, packet_size, anomaly_flag)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (data_gram.time_stamp, data_gram.ipsrc, data_gram.ipdst, data_gram.srcport, data_gram.dstport, data_gram.transport_layer, data_gram.highest_layer, data_gram.packet_size, anomaly_flag))
    conn.commit()
    print(f"Stored packet: {data_gram} with anomaly flag: {anomaly_flag}")

# Tracking SYN packets for SYN flood detection
syn_packets = defaultdict(list)
syn_time_threshold = 10  # seconds
syn_count_threshold = 100  # SYN packets per source IP in threshold time

# Tracking HTTP connections for Slowloris detection
http_connections = defaultdict(list)
http_time_threshold = 5  # seconds
http_count_threshold = 20  # open connections per source IP in threshold time

def is_syn_flood(ip):
    current_time = time.time()
    syn_packets[ip] = [ts for ts in syn_packets[ip] if current_time - ts < syn_time_threshold]
    return len(syn_packets[ip]) > syn_count_threshold

def is_slowloris(ip):
    current_time = time.time()
    http_connections[ip] = [ts for ts in http_connections[ip] if current_time - ts < http_time_threshold]
    return len(http_connections[ip]) > http_count_threshold

def track_syn_packet(ip):
    syn_packets[ip].append(time.time())

def track_http_connection(ip):
    http_connections[ip].append(time.time())

def run_periodically(interval, func, *args):
    func(*args)
    threading.Timer(interval, run_periodically, [interval, func] + list(args)).start()

conn = setup_database()
run_periodically(60, lambda: None)

def packet_handler(packet):
    print(f"Captured packet: {packet.summary()}")
    filter_packet(packet)

sniff(iface=intF, prn=packet_handler)
