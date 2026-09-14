import { Link } from 'react-router-dom'
import './Services.css'

const services = [
  {
    name: 'Corte Tradicional',
    description: 'Corte personalizado de acordo com seu estilo.',
    price: 'R$ 30',
    duration: '30 min',
  },
  {
    name: 'Corte + Barba',
    description: 'Corte completo acompanhado de acabamento da barba.',
    price: 'R$ 45',
    duration: '50 min',
  },
  {
    name: 'Barba',
    description: 'Modelagem e acabamento para manter sua barba impecável.',
    price: 'R$ 20',
    duration: '20 min',
  },
]

function Services() {
  return (
    <section className="services" id="servicos">
      <div className="services__container">

        <div className="services__header fade-up">
          <span className="services__eyebrow">
            SERVIÇOS
          </span>

          <h2 className="services__title">
            Escolha seu
            <span> momento.</span>
          </h2>

          <p className="services__description">
            Cada serviço é pensado para entregar
            um atendimento completo e personalizado.
          </p>
        </div>

        <div className="services__list">
          {services.map((service, index) => (
            <article
              className="service-card fade-up"
              key={service.name}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="service-card__top">
                <div>
                  <span className="service-card__number">
                    0{index + 1}
                  </span>

                  <h3 className="service-card__name">
                    {service.name}
                  </h3>
                </div>

                <span className="service-card__price">
                  {service.price}
                </span>
              </div>

              <p className="service-card__description">
                {service.description}
              </p>

              <div className="service-card__bottom">
                <span className="service-card__duration">
                  Aproximadamente {service.duration}
                </span>

                <Link
                  to="/agendar"
                  className="service-card__button"
                >
                  Agendar →
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Services