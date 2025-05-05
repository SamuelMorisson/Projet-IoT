import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Ce composant peut fonctionner seul OU avec des props venant d’un autre composant
const MqttControlPanel = ({
  topic: propTopic,
  durationLed: propDurationLed,
  durationBuzzer: propDurationBuzzer,
  activeLed: propActiveLed,
  activeBuzzer: propActiveBuzzer,
}) => {
  const [topic, setTopic] = useState(propTopic || '/Ynov/Rennes/Mouvtrack/');
  const [durationLed, setDurationLed] = useState(propDurationLed || 5000);
  const [durationBuzzer, setDurationBuzzer] = useState(propDurationBuzzer || 5000);
  const [activeLed, setActiveLed] = useState(propActiveLed ?? true);
  const [activeBuzzer, setActiveBuzzer] = useState(propActiveBuzzer ?? false);
  const [messages, setMessages] = useState([]);

  // Connexion WebSocket pour écouter les messages MQTT reçus
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('✅ Connecté à Flask WebSocket');
    });

    socket.on('mqtt_message', (data) => {
      console.log('📥 Message MQTT reçu :', data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur WebSocket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fonction générique d'envoi
  const handleSendMessage = async () => {
    const payload = {
      topic,
      message: JSON.stringify({
        durationLed: parseInt(durationLed),
        durationBuzzer: parseInt(durationBuzzer),
        activeLed,
        activeBuzzer,
      }),
    };

    try {
      const response = await fetch('http://localhost:5000/send_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert('✅ Message MQTT envoyé avec succès !');
      } else {
        alert('❌ Erreur : ' + data.error);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message MQTT :', error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold">🛰️ Panneau de contrôle MQTT</h1>

      {/* Formulaire (uniquement affiché si utilisé seul) */}
      {propTopic === undefined && (
        <div className="space-y-2">
          <label className="block font-semibold">Topic :</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <label className="block font-semibold">Durée LED (ms) :</label>
          <input
            type="number"
            value={durationLed}
            onChange={(e) => setDurationLed(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />

          <label className="block font-semibold">Durée Buzzer (ms) :</label>
          <input
            type="number"
            value={durationBuzzer}
            onChange={(e) => setDurationBuzzer(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />

          <label className="block font-semibold">LED Active :</label>
          <input
            type="checkbox"
            checked={activeLed}
            onChange={(e) => setActiveLed(e.target.checked)}
            className="ml-2"
          />

          <label className="block font-semibold">Buzzer Actif :</label>
          <input
            type="checkbox"
            checked={activeBuzzer}
            onChange={(e) => setActiveBuzzer(e.target.checked)}
            className="ml-2"
          />
        </div>
      )}

      {/* Bouton d’envoi */}
      <button
        onClick={handleSendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🚀 Sauvegarder & Tester
      </button>

    </div>
  );
};

export default MqttControlPanel;
