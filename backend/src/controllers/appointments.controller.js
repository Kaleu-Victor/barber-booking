const { createAppointment } = require('../services/appointments.service')
const prisma = require('../lib/prisma')

const barberId = 1 // Fixo para MVP

async function bookAppointment(req, res, next) {
  try {
    const { serviceId, date, time, clientName, whatsapp } = req.body

    const appointment = await createAppointment({
      barberId,
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
    // Útil para o dashboard futuramente
    const appointments = await prisma.appointment.findMany({
      where: { barberId },
      include: {
        client: true,
        service: true
      },
      orderBy: {
        date: 'desc'
      }
    })

    res.json({ data: appointments })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  bookAppointment,
  listAppointments
}
