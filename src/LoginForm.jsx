
import { useState } from 'react'
import { useAuth } from './AuthContext'
import './Auth.css'

export default function LoginForm({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    const result = login(formData.username, formData.password)
    if (!result.success) {
      setError(result.error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🌡️ Cold Chain Monitor</h2>
        <h3>Connexion</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            Se connecter
          </button>
        </form>
        
        <p className="auth-switch">
          Pas de compte?{' '}
          <button onClick={onSwitchToRegister} className="link-button">
            S'inscrire
          </button>
        </p>
        
        <div className="demo-credentials">
          <p><strong>Compte de démonstration:</strong></p>
          <p>Admin: admin / admin123</p>
        </div>
      </div>
    </div>
  )
}
