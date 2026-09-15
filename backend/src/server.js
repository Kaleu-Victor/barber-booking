require('dotenv').config()
const app = require('./app')
const prisma = require('./lib/prisma')

const PORT = process.env.PORT || 3333

// Verificação simples da conexão com o banco antes de escutar requisições
async function startServer() {
  try {
    await prisma.$connect()
    console.log('✅ Conexão com o banco de dados estabelecida.')

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
    })
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error)
    process.exit(1)
  }
}

startServer()
