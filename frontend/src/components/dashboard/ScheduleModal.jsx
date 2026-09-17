import { useState, useEffect } from 'react'
import DayScheduleCard from './DayScheduleCard'
import './ScheduleModal.css'

const DAYS_OF_WEEK = [
  { dayOfWeek: 0, short: 'DOM', full: 'Domingo' },
  { dayOfWeek: 1, short: 'SEG', full: 'Segunda-feira' },
  { dayOfWeek: 2, short: 'TER', full: 'Terça-feira' },
  { dayOfWeek: 3, short: 'QUA', full: 'Quarta-feira' },
  { dayOfWeek: 4, short: 'QUI', full: 'Quinta-feira' },
  { dayOfWeek: 5, short: 'SEX', full: 'Sexta-feira' },
  { dayOfWeek: 6, short: 'SAB', full: 'Sábado' },
]

function formatDayMonth(date) {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${d}/${m}`
}

function buildDynamicSchedule(scheduleFromDb) {
  const today = new Date()
  
  return Array.from({ length: 7 }).map((_, index) => {
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + index)
    
    const dayOfWeek = targetDate.getDay()
    const dayData = DAYS_OF_WEEK[dayOfWeek]
    const formattedDate = formatDayMonth(targetDate)
    
    let prefix = ''
    if (index === 0) prefix = 'Hoje — '
    else if (index === 1) prefix = 'Amanhã — '
    
    const dayName = `${prefix}${dayData.full}, ${formattedDate}`
    
    const dbConfig = scheduleFromDb.find(d => d.dayOfWeek === dayOfWeek) || {
      dayOfWeek, enabled: false, startTime: '09:00', endTime: '18:00', breaks: []
    }
    
    // Deep clone to avoid mutating original state references
    const configCopy = JSON.parse(JSON.stringify(dbConfig))
    
    return {
      ...configCopy,
      dayName,
      shortName: dayData.short
    }
  })
}

function ScheduleModal({ isOpen, onClose, scheduleConfig, onSave }) {
  const [localSchedule, setLocalSchedule] = useState(() =>
    buildDynamicSchedule(scheduleConfig)
  )
  const [saveFeedback, setSaveFeedback] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  async function handleSave() {
    setIsSaving(true)
    try {
      await onSave(localSchedule)
      setSaveFeedback(true)

      setTimeout(() => {
        setSaveFeedback(false)
        onClose()
      }, 1200)
    } catch (err) {
      // Erro tratado pelo onSave (no Dashboard), apenas encerra loading
    } finally {
      setIsSaving(false)
    }
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
              disabled={saveFeedback || isSaving}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="schedule-modal__save-button"
              onClick={handleSave}
              disabled={saveFeedback || isSaving}
            >
              {isSaving ? 'Salvando...' : saveFeedback ? 'Salvo!' : 'Salvar alterações'}
              {!saveFeedback && !isSaving && <span>→</span>}
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ScheduleModal
