const prisma = require('../lib/prisma')
const { createBusinessError } = require('../middlewares/errorHandler')

const barberId = 1 // Fixo para MVP

async function getSchedule(req, res, next) {
  try {
    // Busca todos os working hours ordenados por dia da semana
    const schedule = await prisma.workingHour.findMany({
      where: { barberId },
      include: {
        breaks: true
      },
      orderBy: {
        dayOfWeek: 'asc'
      }
    })

    // O frontend espera um formato específico. O schema Prisma foi modelado 
    // praticamente 1:1, exceto por IDs nas pausas (usamos IDs do banco).
    res.json({ data: schedule })
  } catch (error) {
    next(error)
  }
}

async function updateSchedule(req, res, next) {
  try {
    const { schedule } = req.body

    if (!Array.isArray(schedule)) {
      throw createBusinessError('Formato inválido. Esperado array.', 'INVALID_FORMAT', 400)
    }

    // Usando transação para garantir que a atualização de toda a semana seja atômica
    await prisma.$transaction(
      schedule.map(dayConfig => {
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
              create: dayConfig.breaks.map(b => ({
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
              create: dayConfig.breaks.map(b => ({
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
