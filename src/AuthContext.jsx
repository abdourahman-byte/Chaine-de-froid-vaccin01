
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])

  // Initialize with admin user
  useEffect(() => {
    const savedUsers = localStorage.getItem('coldChainUsers')
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      // Create default admin user
      const defaultUsers = [
        {
          id: 1,
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          name: 'Administrator',
          email: 'admin@coldchain.com'
        }
      ]
      setUsers(defaultUsers)
      localStorage.setItem('coldChainUsers', JSON.stringify(defaultUsers))
    }

    // Check if user is logged in
    const savedUser = localStorage.getItem('coldChainCurrentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password)
    if (foundUser) {
      const userWithoutPassword = { ...foundUser }
      delete userWithoutPassword.password
      setUser(userWithoutPassword)
      localStorage.setItem('coldChainCurrentUser', JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    return { success: false, error: 'Nom d\'utilisateur ou mot de passe incorrect' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('coldChainCurrentUser')
  }

  const register = (userData) => {
    const existingUser = users.find(u => u.username === userData.username || u.email === userData.email)
    if (existingUser) {
      return { success: false, error: 'Nom d\'utilisateur ou email déjà utilisé' }
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'user' // Default role
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem('coldChainUsers', JSON.stringify(updatedUsers))
    
    return { success: true }
  }

  const updateUser = (userId, userData) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, ...userData } : u
    )
    setUsers(updatedUsers)
    localStorage.setItem('coldChainUsers', JSON.stringify(updatedUsers))
    
    // Update current user if it's the same user
    if (user && user.id === userId) {
      const updatedCurrentUser = { ...user, ...userData }
      setUser(updatedCurrentUser)
      localStorage.setItem('coldChainCurrentUser', JSON.stringify(updatedCurrentUser))
    }
  }

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem('coldChainUsers', JSON.stringify(updatedUsers))
  }

  const isAdmin = () => user && user.role === 'admin'

  const value = {
    user,
    users,
    login,
    logout,
    register,
    updateUser,
    deleteUser,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
