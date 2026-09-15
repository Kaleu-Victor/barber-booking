import TimeInput from '../ui/TimeInput'
import './BreakItem.css'

function BreakItem({
  breakData,
  index,
  dayId,
  onChange,
  onRemove,
  disabled = false,
}) {
  function handleStartTimeChange(newTime) {
    onChange({
      ...breakData,
      startTime: newTime,
    })
  }

  function handleEndTimeChange(newTime) {
    onChange({
      ...breakData,
      endTime: newTime,
    })
  }

  const startInputId = `break-start-${dayId}-${breakData.id}`
  const endInputId = `break-end-${dayId}-${breakData.id}`

  return (
    <div className="break-item">
      <div className="break-item__badge">
        <span>Pausa {index + 1}</span>
      </div>

      <div className="break-item__inputs">
        <div className="break-item__field">
          <TimeInput
            id={startInputId}
            value={breakData.startTime}
            onChange={handleStartTimeChange}
            disabled={disabled}
            label="Início"
          />
        </div>

        <span className="break-item__separator">até</span>

        <div className="break-item__field">
          <TimeInput
            id={endInputId}
            value={breakData.endTime}
            onChange={handleEndTimeChange}
            disabled={disabled}
            label="Término"
          />
        </div>
      </div>

      <button
        type="button"
        className="break-item__remove-button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remover pausa ${index + 1}`}
        title="Remover pausa"
      >
        <span aria-hidden="true">✕</span>
        <span className="break-item__remove-text">Remover</span>
      </button>
    </div>
  )
}

export default BreakItem
