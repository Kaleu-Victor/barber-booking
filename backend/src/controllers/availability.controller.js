const { getAvailableSlots } = require('../services/availability.service')

const barberId = 1 // Fixo para MVP

async function checkAvailability(req, res, next) {
  try {
    const { date, serviceId } = req.query

    // Validações simples, o Zod faria isso mas podemos garantir manualmente também
    // A rota validate.js será útil no POST. Para GET com query as vezes é mais simples:
    if (!date || !serviceId) {
      return res.status(400).json({ error: 'date e serviceId são obrigatórios' })
    }

    const slots = await getAvailableSlots({
      barberId,
      date,
      serviceId: parseInt(serviceId, 10)
    })

    res.json({ data: slots })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkAvailability
}
