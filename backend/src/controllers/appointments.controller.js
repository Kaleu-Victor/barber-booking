const { createAppointment } = require('../services/appointments.service')
const prisma = require('../lib/prisma')

const DEFAULT_BARBER_ID = 1 // Fixo para MVP

/**
 * Normaliza um telefone para o formato padrão de 11 dígitos (Brasil).
 * Remove caracteres não numéricos e o prefixo "55" se estiver presente.
 */
function normalizePhone(phone) {
  if (!phone) return ''
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 13 && digits.startsWith('55')) {
    digits = digits.substring(2)
  }
  return digits
}

/**
 * Cria uma data 'naive' baseada no horário atual de Brasília.
 * Isso garante que as comparações de data funcionem corretamente
 * independentemente de o servidor rodar em UTC (ex: Vercel) ou localmente.
 */
function getLocalNow() {
  const brTimeStr = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  return new Date(brTimeStr)
}

async function bookAppointment(req, res, next) {
  try {
    const { serviceId, date, time, clientName, whatsapp } = req.body

    const appointment = await createAppointment({
      barberId: DEFAULT_BARBER_ID,
      serviceId,
      date,
      time,
      clientName,
      whatsapp: normalizePhone(whatsapp)
    })

    res.status(201).json({
      message: 'Agendamento confirmado com sucesso.',
      data: appointment
    })
  } catch (error) {
    next(error)
  }
}

async function listAppointments(req, res, next) {
  try {
    const barberId = req.query.barberId
      ? parseInt(req.query.barberId, 10)
      : DEFAULT_BARBER_ID

    // Filtro por data: se "date" (YYYY-MM-DD) vier na query, busca apenas
    // agendamentos cujo campo "date" (DateTime) caia naquele dia.
    let dateFilter = {}
    if (req.query.date) {
      // Usa midnight local para coincidir com como os agendamentos são criados
      const [y, mo, d] = req.query.date.split('-').map(Number)
      const dayStart = new Date(y, mo - 1, d, 0, 0, 0, 0)
      const dayEnd   = new Date(y, mo - 1, d, 23, 59, 59, 999)
      dateFilter = {
        date: {
          gte: dayStart,
          lte: dayEnd
        }
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        barberId,
        status: { not: 'CANCELLED' },
        ...dateFilter
      },
      include: {
        client: true,
        service: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    res.json({ data: appointments })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/appointments/metrics?barberId=1
 * Retorna métricas agregadas para os cards do topo do Dashboard.
 */
async function getMetrics(req, res, next) {
  try {
    const barberId = req.query.barberId
      ? parseInt(req.query.barberId, 10)
      : DEFAULT_BARBER_ID

    const now = getLocalNow()

    // Início e fim do dia atual no fuso local do servidor
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    // 1. Agendamentos confirmados para hoje
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        barberId,
        status: { not: 'CANCELLED' },
        date: { gte: todayStart, lte: todayEnd }
      },
      orderBy: { date: 'asc' },
      select: { date: true }
    })

    const todayCount = todayAppointments.length

    // 2. Próximo horário a partir de agora
    const next_appointment = await prisma.appointment.findFirst({
      where: {
        barberId,
        status: { not: 'CANCELLED' },
        date: { gte: now }
      },
      orderBy: { date: 'asc' },
      select: { date: true }
    })

    const nextTime = next_appointment
      ? next_appointment.date.toISOString().split('T')[1].substring(0, 5)
      : null

    // 3. Total histórico de atendimentos confirmados/concluídos
    const totalCount = await prisma.appointment.count({
      where: {
        barberId,
        status: { not: 'CANCELLED' }
      }
    })

    res.json({
      data: {
        todayCount,
        nextTime,
        totalCount
      }
    })
  } catch (error) {
    next(error)
  }
}

async function updateAppointmentStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['CONFIRMED', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id, 10) }
    })

    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' })
    }

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id, 10) },
      data: { status }
    })

    res.json({ data: updated })
  } catch (error) {
    next(error)
  }
}

async function getClientAppointments(req, res, next) {
  try {
    const { phone } = req.query
    if (!phone) {
      return res.status(400).json({ error: 'Telefone é obrigatório.' })
    }

    // Normalizar telefone (apenas números, remover 55)
    const cleanPhone = normalizePhone(phone)

    const now = getLocalNow()

    const appointments = await prisma.appointment.findMany({
      where: {
        client: {
          whatsapp: cleanPhone
        },
        status: 'CONFIRMED',
        date: { gte: now }
      },
      include: {
        barber: true,
        service: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    res.json({ data: appointments })
  } catch (error) {
    next(error)
  }
}

async function clientCancelAppointment(req, res, next) {
  try {
    const { id } = req.params
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({ error: 'Telefone é obrigatório.' })
    }

    const cleanPhone = normalizePhone(phone)

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id, 10) },
      include: { client: true }
    })

    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' })
    }

    // Verificar se pertence ao telefone
    const apptPhone = normalizePhone(appointment.client.whatsapp)
    if (apptPhone !== cleanPhone) {
      return res.status(403).json({ error: 'Telefone não corresponde ao agendamento.' })
    }

    if (appointment.status !== 'CONFIRMED') {
      return res.status(400).json({ error: 'Agendamento não pode ser cancelado (status inválido).' })
    }

    const now = getLocalNow()
    if (new Date(appointment.date) < now) {
      return res.status(400).json({ error: 'Não é possível cancelar agendamentos passados.' })
    }

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id, 10) },
      data: { status: 'CANCELLED' }
    })

    res.json({ data: updated })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  bookAppointment,
  listAppointments,
  getMetrics,
  updateAppointmentStatus,
  getClientAppointments,
  clientCancelAppointment
}
