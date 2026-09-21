import './ClientForm.css'

// Máscara simples para celular (99) 99999-9999
function formatPhone(value) {
  const digits = value.replace(/\D/g, '').substring(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

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
              onWhatsappChange(formatPhone(event.target.value))
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