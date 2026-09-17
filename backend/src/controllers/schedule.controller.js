const prisma = require('../lib/prisma')
const { createBusinessError } = require('../middlewares/errorHandler')

const DEFAULT_BARBER_ID = 1 // Fixo para MVP

async function getSchedule(req, res, next) {
  try {
    const barberId = req.query.barberId
      ? parseInt(req.query.barberId, 10)
      : DEFAULT_BARBER_ID

    // Busca todos os working hours ordenados por dia da semana
    const schedule = await prisma.workingHour.findMany({
      where: { barberId },
      include: {
        breaks: {
          orderBy: { startTime: 'asc' }
        }
      },
      orderBy: {
        dayOfWeek: 'asc'
      }
    })

    res.json({ data: schedule })
  } catch (error) {
    next(error)
  }
}

async function updateSchedule(req, res, next) {
  try {
    const barberId = req.query.barberId
      ? parseInt(req.query.barberId, 10)
      : DEFAULT_BARBER_ID

    const { schedule } = req.body

    if (!Array.isArray(schedule)) {
      throw createBusinessError('Formato inválido. Esperado array.', 'INVALID_FORMAT', 400)
    }

    // Validação simples
    for (const day of schedule) {
      if (day.enabled) {
        if (day.startTime >= day.endTime) {
          throw createBusinessError(`Horário de abertura deve ser menor que o fechamento no dia ${day.dayOfWeek}.`, 'INVALID_TIME', 400)
        }
        if (day.breaks) {
          for (const b of day.breaks) {
            if (b.startTime >= b.endTime) {
              throw createBusinessError(`Intervalo inválido no dia ${day.dayOfWeek}.`, 'INVALID_TIME', 400)
            }
          }
        }
      }
    }

    // Usando transação para garantir que a atualização de toda a semana seja atômica
    await prisma.$transaction(
      schedule.map(dayConfig => {
        const breaks = dayConfig.breaks || []
        return prisma.workingHour.upsert({
          where: {
            barberId_dayOfWeek: {
              barberId,
              dayOfWeek: dayConfig.dayOfWeek
            }
          },
          update: {
            enabled: dayConfig.enabled,
            startTime: dayConfig.startTime,
            endTime: dayConfig.endTime,
            breaks: {
              deleteMany: {}, // Remove pausas anteriores
              create: breaks.map(b => ({
                startTime: b.startTime,
                endTime: b.endTime
              }))
            }
          },
          create: {
            barberId,
            dayOfWeek: dayConfig.dayOfWeek,
            enabled: dayConfig.enabled,
            startTime: dayConfig.startTime,
            endTime: dayConfig.endTime,
            breaks: {
              create: breaks.map(b => ({
                startTime: b.startTime,
                endTime: b.endTime
              }))
            }
          }
        })
      })
    )

    res.json({ message: 'Horários atualizados com sucesso.' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSchedule,
  updateSchedule
}
