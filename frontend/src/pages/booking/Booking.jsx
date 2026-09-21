import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAvailability } from '../../services/availabilityApi'
import { createAppointment } from '../../services/appointmentsApi'

import ServiceSelector from '../../components/booking/ServiceSelector'
import DateSelector from '../../components/booking/DateSelector'
import TimeSelector from '../../components/booking/TimeSelector'
import ClientForm from '../../components/booking/ClientForm'
import BookingSummary from '../../components/booking/BookingSummary'
import ClientAppointmentsModal from '../../components/booking/ClientAppointmentsModal'

import './Booking.css'

function Booking() {
  const navigate = useNavigate()
  
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false)

  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const [clientName, setClientName] = useState('')
  const [clientWhatsapp, setClientWhatsapp] = useState('')

  const [availableTimes, setAvailableTimes] = useState([])
  const [loadingTimes, setLoadingTimes] = useState(false)
  const [timesError, setTimesError] = useState(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  console.log('Estados atuais:', { selectedDate, selectedService })

  useEffect(() => {
    async function loadTimes() {
      console.log('--- INICIANDO LOAD TIMES ---')
      console.log('selectedDate:', selectedDate)
      console.log('selectedService:', selectedService)

      if (!selectedDate || !selectedService) {
        console.log('Guard early return: aguardando date e service')
        return
      }

      setLoadingTimes(true)
      setTimesError(null)

      try {
        const barberId = 1 // fixo no MVP
        
        let dateStr = ''
        if (typeof selectedDate === 'string') {
          dateStr = selectedDate
        } else if (selectedDate.date) {
          // Extraindo a data do objeto gerado pelo DateSelector
          const d = new Date(selectedDate.date)
          // Corrige fuso se necessário ou simplesmente pega YYYY-MM-DD
          dateStr = d.toISOString().split('T')[0]
        } else if (selectedDate instanceof Date) {
          dateStr = selectedDate.toISOString().split('T')[0]
        } else {
          dateStr = new Date().toISOString().split('T')[0] // Fallback para hoje
        }

        const serviceId = typeof selectedService === 'object' ? selectedService.id : selectedService

        console.log('Parâmetros resolvidos para a API:', { dateStr, serviceId, barberId })

        const times = await getAvailability(dateStr, serviceId, barberId)
        setAvailableTimes(times)
      } catch (err) {
        console.error('ERRO CRÍTICO no try/catch do loadTimes:', err)
        setTimesError('Não foi possível carregar os horários.')
      } finally {
        setLoadingTimes(false)
      }
    }
    loadTimes()
  }, [selectedDate, selectedService])

  function handleDateSelect(date) {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  async function handleConfirm() {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      let dateStr = ''
      if (typeof selectedDate === 'string') {
        dateStr = selectedDate
      } else if (selectedDate && selectedDate.date instanceof Date) {
        dateStr = selectedDate.date.toISOString().split('T')[0]
      } else {
        dateStr = new Date(selectedDate.date).toISOString().split('T')[0]
      }

      await createAppointment({
        serviceId: selectedService.id,
        date: dateStr,
        time: selectedTime.time,
        clientName: clientName,
        whatsapp: clientWhatsapp.replace(/\D/g, '')
      })

      navigate('/agendamento/sucesso', {
        state: {
          service: selectedService,
          date: selectedDate,
          time: selectedTime,
          name: clientName,
          whatsapp: clientWhatsapp,
        },
      })
    } catch (err) {
      setSubmitError(err.message || 'Erro ao criar agendamento. Tente novamente.')
      setIsSubmitting(false)
    }
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

          <button 
            type="button" 
            className="booking__my-appointments-btn"
            onClick={() => setIsAppointmentsModalOpen(true)}
          >
            <span className="booking__btn-icon">📅</span> Já agendou? Consultar horário
          </button>
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
          <div className="booking__times-wrapper">
            {loadingTimes ? (
              <p>Carregando horários...</p>
            ) : timesError ? (
              <p className="error">{timesError}</p>
            ) : (
              <TimeSelector
                times={availableTimes}
                selectedTime={selectedTime}
                onSelect={setSelectedTime}
              />
            )}
          </div>
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
            <div className="booking__summary-wrapper">
              {submitError && <p className="error" style={{marginBottom: '1rem'}}>{submitError}</p>}
              <BookingSummary
                service={selectedService}
                date={selectedDate}
                time={selectedTime}
                name={clientName}
                whatsapp={clientWhatsapp}
                onConfirm={handleConfirm}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

        <ClientAppointmentsModal 
          isOpen={isAppointmentsModalOpen}
          onClose={() => setIsAppointmentsModalOpen(false)}
        />
      </div>
    </main>
  )
}

export default Booking