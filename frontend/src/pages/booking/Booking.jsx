import { useState } from 'react'

import ServiceSelector from '../../components/booking/ServiceSelector'

import './Booking.css'

function Booking() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <main className="booking">
      <div className="booking__container">

        <header className="booking__header">
          <a href="/" className="booking__back">
            ← Voltar
          </a>

          <span className="booking__brand">
            BARBER
          </span>
        </header>

        <section className="booking__intro">
          <span>AGENDAMENTO ONLINE</span>

          <h1>
            Vamos encontrar
            <strong> seu horário.</strong>
          </h1>

          <p>
            É rápido. Escolha o serviço e siga os próximos passos.
          </p>
        </section>

        <ServiceSelector
          selectedService={selectedService}
          onSelect={setSelectedService}
        />

      </div>
    </main>
  )
}

export default Booking