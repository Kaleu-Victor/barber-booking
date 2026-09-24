import { useState, useEffect } from 'react'
import './ProfileModal.css'

function ProfileModal({ isOpen, onClose, onProfileUpdate }) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const barberInfo = JSON.parse(localStorage.getItem('barberInfo') || '{}')
      setName(barberInfo.name || '')
      setUsername(barberInfo.username || '')
      setWhatsapp(barberInfo.whatsapp || '')
      setCurrentPassword('')
      setNewPassword('')
      setError('')
      setSuccess('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('barberToken')
      const response = await fetch('http://localhost:3000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          whatsapp,
          username,
          currentPassword,
          newPassword: newPassword || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar perfil')
      }

      localStorage.setItem('barberInfo', JSON.stringify(data))
      setSuccess('Perfil atualizado com sucesso!')
      
      if (onProfileUpdate) {
        onProfileUpdate(data)
      }

      setTimeout(() => {
        onClose()
      }, 2000)

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <header className="profile-modal__header">
          <h2>Meu Perfil</h2>
          <button className="profile-modal__close" onClick={onClose}>✕</button>
        </header>

        <form className="profile-modal__content" onSubmit={handleSubmit}>
          {error && <div className="profile-modal__message error">{error}</div>}
          {success && <div className="profile-modal__message success">{success}</div>}

          <div className="profile-modal__form-group">
            <label>Nome de Exibição</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="profile-modal__form-group">
            <label>Telefone / WhatsApp</label>
            <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
          </div>

          <div className="profile-modal__form-group">
            <label>Nome de Utilizador</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>

          <hr />

          <div className="profile-modal__form-group">
            <label>Nova Senha (opcional)</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>

          <div className="profile-modal__form-group">
            <label>Senha Atual (obrigatória para confirmar)</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
          </div>

          <footer className="profile-modal__footer">
            <button type="button" className="profile-modal__btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="profile-modal__btn-save" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default ProfileModal
