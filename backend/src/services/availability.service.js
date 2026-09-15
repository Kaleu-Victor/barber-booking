const prisma = require('../lib/prisma')

// ─── Helpers de tempo ─────────────────────────────────────────────────────────

/**
 * Converte "HH:MM" para minutos desde meia-noite.
 * @param {string} timeStr - ex.: "08:30"
 * @returns {number} minutos desde 00:00
 */
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Converte minutos desde meia-noite para "HH:MM".
 * @param {number} minutes
 * @returns {string} ex.: "08:30"
 */
function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Verifica se dois intervalos semiabertos [aStart, aEnd) e [bStart, bEnd) se sobrepõem.
 * Retorna true se houver qualquer sobreposição.
 *
 * Semântica: um serviço de 30 min às 11:30 ocupa [690, 720).
 * Uma pausa de 12:00 → 13:00 ocupa [720, 780).
 * 690 < 780 && 720 > 720 → false → DISPONÍVEL ✓
 *
 * Um serviço de 30 min às 11:45 ocupa [705, 735).
 * 705 < 780 && 735 > 720 → true → BLOQUEADO ✗
 */
function hasOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart
}

// ─── Engine de disponibilidade ────────────────────────────────────────────────

/**
 * Calcula os horários disponíveis para agendamento.
 *
 * @param {object} params
 * @param {number} params.barberId
 * @param {string} params.date - "YYYY-MM-DD"
 * @param {number} params.serviceId
 * @returns {Promise<Array<{id: string, time: string}>>}
 */
async function getAvailableSlots({ barberId, date, serviceId }) {
  // ── 1. Dia da semana da data solicitada (0=Dom, 6=Sáb) ──────────────────
  // Usa parseamento local para evitar off-by-one de timezone
  const [year, month, day] = date.split('-').map(Number)
  const requestedDate = new Date(year, month - 1, day)
  const dayOfWeek = requestedDate.getDay()

  // ── 2. Buscar configuração do dia + pausas ───────────────────────────────
  const workingHour = await prisma.workingHour.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
    include: { breaks: true },
  })

  if (!workingHour || !workingHour.enabled) {
    return [] // dia desativado ou não configurado
  }

  // ── 3. Verificar bloqueio excepcional do dia inteiro ────────────────────
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0)
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59)

  const isBlocked = await prisma.blockedDate.findFirst({
    where: {
      barberId,
      date: { gte: startOfDay, lte: endOfDay },
    },
  })

  if (isBlocked) {
    return [] // dia bloqueado excepcionalmente
  }

  // ── 4. Buscar serviço para obter duração ────────────────────────────────
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  })

  if (!service || !service.isActive) {
    return []
  }

  const duration = service.durationMinutes

  // ── 5. Buscar agendamentos confirmados do dia ────────────────────────────
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      barberId,
      status: { not: 'CANCELLED' },
      date: { gte: startOfDay, lte: endOfDay },
    },
    select: { date: true, endsAt: true },
  })

  // ── 6. Converter pausas e agendamentos para minutos ──────────────────────
  const breaks = workingHour.breaks.map((b) => ({
    start: timeToMinutes(b.startTime),
    end: timeToMinutes(b.endTime),
  }))

  // Agendamentos existentes: extrair hora e minuto do DateTime
  const occupied = existingAppointments.map((appt) => ({
    start: appt.date.getHours() * 60 + appt.date.getMinutes(),
    end: appt.endsAt.getHours() * 60 + appt.endsAt.getMinutes(),
  }))

  // ── 7. Gerar e filtrar slots candidatos ─────────────────────────────────
  const slotGranularity = 30 // minutos entre cada slot candidato
  const workStart = timeToMinutes(workingHour.startTime)
  const workEnd = timeToMinutes(workingHour.endTime)

  const available = []

  for (
    let slotStart = workStart;
    slotStart + duration <= workEnd;
    slotStart += slotGranularity
  ) {
    const slotEnd = slotStart + duration

    // Verificar sobreposição com pausas [breakStart, breakEnd)
    const conflictsBreak = breaks.some((b) =>
      hasOverlap(slotStart, slotEnd, b.start, b.end),
    )
    if (conflictsBreak) continue

    // Verificar sobreposição com agendamentos existentes
    const conflictsAppointment = occupied.some((a) =>
      hasOverlap(slotStart, slotEnd, a.start, a.end),
    )
    if (conflictsAppointment) continue

    const timeStr = minutesToTime(slotStart)
    available.push({ id: timeStr, time: timeStr })
  }

  return available
}

module.exports = { getAvailableSlots }
