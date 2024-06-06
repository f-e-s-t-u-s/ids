from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///packets.db'
db = SQLAlchemy(app)

class Packet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time_stamp = db.Column(db.String, nullable=False)
    ipsrc = db.Column(db.String, nullable=False)
    ipdst = db.Column(db.String, nullable=False)
    srcport = db.Column(db.String, nullable=False)
    dstport = db.Column(db.String, nullable=False)
    transport_layer = db.Column(db.String, nullable=False)
    highest_layer = db.Column(db.String, nullable=False)
    packet_size = db.Column(db.Integer, nullable=False)
    anomaly_flag = db.Column(db.Boolean, nullable=False)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_data():
    packets = Packet.query.order_by(Packet.time_stamp.desc()).all()
    packet_data = [{
        'time_stamp': p.time_stamp,
        'ipsrc': p.ipsrc,
        'ipdst': p.ipdst,
        'srcport': p.srcport,
        'dstport': p.dstport,
        'transport_layer': p.transport_layer,
        'highest_layer': p.highest_layer,
        'packet_size': p.packet_size,
        'anomaly_flag': p.anomaly_flag
    } for p in packets]
    return jsonify(packet_data)

@app.route('/anomalies')
def get_anomalies():
    packets = Packet.query.filter_by(anomaly_flag=True).order_by(Packet.time_stamp.desc()).all()
    packet_data = [{
        'time_stamp': p.time_stamp,
        'ipsrc': p.ipsrc,
        'ipdst': p.ipdst,
        'srcport': p.srcport,
        'dstport': p.dstport,
        'transport_layer': p.transport_layer,
        'highest_layer': p.highest_layer,
        'packet_size': p.packet_size,
        'anomaly_flag': p.anomaly_flag
    } for p in packets]
    return jsonify(packet_data)

if __name__ == '__main__':
    app.run(debug=True)
