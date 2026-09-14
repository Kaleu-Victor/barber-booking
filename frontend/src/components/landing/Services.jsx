import { Link } from 'react-router-dom'

import { services } from '../../data/services'

import './Services.css'

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
              key={service.id}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
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
                  Aproximadamente {service.duration} min
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