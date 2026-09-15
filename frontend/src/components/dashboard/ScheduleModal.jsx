import { useState, useEffect } from 'react'
import DayScheduleCard from './DayScheduleCard'
import './ScheduleModal.css'

function ScheduleModal({ isOpen, onClose, scheduleConfig, onSave }) {
  const [localSchedule, setLocalSchedule] = useState(() =>
    JSON.parse(JSON.stringify(scheduleConfig)),
  )
  const [saveFeedback, setSaveFeedback] = useState(false)

  // Listener para fechar com a tecla Esc e travar scroll do body
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleDayChange(index, updatedDay) {
    setLocalSchedule((prev) =>
      prev.map((day, i) => (i === index ? updatedDay : day)),
    )
  }

  function handleSave() {
    onSave(localSchedule)
    setSaveFeedback(true)

    setTimeout(() => {
      setSaveFeedback(false)
      onClose()
    }, 1200)
  }

  return (
    <div
      className="schedule-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      <div className="schedule-modal">
        <header className="schedule-modal__header">
          <div className="schedule-modal__title-box">
            <span className="schedule-modal__eyebrow">CONFIGURAÇÃO DE AGENDA</span>
            <h2 id="schedule-modal-title" className="schedule-modal__title">
              Horários de <strong>Atendimento</strong>
            </h2>
            <p className="schedule-modal__description">
              Defina os dias em que você atende, o horário de funcionamento e os intervalos de descanso.
            </p>
          </div>

          <button
            type="button"
            className="schedule-modal__close-button"
            onClick={onClose}
            aria-label="Fechar modal"
            title="Fechar (Esc)"
          >
            ✕
          </button>
        </header>

        <div className="schedule-modal__content">
          <div className="schedule-modal__days-list">
            {localSchedule.map((dayConfig, index) => (
              <DayScheduleCard
                key={dayConfig.dayOfWeek}
                dayConfig={dayConfig}
                onChange={(updated) => handleDayChange(index, updated)}
              />
            ))}
          </div>
        </div>

        <footer className="schedule-modal__footer">
          {saveFeedback && (
            <div className="schedule-modal__feedback" role="status">
              <span>✓ Configurações salvas com sucesso!</span>
            </div>
          )}

          <div className="schedule-modal__actions">
            <button
              type="button"
              className="schedule-modal__cancel-button"
              onClick={onClose}
              disabled={saveFeedback}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="schedule-modal__save-button"
              onClick={handleSave}
              disabled={saveFeedback}
            >
              {saveFeedback ? 'Salvo!' : 'Salvar alterações'}
              {!saveFeedback && <span>→</span>}
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ScheduleModal
