
import { useState } from 'react'
import { useAuth } from './AuthContext'
import './Auth.css'

export default function RegisterForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { register } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    
    const result = register({
      username: formData.username,
      password: formData.password,
      name: formData.name,
      email: formData.email
    })
    
    if (result.success) {
      setSuccess('Compte créé avec succès! Vous pouvez maintenant vous connecter.')
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: ''
      })
    } else {
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
        <h3>Inscription</h3>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom complet:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            S'inscrire
          </button>
        </form>
        
        <p className="auth-switch">
          Déjà un compte?{' '}
          <button onClick={onSwitchToLogin} className="link-button">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  )
}
