const { Prisma } = require('@prisma/client')
const prisma = require('../lib/prisma')
const { createBusinessError } = require('../middlewares/errorHandler')
const { getAvailableSlots } = require('./availability.service')

/**
 * Cria um novo agendamento, garantindo consistência contra concorrência
 * utilizando isolamento SERIALIZABLE.
 * 
 * @param {object} params
 * @param {number} params.barberId
 * @param {number} params.serviceId
 * @param {string} params.date "YYYY-MM-DD"
 * @param {string} params.time "HH:MM"
 * @param {string} params.clientName
 * @param {string} params.whatsapp
 */
async function createAppointment({ barberId, serviceId, date, time, clientName, whatsapp }) {
  // 1. Validar se o serviço existe e recuperar a duração
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  })

  if (!service || !service.isActive || service.barberId !== barberId) {
    throw createBusinessError('Serviço inválido ou inativo', 'INVALID_SERVICE', 400)
  }

  // 2. Calcular o DateTime exato de início e fim
  // O formato no frontend vem separado em "date" e "time".
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  
  // Utilizando UTC para evitar inconsistências de fuso horário, 
  // já que o projeto local pode não lidar explicitamente com TZ ainda.
  // Como as datas vêm de um seletor local, a ideia é apenas armazenar 
  // de forma consistente no banco. O ideal para produção seria Date.UTC().
  // Para MVP simplificado, tratamos o horário de forma fixa:
  const startDate = new Date(year, month - 1, day, hours, minutes, 0)
  const endsAtDate = new Date(startDate.getTime() + service.durationMinutes * 60000)

  // 3. Checar a disponibilidade inicial do dia inteiro usando a engine
  const slots = await getAvailableSlots({ barberId, date, serviceId })
  const isTimeAvailable = slots.some(slot => slot.time === time)

  if (!isTimeAvailable) {
    throw createBusinessError('Este horário não está disponível', 'SLOT_UNAVAILABLE', 400)
  }

  // 4. Executar transação SERIALIZABLE para garantir integridade e previnir race-condition
  return await prisma.$transaction(
    async (tx) => {
      // 4a. A dependência de leitura: verificar sobreposição novamente
      // Isso sinaliza ao banco no modo serializável quais registros importam.
      const conflict = await tx.appointment.findFirst({
        where: {
          barberId,
          status: { not: 'CANCELLED' },
          AND: [
            { date: { lt: endsAtDate } },   // Existente começa antes de nós acabarmos
            { endsAt: { gt: startDate } }   // Existente termina depois de começarmos
          ]
        }
      })

      if (conflict) {
        throw createBusinessError('Horário não disponível. Outro agendamento foi confirmado simultaneamente.', 'SLOT_CONFLICT', 409)
      }

      // 4b. Registrar o cliente
      const client = await tx.client.create({
        data: {
          name: clientName,
          whatsapp
        }
      })

      // 4c. Criar o agendamento
      const appointment = await tx.appointment.create({
        data: {
          barberId,
          serviceId,
          clientId: client.id,
          date: startDate,
          endsAt: endsAtDate,
          status: 'CONFIRMED'
        },
        include: {
          service: true,
          client: true,
          barber: true
        }
      })

      return appointment
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5000,
      timeout: 10000
    }
  )
}

module.exports = {
  createAppointment
}
