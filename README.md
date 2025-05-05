# MouvTrack - Système de Détection de Mouvement IoT

## Description
MouvTrack est une application web moderne qui permet de contrôler et de surveiller un système de détection de mouvement IoT. L'application utilise React pour l'interface utilisateur et communique avec un backend via MQTT pour le contrôle des appareils.

## Fonctionnalités
- 🚨 Détection de mouvement en temps réel
- 💡 Contrôle de la LED (activation/désactivation et durée)
- 🔊 Contrôle du buzzer (activation/désactivation et durée)
- 📱 Interface utilisateur réactive et intuitive
- 🔄 Communication en temps réel avec les appareils IoT

## Technologies Utilisées:
 -React (Bibliothèque frontend)
 -Tailwind CSS (Styling)
 -Flask (Bibliothèque Python backend)
 -Socket.io (Communication en temps réel)
 -MQTT (Protocole de communication IoT)
 -C++
 -Bibliothèque Arduino
 -PlatformIO (extension VSCode)


## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances :
```bash
cd frontend
npm install
```

3. Lancer l'application :
```bash
npm run dev
```

## Structure du Projet
- `/src/components` : Composants React réutilisables
- `/src/pages` : Pages principales de l'application
- `/src/assets` : Ressources statiques (images, icônes)

## Utilisation
1. Accédez à l'application via `http://localhost:5173`
2. Configurez les paramètres de notification (LED et buzzer)
3. Surveillez les détections de mouvement en temps réel

## Configuration MQTT
- Topic par défaut : `/Ynov/Rennes/Mouvtrack/`
- Serveur MQTT 

## Développement
Pour contribuer au projet :
1. Créez une branche pour votre fonctionnalité
2. Committez vos changements
3. Soumettez une pull request

