import { Link, useLocation } from 'react-router-dom'

import './BookingSuccess.css'

function BookingSuccess() {
  const location = useLocation()

  const booking = location.state

  if (!booking) {
    return (
      <main className="booking-success">
        <div className="booking-success__container">
          <span className="booking-success__eyebrow">
            AGENDAMENTO
          </span>

          <h1>Agendamento não encontrado.</h1>

          <Link
            to="/agendar"
            className="booking-success__button"
          >
            Fazer um novo agendamento
          </Link>
        </div>
      </main>
    )
  }

  const { service, date, time, name, whatsapp } = booking

  function formatDate(date) {
    return date.date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })
  }

  return (
    <main className="booking-success">
      <div className="booking-success__glow"></div>

      <div className="booking-success__container">
        <div className="booking-success__icon">
          ✓
        </div>

        <span className="booking-success__eyebrow">
          AGENDAMENTO CONFIRMADO
        </span>

        <h1>
          Seu horário foi
          <strong> reservado.</strong>
        </h1>

        <p className="booking-success__description">
          Tudo certo, {name}. Seu agendamento foi
          confirmado com sucesso.
        </p>

        <div className="booking-success__card">
          <div className="booking-success__service">
            <span>SERVIÇO</span>
            <strong>{service.name}</strong>
          </div>

          <div className="booking-success__details">
            <div>
              <span>DATA</span>
              <strong>{formatDate(date)}</strong>
            </div>

            <div>
              <span>HORÁRIO</span>
              <strong>{time.time}</strong>
            </div>

            <div>
              <span>DURAÇÃO</span>
              <strong>{service.duration}</strong>
            </div>

            <div>
              <span>VALOR</span>
              <strong>{service.price}</strong>
            </div>
          </div>

          <div className="booking-success__client">
            <span>WHATSAPP</span>
            <strong>{whatsapp}</strong>
          </div>
        </div>

        <Link
          to="/"
          className="booking-success__button"
        >
          Voltar para o início
          <span>→</span>
        </Link>
      </div>
    </main>
  )
}

export default BookingSuccess