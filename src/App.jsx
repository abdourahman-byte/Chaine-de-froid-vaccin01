
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './AuthContext'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import Header from './Header'
import UserManagement from './UserManagement'
import './App.css'

function MainApp() {
  const { user } = useAuth()
  const [showRegister, setShowRegister] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)

  if (!user) {
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
    )
  }

  return (
    <div className="app">
      <Header 
        showUserManagement={showUserManagement}
        setShowUserManagement={setShowUserManagement}
      />
      <TemperatureMonitor showUserManagement={showUserManagement} />
    </div>
  )
}

function TemperatureMonitor({ showUserManagement }) {
  // State variables - these store data that can change
  const [currentTemp, setCurrentTemp] = useState(22.5)
  const [temperatureHistory, setTemperatureHistory] = useState([])
  const [minTemp, setMinTemp] = useState(2)
  const [maxTemp, setMaxTemp] = useState(8)
  const [isAlarmActive, setIsAlarmActive] = useState(false)

  // This function simulates getting temperature readings
  const generateRandomTemperature = () => {
    // Generate temperature between -5 and 15 degrees Celsius
    return Math.round((Math.random() * 20 - 5) * 10) / 10
  }

  // This runs when the component first loads and every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newTemp = generateRandomTemperature()
      setCurrentTemp(newTemp)
      
      // Add to history (keep only last 10 readings)
      setTemperatureHistory(prev => {
        const newHistory = [...prev, {
          temperature: newTemp,
          timestamp: new Date().toLocaleTimeString()
        }]
        return newHistory.slice(-10) // Keep only last 10
      })

      // Check if temperature is outside safe range
      setIsAlarmActive(newTemp < minTemp || newTemp > maxTemp)
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval) // Cleanup when component unmounts
  }, [minTemp, maxTemp])

  // Function to get temperature status
  const getTemperatureStatus = () => {
    if (currentTemp < minTemp) return 'Too Cold'
    if (currentTemp > maxTemp) return 'Too Warm'
    return 'Normal'
  }

  // Function to get status color
  const getStatusColor = () => {
    const status = getTemperatureStatus()
    if (status === 'Too Cold') return '#3498db'
    if (status === 'Too Warm') return '#e74c3c'
    return '#27ae60'
  }

  return (
    <main className="app-main">
      {showUserManagement && <UserManagement />}
        {/* Current Temperature Display */}
        <div className="temperature-card">
          <h2>Current Temperature</h2>
          <div 
            className="temperature-display"
            style={{ color: getStatusColor() }}
          >
            {currentTemp}°C
          </div>
          <div 
            className="status-badge"
            style={{ backgroundColor: getStatusColor() }}
          >
            {getTemperatureStatus()}
          </div>
          {isAlarmActive && (
            <div className="alarm">
              ⚠️ TEMPERATURE ALERT!
            </div>
          )}
        </div>

        {/* Temperature Range Settings */}
        <div className="settings-card">
          <h3>Safe Temperature Range</h3>
          <div className="range-inputs">
            <div className="input-group">
              <label htmlFor="minTemp">Minimum:</label>
              <input
                id="minTemp"
                type="number"
                value={minTemp}
                onChange={(e) => setMinTemp(Number(e.target.value))}
              />
              <span>°C</span>
            </div>
            <div className="input-group">
              <label htmlFor="maxTemp">Maximum:</label>
              <input
                id="maxTemp"
                type="number"
                value={maxTemp}
                onChange={(e) => setMaxTemp(Number(e.target.value))}
              />
              <span>°C</span>
            </div>
          </div>
        </div>

        {/* Temperature History */}
        <div className="history-card">
          <h3>Recent Readings</h3>
          <div className="history-list">
            {temperatureHistory.length === 0 ? (
              <p>No readings yet...</p>
            ) : (
              temperatureHistory.slice().reverse().map((reading, index) => (
                <div key={index} className="history-item">
                  <span className="time">{reading.timestamp}</span>
                  <span 
                    className="temp"
                    style={{
                      color: reading.temperature < minTemp || reading.temperature > maxTemp 
                        ? '#e74c3c' 
                        : '#27ae60'
                    }}
                  >
                    {reading.temperature}°C
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
