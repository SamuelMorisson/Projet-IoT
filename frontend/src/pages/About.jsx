import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
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
            <Link to="/notifications" className="text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1">Notifications</Link>
            <Link to="/about" className="text-blue-700 font-bold border-b-2 border-blue-600 pb-1">À propos</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">À propos de MouvTrack</h1>
            <p className="text-xl text-blue-600">Votre solution intelligente de détection de mouvement</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Notre mission</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              MouvTrack est une application conçue pour surveiller et notifier les intrusions détectées par un système embarqué.
              Elle permet à l'utilisateur de personnaliser les notifications sonores et visuelles, tout en garantissant une alerte 
              automatique pour des raisons de sécurité.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cette solution est idéale pour les projets domotiques, éducatifs ou de surveillance légère.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
              <div className="text-blue-500 text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Domotique</h3>
              <p className="text-gray-600">
                Intégrez MouvTrack à votre système domotique pour une sécurité accrue et personnalisable.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
              <div className="text-blue-500 text-4xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Notifications</h3>
              <p className="text-gray-600">
                Personnalisez vos alertes avec des notifications visuelles (LED) et sonores (buzzer).
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
              <div className="text-blue-500 text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Temps réel</h3>
              <p className="text-gray-600">
                Recevez des alertes instantanées dès qu'un mouvement est détecté par le capteur.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Technologies utilisées</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <span className="text-blue-700 text-xl">💻</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700">Frontend</h3>
                  <p className="text-gray-600">React, Tailwind CSS</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <span className="text-blue-700 text-xl">🔌</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700">Backend</h3>
                  <p className="text-gray-600">Flask, MQTT</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <span className="text-blue-700 text-xl">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700">IoT</h3>
                  <p className="text-gray-600">ESP32, Capteurs PIR</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <span className="text-blue-700 text-xl">🔒</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700">Communication</h3>
                  <p className="text-gray-600">Protocole MQTT sécurisé</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10 text-gray-600">
            <p>© 2023 MouvTrack - Tous droits réservés</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
