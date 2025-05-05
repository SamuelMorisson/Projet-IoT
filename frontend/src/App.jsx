import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Notifications from './pages/Notifications'
import About from './pages/About'
import MqttControlPanel from './components/MqttControlPanel';

import logo from './assets/react.svg' 

function App() {
  return (
    <Router>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/about" element={<About />} />
            <Route path="/mqtt" element={<MqttControlPanel />} />
          </Routes>
        </div>
      
    </Router>
  )
}

export default App