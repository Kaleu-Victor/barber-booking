import './BookingSummary.css'

function BookingSummary({
  service,
  date,
  time,
  name,
  whatsapp,
  onConfirm,
}) {
  function formatDate(date) {
    if (!date) return ''

    return date.date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })
  }

  return (
    <div className="booking-summary">
      <div className="booking-summary__header">
        <span>05</span>

        <div>
          <p>ÚLTIMO PASSO</p>
          <h2>Confirme seu agendamento</h2>
        </div>
      </div>

      <div className="booking-summary__card">
        <div className="booking-summary__service">
          <span>SERVIÇO</span>
          <strong>{service?.name}</strong>
        </div>

        <div className="booking-summary__details">
          <div>
            <span>DATA</span>
            <strong>{formatDate(date)}</strong>
          </div>

          <div>
            <span>HORÁRIO</span>
            <strong>{time?.time}</strong>
          </div>

          <div>
            <span>DURAÇÃO</span>
            <strong>{service?.duration}</strong>
          </div>

          <div>
            <span>VALOR</span>
            <strong>{service?.price}</strong>
          </div>
        </div>

        <div className="booking-summary__client">
          <span>CLIENTE</span>

          <div>
            <strong>{name}</strong>
            <p>{whatsapp}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="booking-summary__button"
        onClick={onConfirm}
      >
        Confirmar agendamento
        <span>→</span>
      </button>

      <p className="booking-summary__notice">
        Ao confirmar, seu horário será reservado.
      </p>
    </div>
  )
}

export default BookingSummary