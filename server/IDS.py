from scapy.all import sniff, IP, TCP, UDP
import netifaces
import ipaddress
import sqlite3
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
import threading

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

class APIServer:
    def __init__(self, ip, port):
        self.ip = ip
        self.port = port

server = APIServer('192.168.0.111', '8080')

# Use wlan0 as the network interface
intF = 'wlp58s0:'

def is_private_ip(ip_address):
    '''
    Determines if the given ip address is private RFC-1918
    Args:
        ip_address: The ip to check
    Returns:
        True if the ip is private (RFC-1918)
    '''
    ip = ipaddress.ip_address(ip_address)
    return ip.is_private

def filter_packet(packet):
    '''
    Filters packet based on specified criteria.
    
    Args:
       packet: the packet from capture
    Returns:
       DataGram object or None
    '''
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

            if UDP in packet:
                udp_layer = packet[UDP]
                data_gram.srcport = udp_layer.sport
                data_gram.dstport = udp_layer.dport

            # Example criteria for marking an anomaly
            if data_gram.packet_size > 1500:  # Example size threshold
                return data_gram

            suspicious_ports = [23, 2323, 6667]  # Example suspicious ports
            if data_gram.srcport in suspicious_ports or data_gram.dstport in suspicious_ports:
                return data_gram

            return data_gram
    return None

def store_packet(data_gram, conn):
    '''
    Stores packet data in the SQLite database.
    
    Args:
        data_gram: The DataGram object to store
        conn: The SQLite connection object
    '''
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO packets (time_stamp, ipsrc, ipdst, srcport, dstport, transport_layer, highest_layer, packet_size, anomaly_flag)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (data_gram.time_stamp, data_gram.ipsrc, data_gram.ipdst, data_gram.srcport, data_gram.dstport, data_gram.transport_layer, data_gram.highest_layer, data_gram.packet_size, False))
    conn.commit()

def setup_database():
    '''
    Sets up the SQLite database and creates the necessary table.
    '''
    conn = sqlite3.connect('packets.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS packets (
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
    return conn

def send_email(subject, body):
    sender_email = 'wschool752@gmail.com'
    receiver_email = 'festusgitahik@gmail.com'
    password = 'eiyztdafsyawoblh'

    message = MIMEText(body)
    message['Subject'] = subject
    message['From'] = sender_email
    message['To'] = receiver_email

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())

def check_anomalies(conn):
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM packets WHERE anomaly_flag = 1 AND time_stamp > ?', (datetime.now() - timedelta(minutes=1),))
    count = cursor.fetchone()[0]
    if count > 0:
        send_email('Anomaly Detected', f'Anomalous packet count: {count}')

# Run anomaly check periodically
def run_periodically(interval, func, *args):
    func(*args)
    threading.Timer(interval, run_periodically, [interval, func] + list(args)).start()

conn = setup_database()
run_periodically(60, check_anomalies, conn)  # Check every 60 seconds

def packet_handler(packet):
    filtered_packet = filter_packet(packet)
    if filtered_packet:
        store_packet(filtered_packet, conn)

sniff(iface=intF, prn=packet_handler)
