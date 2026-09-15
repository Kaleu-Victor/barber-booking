import ToggleSwitch from '../ui/ToggleSwitch'
import TimeInput from '../ui/TimeInput'
import BreakItem from './BreakItem'
import './DayScheduleCard.css'

function DayScheduleCard({ dayConfig, onChange }) {
  const { dayOfWeek, dayName, shortName, enabled, startTime, endTime, breaks } =
    dayConfig

  function handleToggleEnabled(isChecked) {
    onChange({
      ...dayConfig,
      enabled: isChecked,
    })
  }

  function handleStartTimeChange(newTime) {
    onChange({
      ...dayConfig,
      startTime: newTime,
    })
  }

  function handleEndTimeChange(newTime) {
    onChange({
      ...dayConfig,
      endTime: newTime,
    })
  }

  function handleAddBreak() {
    const newBreak = {
      id: `break-${dayOfWeek}-${Date.now()}`,
      startTime: '12:00',
      endTime: '13:00',
    }

    onChange({
      ...dayConfig,
      breaks: [...breaks, newBreak],
    })
  }

  function handleUpdateBreak(index, updatedBreak) {
    const updatedBreaks = breaks.map((item, i) =>
      i === index ? updatedBreak : item,
    )

    onChange({
      ...dayConfig,
      breaks: updatedBreaks,
    })
  }

  function handleRemoveBreak(index) {
    const updatedBreaks = breaks.filter((_, i) => i !== index)

    onChange({
      ...dayConfig,
      breaks: updatedBreaks,
    })
  }

  const toggleId = `day-toggle-${dayOfWeek}`
  const dayStartInputId = `day-start-${dayOfWeek}`
  const dayEndInputId = `day-end-${dayOfWeek}`

  return (
    <article
      className={`day-card ${enabled ? 'day-card--enabled' : 'day-card--disabled'}`}
    >
      <header className="day-card__header">
        <div className="day-card__title-group">
          <span className="day-card__short-name">{shortName}</span>
          <div className="day-card__names">
            <h3 className="day-card__day-name">{dayName}</h3>
            <span
              className={`day-card__status-badge ${
                enabled
                  ? 'day-card__status-badge--open'
                  : 'day-card__status-badge--closed'
              }`}
            >
              {enabled ? 'Aberto para agendamento' : 'Fechado'}
            </span>
          </div>
        </div>

        <ToggleSwitch
          id={toggleId}
          checked={enabled}
          onChange={handleToggleEnabled}
        />
      </header>

      {enabled && (
        <div className="day-card__body">
          <div className="day-card__hours-section">
            <span className="day-card__section-label">
              Expediente de Trabalho
            </span>
            <div className="day-card__hours-grid">
              <TimeInput
                id={dayStartInputId}
                label="Abertura"
                value={startTime}
                onChange={handleStartTimeChange}
              />
              <span className="day-card__hours-separator">às</span>
              <TimeInput
                id={dayEndInputId}
                label="Fechamento"
                value={endTime}
                onChange={handleEndTimeChange}
              />
            </div>
          </div>

          <div className="day-card__breaks-section">
            <div className="day-card__breaks-header">
              <span className="day-card__section-label">
                Pausas e Intervalos
              </span>
              <button
                type="button"
                className="day-card__add-break-button"
                onClick={handleAddBreak}
              >
                + Adicionar pausa
              </button>
            </div>

            {breaks && breaks.length > 0 ? (
              <div className="day-card__breaks-list">
                {breaks.map((breakItem, index) => (
                  <BreakItem
                    key={breakItem.id}
                    breakData={breakItem}
                    index={index}
                    dayId={dayOfWeek}
                    onChange={(updated) => handleUpdateBreak(index, updated)}
                    onRemove={() => handleRemoveBreak(index)}
                  />
                ))}
              </div>
            ) : (
              <p className="day-card__no-breaks">
                Nenhum intervalo configurado. O expediente é contínuo.
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

export default DayScheduleCard
