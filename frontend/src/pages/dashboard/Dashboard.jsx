import './Dashboard.css'

function Dashboard() {
  return (
    <main className="dashboard">
      <div className="dashboard__container">

        <header className="dashboard__header">
          <div>
            <span className="dashboard__eyebrow">
              PAINEL DO PROFISSIONAL
            </span>

            <h1 className="dashboard__title">
              Olá, <strong>João.</strong>
            </h1>

            <p className="dashboard__description">
              Gerencie sua agenda e seus horários.
            </p>
          </div>

          <button
            type="button"
            className="dashboard__logout"
          >
            Sair
          </button>
        </header>

        <section className="dashboard__overview">
          <article className="dashboard-card">
            <span>AGENDAMENTOS HOJE</span>
            <strong>4</strong>
          </article>

          <article className="dashboard-card">
            <span>PRÓXIMO HORÁRIO</span>
            <strong>10:30</strong>
          </article>

          <article className="dashboard-card">
            <span>ATENDIMENTOS</span>
            <strong>27</strong>
          </article>
        </section>

        <section className="dashboard__section">
          <div className="dashboard__section-header">
            <div>
              <span>AGENDA</span>
              <h2>Hoje</h2>
            </div>

            <button
              type="button"
              className="dashboard__date-button"
            >
              14 SET
            </button>
          </div>

          <div className="dashboard__appointments">
            <article className="appointment-card">
              <div className="appointment-card__time">
                <strong>08:00</strong>
                <span>50 min</span>
              </div>

              <div className="appointment-card__info">
                <strong>João Silva</strong>
                <span>Corte + Barba</span>
              </div>

              <span className="appointment-card__status">
                Confirmado
              </span>
            </article>

            <article className="appointment-card">
              <div className="appointment-card__time">
                <strong>09:30</strong>
                <span>30 min</span>
              </div>

              <div className="appointment-card__info">
                <strong>Pedro Santos</strong>
                <span>Corte Tradicional</span>
              </div>

              <span className="appointment-card__status">
                Confirmado
              </span>
            </article>

            <article className="appointment-card">
              <div className="appointment-card__time">
                <strong>11:00</strong>
                <span>20 min</span>
              </div>

              <div className="appointment-card__info">
                <strong>Lucas Oliveira</strong>
                <span>Barba</span>
              </div>

              <span className="appointment-card__status">
                Confirmado
              </span>
            </article>
          </div>
        </section>

        <section className="dashboard__section">
          <div className="dashboard__section-header">
            <div>
              <span>CONFIGURAÇÃO</span>
              <h2>Horários de atendimento</h2>
            </div>
          </div>

          <button
            type="button"
            className="dashboard__schedule-button"
          >
            Configurar horários
            <span>→</span>
          </button>
        </section>

      </div>
    </main>
  )
}

export default Dashboard