import { useState, useEffect, useCallback } from 'react'
import { initialScheduleConfig } from '../../data/scheduleConfig'
import ScheduleModal from '../../components/dashboard/ScheduleModal'
import { getAppointments, getAppointmentMetrics } from '../../services/appointmentsApi'
import { getSchedule, updateSchedule } from '../../services/scheduleApi'
import './Dashboard.css'

const BARBER_ID = 1 // MVP fixo

/** Formata um Date (ou string ISO) para "HH:mm" no fuso local */
function formatTime(dateValue) {
  const d = new Date(dateValue)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

/** Retorna a string "YYYY-MM-DD" para uma data local */
function toLocalDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Formata "YYYY-MM-DD" → "DD MMM" ex: "17 SET" */
function formatDateLabel(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  const dayStr = String(d.getDate()).padStart(2, '0')
  const monthStr = d.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '')
  return `${dayStr} ${monthStr}`
}

/** Verifica se a data ISO passada é hoje */
function isToday(isoDate) {
  return isoDate === toLocalDateString(new Date())
}

/** Mapeamento de status → label e classe CSS */
const STATUS_MAP = {
  CONFIRMED: { label: 'Confirmado', cls: 'status--confirmed' },
  PENDING:   { label: 'Pendente',   cls: 'status--pending'   },
  DONE:      { label: 'Concluído',  cls: 'status--done'      },
  CANCELLED: { label: 'Cancelado',  cls: 'status--cancelled' },
}

function AppointmentCard({ appointment }) {
  const startTime = formatTime(appointment.date)
  const duration  = appointment.service?.durationMinutes ?? 0
  const durationLabel = duration ? `${duration} min` : '—'
  const clientName = appointment.client?.name ?? 'Cliente'
  const serviceName = appointment.service?.name ?? 'Serviço'
  const statusInfo = STATUS_MAP[appointment.status] ?? { label: appointment.status, cls: '' }

  return (
    <article className="appointment-card">
      <div className="appointment-card__time">
        <strong>{startTime}</strong>
        <span>{durationLabel}</span>
      </div>

      <div className="appointment-card__info">
        <strong>{clientName}</strong>
        <span>{serviceName}</span>
      </div>

      <span className={`appointment-card__status ${statusInfo.cls}`}>
        {statusInfo.label}
      </span>
    </article>
  )
}

function Dashboard() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isScheduleLoading, setIsScheduleLoading] = useState(false)
  const [scheduleConfig, setScheduleConfig]   = useState(initialScheduleConfig)

  // ── Data selecionada ──────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState(toLocalDateString(new Date()))

  // ── Agendamentos do dia ───────────────────────────────────────────────
  const [appointments, setAppointments]   = useState([])
  const [apptLoading, setApptLoading]     = useState(false)
  const [apptError, setApptError]         = useState(null)

  // ── Métricas (cards do topo) ──────────────────────────────────────────
  const [metrics, setMetrics]             = useState(null)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [metricsError, setMetricsError]   = useState(null)

  // ── Busca agendamentos sempre que a data muda ─────────────────────────
  const fetchAppointments = useCallback(async (date) => {
    setApptLoading(true)
    setApptError(null)
    try {
      const data = await getAppointments({ barberId: BARBER_ID, date })
      setAppointments(data ?? [])
    } catch (err) {
      setApptError('Não foi possível carregar os agendamentos. Tente novamente.')
      setAppointments([])
    } finally {
      setApptLoading(false)
    }
  }, [])

  // ── Busca métricas ao montar ──────────────────────────────────────────
  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true)
    setMetricsError(null)
    try {
      const data = await getAppointmentMetrics({ barberId: BARBER_ID })
      setMetrics(data)
    } catch (err) {
      setMetricsError(true)
    } finally {
      setMetricsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments(selectedDate)
  }, [selectedDate, fetchAppointments])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  const handleOpenScheduleModal = async () => {
    setIsScheduleLoading(true)
    try {
      const data = await getSchedule()
      if (data && data.length > 0) {
        setScheduleConfig(data)
      }
      setIsScheduleModalOpen(true)
    } catch (err) {
      alert('Erro ao carregar configurações de agenda.')
    } finally {
      setIsScheduleLoading(false)
    }
  }

  const handleSaveSchedule = async (newConfig) => {
    try {
      await updateSchedule(newConfig)
      setScheduleConfig(newConfig)
      return true
    } catch (err) {
      alert(err.message || 'Erro ao salvar configurações de agenda.')
      throw err
    }
  }

  // ── Labels derivados ──────────────────────────────────────────────────
  const dateLabel    = formatDateLabel(selectedDate)
  const sectionTitle = isToday(selectedDate) ? 'Hoje' : dateLabel

  const todayCount   = metricsLoading ? '…' : (metricsError ? '—' : (metrics?.todayCount ?? 0))
  const nextTime     = metricsLoading ? '…' : (metricsError ? '—' : (metrics?.nextTime  ?? '—'))
  const totalCount   = metricsLoading ? '…' : (metricsError ? '—' : (metrics?.totalCount ?? 0))

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

        {/* ── Cards de métricas ────────────────────────────────── */}
        <section className="dashboard__overview">
          <article className="dashboard-card">
            <span>AGENDAMENTOS HOJE</span>
            <strong>{todayCount}</strong>
          </article>

          <article className="dashboard-card">
            <span>PRÓXIMO HORÁRIO</span>
            <strong>{nextTime}</strong>
          </article>

          <article className="dashboard-card">
            <span>ATENDIMENTOS</span>
            <strong>{totalCount}</strong>
          </article>
        </section>

        {/* ── Seção de Agenda ──────────────────────────────────── */}
        <section className="dashboard__section">
          <div className="dashboard__section-header">
            <div>
              <span>AGENDA</span>
              <h2>{sectionTitle}</h2>
            </div>

            {/* Seletor de data nativo escondido atrás do botão estilizado */}
            <label className="dashboard__date-label" htmlFor="agenda-date-picker">
              <span className="dashboard__date-button">
                {dateLabel}
              </span>
              <input
                id="agenda-date-picker"
                type="date"
                className="dashboard__date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </label>
          </div>

          <div className="dashboard__appointments">
            {/* Estado de carregamento */}
            {apptLoading && (
              <div className="dashboard__feedback">
                <span className="dashboard__feedback-icon">⏳</span>
                <p>Carregando agendamentos...</p>
              </div>
            )}

            {/* Estado de erro */}
            {!apptLoading && apptError && (
              <div className="dashboard__feedback dashboard__feedback--error">
                <span className="dashboard__feedback-icon">⚠️</span>
                <p>{apptError}</p>
                <button
                  type="button"
                  className="dashboard__retry-button"
                  onClick={() => fetchAppointments(selectedDate)}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {/* Empty state */}
            {!apptLoading && !apptError && appointments.length === 0 && (
              <div className="dashboard__feedback">
                <span className="dashboard__feedback-icon">📅</span>
                <p>Nenhum agendamento para este dia.</p>
              </div>
            )}

            {/* Lista de agendamentos */}
            {!apptLoading && !apptError && appointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        </section>

        {/* ── Configuração de horários ─────────────────────────── */}
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
            onClick={handleOpenScheduleModal}
            disabled={isScheduleLoading}
          >
            {isScheduleLoading ? 'Carregando...' : 'Configurar horários'}
            {!isScheduleLoading && <span>→</span>}
          </button>
        </section>

      </div>

      {isScheduleModalOpen && (
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          scheduleConfig={scheduleConfig}
          onSave={handleSaveSchedule}
        />
      )}
    </main>
  )
}

export default Dashboard