import './DateSelector.css'

function generateDates() {
  const dates = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)

    date.setDate(today.getDate() + i)

    dates.push({
      id: i,
      date,
    })
  }

  return dates
}

function formatDay(date, index) {
  if (index === 0) {
    return 'HOJE'
  }

  if (index === 1) {
    return 'AMANHÃ'
  }

  return date
    .toLocaleDateString('pt-BR', {
      weekday: 'short',
    })
    .replace('.', '')
    .toUpperCase()
}

function formatMonth(date) {
  return date
    .toLocaleDateString('pt-BR', {
      month: 'short',
    })
    .replace('.', '')
    .toUpperCase()
}

function DateSelector({ selectedDate, onSelect }) {
  const dates = generateDates()

  return (
    <div className="date-selector">

      <div className="date-selector__header">
        <span>02</span>

        <div>
          <p>SEGUNDO PASSO</p>
          <h2>Escolha o dia</h2>
        </div>
      </div>

      <div className="date-selector__list">
        {dates.map((item, index) => {
          const isSelected =
            selectedDate?.id === item.id

          return (
            <button
              type="button"
              key={item.id}
              className={`date-option ${
                isSelected
                  ? 'date-option--selected'
                  : ''
              }`}
              onClick={() => onSelect(item)}
            >
              <span className="date-option__day">
                {formatDay(item.date, index)}
              </span>

              <strong className="date-option__number">
                {item.date.getDate()}
              </strong>

              <span className="date-option__month">
                {formatMonth(item.date)}
              </span>
            </button>
          )
        })}
      </div>

    </div>
  )
}

export default DateSelector