
import { useState } from 'react'
import { useAuth } from './AuthContext'
import './Header.css'

export default function Header({ showUserManagement, setShowUserManagement }) {
  const { user, logout, isAdmin } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>🌡️ Cold Chain Monitor</h1>
          <p>Temperature Monitoring System</p>
        </div>
        
        <div className="user-section">
          <div className="user-info" onClick={() => setShowUserMenu(!showUserMenu)}>
            <span className="user-name">{user.name}</span>
            <span className={`user-role ${user.role}`}>
              {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
            </span>
            <span className="dropdown-arrow">▼</span>
          </div>
          
          {showUserMenu && (
            <div className="user-menu">
              {isAdmin() && (
                <button 
                  onClick={() => {
                    setShowUserManagement(!showUserManagement)
                    setShowUserMenu(false)
                  }}
                  className="menu-item"
                >
                  Gestion des utilisateurs
                </button>
              )}
              <button onClick={handleLogout} className="menu-item logout">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
