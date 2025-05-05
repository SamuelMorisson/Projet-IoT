import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Load settings from localStorage to stay in sync with Notifications page
  const [activeLed, setActiveLed] = useState(() => {
    const saved = localStorage.getItem('activeLed');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeBuzzer, setActiveBuzzer] = useState(() => {
    const saved = localStorage.getItem('activeBuzzer');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [durationLed, setDurationLed] = useState(() => {
    const saved = localStorage.getItem('durationLed');
    return saved !== null ? JSON.parse(saved) : 5;
  });

  const [durationBuzzer, setDurationBuzzer] = useState(() => {
    const saved = localStorage.getItem('durationBuzzer');
    return saved !== null ? JSON.parse(saved) : 5;
  });

  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [lastDetection, setLastDetection] = useState(null);

  // Listen for localStorage changes to keep UI in sync
  useEffect(() => {
    const handleStorageChange = () => {
      const ledActive = localStorage.getItem('activeLed');
      const buzzerActive = localStorage.getItem('activeBuzzer');
      const ledDuration = localStorage.getItem('durationLed');
      const buzzerDuration = localStorage.getItem('durationBuzzer');
      
      if (ledActive !== null) setActiveLed(JSON.parse(ledActive));
      if (buzzerActive !== null) setActiveBuzzer(JSON.parse(buzzerActive));
      if (ledDuration !== null) setDurationLed(JSON.parse(ledDuration));
      if (buzzerDuration !== null) setDurationBuzzer(JSON.parse(buzzerDuration));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save changes to localStorage when toggled in this component
  useEffect(() => {
    localStorage.setItem('activeLed', JSON.stringify(activeLed));
    localStorage.setItem('activeBuzzer', JSON.stringify(activeBuzzer));
  }, [activeLed, activeBuzzer]);

  const sendMessage = async (message) => {
    try {
      const response = await fetch('http://localhost:5000/send_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: '/Ynov/Rennes/Mouvtrack/',
          message: JSON.stringify(message),
        }),
      });

      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
    }
  };

  const handleTest = (type) => {
    const msg = {
      durationLed: durationLed * 1000, // Convert to milliseconds
      durationBuzzer: durationBuzzer * 1000, // Convert to milliseconds
      activeLed: type === 'led' || type === 'both' ? activeLed : false,
      activeBuzzer: type === 'buzzer' || type === 'both' ? activeBuzzer : false,
    };

    sendMessage(msg);

    if (!msg.activeLed && !msg.activeBuzzer) {
      setPopupMessage("Aucune notification activée.");
    } else if (msg.activeLed && msg.activeBuzzer) {
      setPopupMessage(`Test global : LED (${durationLed}s) + Buzzer (${durationBuzzer}s) activés.`);
    } else if (msg.activeLed) {
      setPopupMessage(`Seule la LED est activée (${durationLed}s).`);
    } else if (msg.activeBuzzer) {
      setPopupMessage(`Seul le buzzer est activé (${durationBuzzer}s).`);
    }

    setShowPopup(true);
  };

  // Improved message handling with better parsing
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/stream');
    eventSource.onmessage = (e) => {
      setReceivedMessages(prev => {
        const newMessages = [...prev, e.data];
        
        // Check for motion detection messages
        if (e.data.includes('motion detected') || e.data.toLowerCase().includes('mouvement')) {
          setLastDetection(new Date().toLocaleString());
        }
        
        // Parse settings updates if present
        try {
          if (e.data.includes('activeLed') || e.data.includes('activeBuzzer')) {
            const parts = e.data.split(': ');
            if (parts.length > 1) {
              const jsonData = JSON.parse(parts[1]);
              
              // Update local state if settings were changed remotely
              if (jsonData.hasOwnProperty('activeLed')) {
                setActiveLed(jsonData.activeLed);
                localStorage.setItem('activeLed', JSON.stringify(jsonData.activeLed));
              }
              if (jsonData.hasOwnProperty('activeBuzzer')) {
                setActiveBuzzer(jsonData.activeBuzzer);
                localStorage.setItem('activeBuzzer', JSON.stringify(jsonData.activeBuzzer));
              }
              if (jsonData.hasOwnProperty('durationLed')) {
                const seconds = jsonData.durationLed / 1000;
                setDurationLed(seconds);
                localStorage.setItem('durationLed', JSON.stringify(seconds));
              }
              if (jsonData.hasOwnProperty('durationBuzzer')) {
                const seconds = jsonData.durationBuzzer / 1000;
                setDurationBuzzer(seconds);
                localStorage.setItem('durationBuzzer', JSON.stringify(seconds));
              }
            }
          }
        } catch (err) {
          console.log('Non-JSON message received');
        }
        
        return newMessages.slice(-5); // Keep only the last 5 messages
      });
    };
    
    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
    };
    
    return () => eventSource.close();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen text-gray-800 font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/Logo.png" alt="MouvTrack Logo" className="h-12 mr-4" />
            <h1 className="text-2xl font-bold text-blue-800 hidden md:block">MouvTrack</h1>
          </div>
          <nav className="flex space-x-6">
            <Link to="/" className="text-blue-700 font-bold border-b-2 border-blue-600 pb-1">Accueil</Link>
            <Link to="/notifications" className="text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1">Notifications</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1">À propos</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Bienvenue sur MouvTrack</h1>
          <p className="text-xl text-blue-600 max-w-2xl mx-auto">
            Votre solution intelligente pour la détection de mouvement et la gestion des notifications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-semibold">État du système</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Système actif</span>
              </div>
          
              
              <div className="flex flex-col space-y-2">
                <p className="font-medium">État des notifications:</p>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${activeLed ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span>LED: {activeLed ? `Activée (${durationLed}s)` : 'Désactivée'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${activeBuzzer ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span>Buzzer: {activeBuzzer ? `Activé (${durationBuzzer}s)` : 'Désactivé'}</span>
                </div>
              </div>
              
              <Link to="/notifications" className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200">
                Configurer les notifications
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-semibold">Test rapide</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="font-medium mb-2">Notification via lumière LED :</p>
                <div className="flex gap-4 items-center">
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      className="form-radio text-blue-600" 
                      checked={activeLed} 
                      onChange={() => setActiveLed(true)} 
                    />
                    <span className="ml-2">Activée</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      className="form-radio text-blue-600" 
                      checked={!activeLed} 
                      onChange={() => setActiveLed(false)} 
                    />
                    <span className="ml-2">Désactivée</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Notification via buzzer :</p>
                <div className="flex gap-4 items-center">
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      className="form-radio text-blue-600" 
                      checked={activeBuzzer} 
                      onChange={() => setActiveBuzzer(true)} 
                    />
                    <span className="ml-2">Activée</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      className="form-radio text-blue-600" 
                      checked={!activeBuzzer} 
                      onChange={() => setActiveBuzzer(false)} 
                    />
                    <span className="ml-2">Désactivée</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => handleTest('led')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200 flex-1"
                >
                  Tester LED
                </button>
                <button 
                  onClick={() => handleTest('buzzer')} 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200 flex-1"
                >
                  Tester Buzzer
                </button>
                <button 
                  onClick={() => handleTest('both')} 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-200 w-full"
                >
                  Tester les deux
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-semibold">Activité récente</h2>
          </div>
          <div className="p-6">
            {receivedMessages.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {receivedMessages.map((msg, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                    {msg}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-center py-4">Aucun message récent</p>
            )}
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center space-y-4 max-w-sm mx-4">
            <h2 className="text-xl font-semibold text-blue-700">Test de Notification</h2>
            <p className="text-gray-700">{popupMessage}</p>
            <button 
              onClick={() => setShowPopup(false)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
