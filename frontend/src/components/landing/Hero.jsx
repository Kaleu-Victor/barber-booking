import { Link } from 'react-router-dom'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero__glow hero__glow--one"></div>
      <div className="hero__glow hero__glow--two"></div>

      <div className="hero__container">
        <div className="hero__content fade-up">
          <span className="hero__eyebrow">
            BARBEARIA • ESTILO • PRECISÃO
          </span>

          <h1 className="hero__title">
            Seu estilo começa
            <span> nos detalhes.</span>
          </h1>

          <p className="hero__description">
            Um atendimento pensado para você.
            Escolha o serviço, encontre o melhor horário
            e agende em poucos segundos.
          </p>

          <div className="hero__actions">
            <Link to="/agendar" className="hero__button">
              Agendar horário
            </Link>

            <a href="#servicos" className="hero__secondary-button">
              Ver serviços
              <span>↓</span>
            </a>
          </div>
        </div>

        <div className="hero__visual fade-up">
          <div className="hero__image-placeholder">
            <div className="hero__image-content">
              <span>SEU</span>
              <strong>ESTILO</strong>
              <span>COMEÇA AQUI</span>
            </div>
          </div>

          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            Agendamento online
          </div>
        </div>
      </div>

      <div className="hero__scroll">
        <span>SCROLL</span>
        <div></div>
      </div>
    </section>
  )
}

export default Hero