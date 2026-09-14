import './ServiceSelector.css'

const services = [
  {
    id: 1,
    name: 'Corte Tradicional',
    description: 'Corte personalizado de acordo com seu estilo.',
    price: 'R$ 30',
    duration: '30 min',
  },
  {
    id: 2,
    name: 'Corte + Barba',
    description: 'Corte completo acompanhado de acabamento da barba.',
    price: 'R$ 45',
    duration: '50 min',
  },
  {
    id: 3,
    name: 'Barba',
    description: 'Modelagem e acabamento para sua barba.',
    price: 'R$ 20',
    duration: '20 min',
  },
]

function ServiceSelector({ selectedService, onSelect }) {
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
          const isSelected = selectedService?.id === service.id

          return (
            <button
              type="button"
              key={service.id}
              className={`service-option ${
                isSelected ? 'service-option--selected' : ''
              }`}
              onClick={() => onSelect(service)}
            >
              <div className="service-option__info">
                <h3>{service.name}</h3>

                <p>{service.description}</p>

                <span>{service.duration}</span>
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