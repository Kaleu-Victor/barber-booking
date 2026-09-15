import './ToggleSwitch.css'

function ToggleSwitch({
  id,
  checked,
  onChange,
  disabled = false,
  label = '',
}) {
  return (
    <label
      htmlFor={id}
      className={`toggle-switch ${disabled ? 'toggle-switch--disabled' : ''}`}
    >
      <input
        id={id}
        type="checkbox"
        className="toggle-switch__input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-switch__slider"></span>
      {label && <span className="toggle-switch__label">{label}</span>}
    </label>
  )
}

export default ToggleSwitch
