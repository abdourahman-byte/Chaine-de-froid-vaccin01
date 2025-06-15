
import { useState } from 'react'
import { useAuth } from './AuthContext'
import './UserManagement.css'

export default function UserManagement() {
  const { users, updateUser, deleteUser, user } = useAuth()
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({})

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit.id)
    setEditForm({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role
    })
  }

  const handleSave = () => {
    updateUser(editingUser, editForm)
    setEditingUser(null)
    setEditForm({})
  }

  const handleCancel = () => {
    setEditingUser(null)
    setEditForm({})
  }

  const handleDelete = (userId) => {
    if (userId === user.id) {
      alert('Vous ne pouvez pas supprimer votre propre compte')
      return
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      deleteUser(userId)
    }
  }

  const handleFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="user-management">
      <h3>Gestion des utilisateurs</h3>
      
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(userItem => (
              <tr key={userItem.id}>
                <td>
                  {editingUser === userItem.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleFormChange}
                    />
                  ) : (
                    userItem.name
                  )}
                </td>
                <td>{userItem.username}</td>
                <td>
                  {editingUser === userItem.id ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleFormChange}
                    />
                  ) : (
                    userItem.email
                  )}
                </td>
                <td>
                  {editingUser === userItem.id ? (
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleFormChange}
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  ) : (
                    <span className={`role-badge ${userItem.role}`}>
                      {userItem.role === 'admin' ? 'Admin' : 'Utilisateur'}
                    </span>
                  )}
                </td>
                <td>
                  {editingUser === userItem.id ? (
                    <div className="edit-actions">
                      <button onClick={handleSave} className="save-btn">
                        Sauvegarder
                      </button>
                      <button onClick={handleCancel} className="cancel-btn">
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <div className="user-actions">
                      <button 
                        onClick={() => handleEdit(userItem)}
                        className="edit-btn"
                      >
                        Modifier
                      </button>
                      {userItem.id !== user.id && (
                        <button 
                          onClick={() => handleDelete(userItem.id)}
                          className="delete-btn"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
