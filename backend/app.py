from flask import Flask, request, jsonify, Response
from flask_mqtt import Mqtt
from flask_cors import CORS
import queue
import json

app = Flask(__name__)
CORS(app)

# Configuration MQTT (⚠️ modifie si besoin)
app.config['MQTT_BROKER_URL'] = 'broker.emqx.io'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_REFRESH_TIME'] = 1.0

mqtt = Mqtt(app)
message_queue = queue.Queue()

@app.route('/')
def index():
    return "Backend Flask MQTT actif"

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    topic = data.get('topic', '/Ynov/Rennes/Mouvtrack').rstrip('/')
    message = data.get('message', '')

    if message:
        if isinstance(message, str):
            try:
                message_data = json.loads(message)

                if 'durationLed' in message_data:
                    mqtt.publish(f"{topic}/durationLed", json.dumps({"durationLed": message_data['durationLed']}))
                if 'durationBuzzer' in message_data:
                    mqtt.publish(f"{topic}/durationBuzzer", json.dumps({"durationBuzzer": message_data['durationBuzzer']}))
                if 'activeLed' in message_data:
                    mqtt.publish(f"{topic}/activeLed", json.dumps({"activeLed": message_data['activeLed']}))
                if 'activeBuzzer' in message_data:
                    mqtt.publish(f"{topic}/activeBuzzer", json.dumps({"activeBuzzer": message_data['activeBuzzer']}))

                # Envoi d'un message texte simple
                mqtt.publish(f"{topic}/test", "Notification test")

                print("[MQTT] Messages envoyés sur le broker MQTT")
                return jsonify({"status": "Settings updated and sent to MQTT"}), 200

            except json.JSONDecodeError:
                mqtt.publish(topic, message)
                return jsonify({"status": "Message sent"}), 200
        else:
            mqtt.publish(topic, json.dumps(message))
            return jsonify({"status": "Message sent"}), 200
    else:
        return jsonify({"error": "No message provided"}), 400

@app.route('/stream')
def stream():
    def event_stream():
        while True:
            msg = message_queue.get()
            yield f"data: {msg}\n\n"
    return Response(event_stream(), mimetype="text/event-stream")

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    print("[MQTT] Connecté au broker avec le code :", rc)
    mqtt.subscribe('Ynov/Rennes/Mouvtrack/#')

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    msg_decoded = message.payload.decode()
    print(f"[MQTT] Message reçu sur le topic {message.topic}: {msg_decoded}")
    message_queue.put(f"{message.topic}: {msg_decoded}")

if __name__ == '__main__':
    app.run(debug=True)
