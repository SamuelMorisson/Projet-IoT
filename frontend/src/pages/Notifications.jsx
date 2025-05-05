import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  // Chargement initial depuis le localStorage
  const [activeLed, setActiveLed] = useState(() => {
    const saved = localStorage.getItem('activeLed');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeBuzzer, setActiveBuzzer] = useState(() => {
    const saved = localStorage.getItem('activeBuzzer');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Modification pour charger les durées depuis localStorage
  const [durationLed, setDurationLed] = useState(() => {
    const saved = localStorage.getItem('durationLed');
    return saved !== null ? JSON.parse(saved) : 5;
  });
  
  const [durationBuzzer, setDurationBuzzer] = useState(() => {
    const saved = localStorage.getItem('durationBuzzer');
    return saved !== null ? JSON.parse(saved) : 5;
  });
  
  // Nouvel état pour suivre si des changements non enregistrés existent
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Stockage localStorage uniquement (sans envoi automatique)
  useEffect(() => {
    // Sauvegarde en local
    localStorage.setItem('activeLed', JSON.stringify(activeLed));
    localStorage.setItem('activeBuzzer', JSON.stringify(activeBuzzer));
    localStorage.setItem('durationLed', JSON.stringify(durationLed));
    localStorage.setItem('durationBuzzer', JSON.stringify(durationBuzzer));
    
    // Marquer qu'il y a des changements non enregistrés
    setHasUnsavedChanges(true);
    
  }, [activeLed, activeBuzzer, durationLed, durationBuzzer]);

  // Écoute des messages en provenance de Flask (SSE)
  const [receivedMessages, setReceivedMessages] = useState([]);
  useEffect(() => {
    const es = new EventSource('http://localhost:5000/stream');
    es.onmessage = (e) => setReceivedMessages((prev) => [...prev, e.data]);
    return () => es.close();
  }, []);

  // Fonction pour envoyer un message au backend
  const sendMessage = async (message) => {
    try {
      const res = await fetch('http://localhost:5000/send_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: '/Ynov/Rennes/Mouvtrack/',
          message: JSON.stringify(message),
        }),
      });
      return await res.json();
    } catch (err) {
      console.error('Erreur envoi :', err);
      throw err;
    }
  };

  // Fonction pour enregistrer les changements
  const saveChanges = async () => {
    try {
      // Construction du message à envoyer
      const payload = {
        durationLed: durationLed * 1000,
        durationBuzzer: durationBuzzer * 1000,
        activeLed,
        activeBuzzer,
      };
      
      const result = await sendMessage(payload);
      console.log('Changements enregistrés:', result);
      setHasUnsavedChanges(false);
      
      // Afficher une notification de succès (optionnel)
      alert('Paramètres enregistrés avec succès!');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      alert('Erreur lors de l\'enregistrement des paramètres');
    }
  };

  const handleTest = (type) => {
    const msg = {
      durationLed: durationLed * 1000,
      durationBuzzer: durationBuzzer * 1000,
      activeLed: type === 'led' || type === 'both' ? activeLed : false,
      activeBuzzer: type === 'buzzer' || type === 'both' ? activeBuzzer : false,
    };
    sendMessage(msg);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen text-gray-800 font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="MouvTrack Logo" className="h-12 mr-4" />
            <h1 className="text-2xl font-bold text-blue-800 hidden md:block">MouvTrack</h1>
          </div>
          <nav className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1">Accueil</Link>
            <Link to="/notifications" className="text-blue-700 font-bold border-b-2 border-blue-600 pb-1">Notifications</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1">À propos</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Paramètres de Notification</h1>
          <p className="text-blue-600">Personnalisez vos alertes de détection de mouvement</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-semibold">Configuration des alertes</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-blue-500 text-2xl mr-3">💡</div>
                    <span className="font-medium">Notification Visuelle (LED)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeLed}
                      onChange={() => setActiveLed(!activeLed)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-blue-500 text-2xl mr-3">🔊</div>
                    <span className="font-medium">Notification Sonore (Buzzer)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeBuzzer}
                      onChange={() => setActiveBuzzer(!activeBuzzer)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Durée LED (secondes)</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={durationLed}
                      onChange={(e) => setDurationLed(Number(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 bg-blue-100 px-3 py-1 rounded-md min-w-[40px] text-center">
                      {durationLed}s
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">Durée Buzzer (secondes)</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={durationBuzzer}
                      onChange={(e) => setDurationBuzzer(Number(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 bg-blue-100 px-3 py-1 rounded-md min-w-[40px] text-center">
                      {durationBuzzer}s
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={saveChanges}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center ${
                  hasUnsavedChanges 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!hasUnsavedChanges}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {hasUnsavedChanges ? 'Enregistrer les changements' : 'Aucun changement à enregistrer'}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-xl font-semibold">Test des notifications</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Testez vos paramètres de notification actuels sans attendre une détection de mouvement.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => handleTest('led')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <span className="mr-2">💡</span> Tester LED
                  </button>
                  <button
                    onClick={() => handleTest('buzzer')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <span className="mr-2">🔊</span> Tester Buzzer
                  </button>
                </div>
                <button
                  onClick={() => handleTest('both')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  <span className="mr-2">✨</span> Tester les deux
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Messages reçus</h2>
                <span className="bg-blue-500 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {receivedMessages.length}
                </span>
              </div>
              <div className="p-6">
                <div className="max-h-60 overflow-y-auto">
                  {receivedMessages.length > 0 ? (
                    <ul className="space-y-2">
                      {receivedMessages.map((msg, idx) => (
                        <li key={idx} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500 text-sm">
                          {msg}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="italic">Aucun message reçu pour l'instant</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
