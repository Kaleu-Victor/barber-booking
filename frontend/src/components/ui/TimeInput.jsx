import './TimeInput.css'

function TimeInput({
  id,
  value,
  onChange,
  disabled = false,
  label = '',
  min,
  max,
}) {
  return (
    <div className={`time-input-group ${disabled ? 'time-input-group--disabled' : ''}`}>
      {label && (
        <label htmlFor={id} className="time-input-group__label">
          {label}
        </label>
      )}
      <input
        id={id}
        type="time"
        className="time-input-group__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
      />
    </div>
  )
}

export default TimeInput
