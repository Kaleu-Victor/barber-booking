const prisma = require('../lib/prisma')

/**
 * Controller para buscar a lista de serviços do barbeiro
 */
async function getServices(req, res, next) {
  try {
    // Para o MVP, fixamos o ID do barbeiro (só tem 1 barbeiro no banco)
    const barberId = 1 
    
    const services = await prisma.service.findMany({
      where: {
        barberId,
        isActive: true
      },
      orderBy: {
        priceInCents: 'asc'
      }
    })

    // Retorna os dados, transformando priceInCents para um formato útil no frontend se necessário
    // Por hora, deixaremos o frontend formatar
    res.json({ data: services })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getServices
}
