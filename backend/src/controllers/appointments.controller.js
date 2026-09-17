const { createAppointment } = require('../services/appointments.service')
const prisma = require('../lib/prisma')

const DEFAULT_BARBER_ID = 1 // Fixo para MVP

async function bookAppointment(req, res, next) {
  try {
    const { serviceId, date, time, clientName, whatsapp } = req.body

    const appointment = await createAppointment({
      barberId: DEFAULT_BARBER_ID,
      serviceId,
      date,
      time,
      clientName,
      whatsapp
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

    const now = new Date()

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
      ? next_appointment.date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })
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

module.exports = {
  bookAppointment,
  listAppointments,
  getMetrics
}
