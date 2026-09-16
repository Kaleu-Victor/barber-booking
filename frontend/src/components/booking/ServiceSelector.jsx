import { useState, useEffect } from 'react'
import { getServices } from '../../services/servicesApi'
import './ServiceSelector.css'

function ServiceSelector({ selectedService, onSelect }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices()
        // formata o dado para o padrão visual do componente
        const formattedData = data.map(service => ({
          ...service,
          price: `R$ ${(service.priceInCents / 100).toFixed(0)}`,
          duration: service.durationMinutes
        }))
        setServices(formattedData)
      } catch (err) {
        setError('Não foi possível carregar os serviços.')
      } finally {
        setLoading(false)
      }
    }
    loadServices()
  }, [])

  if (loading) return <div className="service-selector"><p>Carregando serviços...</p></div>
  if (error) return <div className="service-selector"><p className="error">{error}</p></div>

  return (
    <div className="service-selector">
      <div className="service-selector__header">
        <span>01</span>

        <div>
          <p>PRIMEIRO PASSO</p>
          <h2>Escolha o serviço</h2>
        </div>
      </div>

      <div className="service-selector__list">
        {services.map((service) => {
          const isSelected =
            selectedService?.id === service.id

          return (
            <button
              type="button"
              key={service.id}
              className={`service-option ${
                isSelected
                  ? 'service-option--selected'
                  : ''
              }`}
              onClick={() => onSelect(service)}
            >
              <div className="service-option__info">
                <h3>{service.name}</h3>

                <p>{service.description}</p>

                <span>{service.duration} min</span>
              </div>

              <div className="service-option__right">
                <strong>{service.price}</strong>

                <span className="service-option__check">
                  {isSelected ? '✓' : '→'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ServiceSelector