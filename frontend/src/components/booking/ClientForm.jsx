import './ClientForm.css'

function ClientForm({
  name,
  whatsapp,
  onNameChange,
  onWhatsappChange,
}) {
  return (
    <div className="client-form">
      <div className="client-form__header">
        <span>04</span>

        <div>
          <p>QUASE LÁ</p>
          <h2>Seus dados</h2>
        </div>
      </div>

      <div className="client-form__fields">
        <div className="client-form__field">
          <label htmlFor="client-name">
            Nome
          </label>

          <input
            id="client-name"
            type="text"
            value={name}
            onChange={(event) =>
              onNameChange(event.target.value)
            }
            placeholder="Digite seu nome"
            autoComplete="name"
          />
        </div>

        <div className="client-form__field">
          <label htmlFor="client-whatsapp">
            WhatsApp
          </label>

          <input
            id="client-whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(event) =>
              onWhatsappChange(event.target.value)
            }
            placeholder="(00) 00000-0000"
            autoComplete="tel"
          />
        </div>
      </div>

      <p className="client-form__notice">
        Usaremos seu WhatsApp apenas para informações
        sobre o agendamento.
      </p>
    </div>
  )
}

export default ClientForm