import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { mockAvailableTimes } from '../../data/availability'

import ServiceSelector from '../../components/booking/ServiceSelector'
import DateSelector from '../../components/booking/DateSelector'
import TimeSelector from '../../components/booking/TimeSelector'
import ClientForm from '../../components/booking/ClientForm'
import BookingSummary from '../../components/booking/BookingSummary'

import './Booking.css'

function Booking() {
  const navigate = useNavigate()

  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const [clientName, setClientName] = useState('')
  const [clientWhatsapp, setClientWhatsapp] = useState('')

  function handleDateSelect(date) {
    setSelectedDate(date)
    setSelectedTime(null)
  }

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

        {selectedService && (
          <DateSelector
            selectedDate={selectedDate}
            onSelect={handleDateSelect}
          />
        )}

        {selectedDate && (
          <TimeSelector
            times={mockAvailableTimes}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
          />
        )}

        {selectedTime && (
          <ClientForm
            name={clientName}
            whatsapp={clientWhatsapp}
            onNameChange={setClientName}
            onWhatsappChange={setClientWhatsapp}
          />
        )}

        {selectedTime &&
          clientName.trim() &&
          clientWhatsapp.trim() && (
            <BookingSummary
              service={selectedService}
              date={selectedDate}
              time={selectedTime}
              name={clientName}
              whatsapp={clientWhatsapp}
              onConfirm={() => {
                navigate('/agendamento/sucesso', {
                  state: {
                    service: selectedService,
                    date: selectedDate,
                    time: selectedTime,
                    name: clientName,
                    whatsapp: clientWhatsapp,
                  },
                })
              }}
            />
          )}

      </div>
    </main>
  )
}

export default Booking