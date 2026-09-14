import './TimeSelector.css'

function TimeSelector({
  times,
  selectedTime,
  onSelect,
}) {
  return (
    <div className="time-selector">
      <div className="time-selector__header">
        <span>03</span>

        <div>
          <p>TERCEIRO PASSO</p>
          <h2>Escolha o horário</h2>
        </div>
      </div>

      <div className="time-selector__list">
        {times.map((item) => {
          const isSelected =
            selectedTime?.id === item.id

          return (
            <button
              type="button"
              key={item.id}
              className={`time-option ${
                isSelected
                  ? 'time-option--selected'
                  : ''
              }`}
              onClick={() => onSelect(item)}
            >
              {item.time}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TimeSelector