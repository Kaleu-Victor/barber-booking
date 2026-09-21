import { useState } from 'react'
import { getAppointmentsByPhone, clientCancelAppointment } from '../../services/appointmentsApi'
import './ClientAppointmentsModal.css'

// Máscara simples para celular (99) 99999-9999
function formatPhone(value) {
  const digits = value.replace(/\D/g, '').substring(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatDateLabel(dateString) {
  const d = new Date(dateString)
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const dayName = days[d.getDay()]
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${dayName}, ${day}/${month} às ${time}`
}

function ClientAppointmentsModal({ isOpen, onClose }) {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState(1) // 1: Busca, 2: Resultados
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [cancelingId, setCancelingId] = useState(null)

  if (!isOpen) return null

  const handleSearch = async (e) => {
    e.preventDefault()
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Digite um telefone válido com DDD.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const cleanPhone = phone.replace(/\D/g, '')
      const data = await getAppointmentsByPhone(cleanPhone)
      setAppointments(data || [])
      setStep(2)
    } catch (err) {
      setError('Erro ao buscar agendamentos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (apptId) => {
    if (!window.confirm('Deseja realmente cancelar este horário?')) return

    setCancelingId(apptId)
    setError(null)
    try {
      const cleanPhone = phone.replace(/\D/g, '')
      await clientCancelAppointment(apptId, cleanPhone)
      // Atualizar lista localmente
      setAppointments((prev) =>
        prev.map((a) => (a.id === apptId ? { ...a, status: 'CANCELLED' } : a))
      )
    } catch (err) {
      setError(err.message || 'Erro ao cancelar horário.')
    } finally {
      setCancelingId(null)
    }
  }

  const handleClose = () => {
    setStep(1)
    setPhone('')
    setAppointments([])
    setError(null)
    onClose()
  }

  return (
    <div className="client-modal__overlay" onClick={handleClose}>
      <div
        className="client-modal__content"
        onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
      >
        <button className="client-modal__close-btn" onClick={handleClose}>
          ✕
        </button>

        <h2 className="client-modal__title">Meus Agendamentos</h2>

        {step === 1 && (
          <form className="client-modal__form" onSubmit={handleSearch}>
            <p className="client-modal__desc">
              Informe seu WhatsApp para consultar ou cancelar seus próximos horários.
            </p>
            <label className="client-modal__label">
              <span>Seu WhatsApp</span>
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="client-modal__input"
                autoFocus
              />
            </label>
            {error && <p className="client-modal__error">{error}</p>}
            <button
              type="submit"
              className="client-modal__submit-btn"
              disabled={loading || phone.length < 14}
            >
              {loading ? 'Buscando...' : 'Buscar meu horário'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="client-modal__results">
            {error && <p className="client-modal__error">{error}</p>}

            {appointments.length === 0 ? (
              <div className="client-modal__empty">
                <p>Nenhum agendamento futuro encontrado para este número.</p>
                <button
                  type="button"
                  className="client-modal__submit-btn"
                  onClick={handleClose}
                >
                  Agendar novo horário
                </button>
              </div>
            ) : (
              <div className="client-modal__list">
                {appointments.map((appt) => {
                  const isCancelled = appt.status === 'CANCELLED'
                  const isCanceling = cancelingId === appt.id

                  return (
                    <article
                      key={appt.id}
                      className={`client-appt-card ${
                        isCancelled ? 'client-appt-card--cancelled' : ''
                      }`}
                    >
                      <div className="client-appt-card__header">
                        <strong>{formatDateLabel(appt.date)}</strong>
                        {isCancelled && <span className="client-appt-card__badge">Cancelado</span>}
                      </div>
                      <div className="client-appt-card__details">
                        <p>{appt.service?.name}</p>
                        <p className="muted">Com {appt.barber?.name}</p>
                        <p className="price">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format((appt.service?.priceInCents || 0) / 100)}
                        </p>
                      </div>

                      {!isCancelled && (
                        <button
                          type="button"
                          className="client-appt-card__cancel-btn"
                          disabled={isCanceling}
                          onClick={() => handleCancel(appt.id)}
                        >
                          {isCanceling ? 'Cancelando...' : 'Desmarcar horário'}
                        </button>
                      )}
                    </article>
                  )
                })}

                <button
                  type="button"
                  className="client-modal__secondary-btn"
                  onClick={() => setStep(1)}
                >
                  ← Buscar outro número
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientAppointmentsModal
