const { PrismaClient } = require('@prisma/client')

// Singleton do PrismaClient — reutilizado em todo o app
// evita múltiplas conexões abertas durante o ciclo de vida do servidor
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

module.exports = prisma
