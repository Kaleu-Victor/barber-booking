require('dotenv').config()
const prisma = require('../src/lib/prisma')
const bcrypt = require('bcrypt')

async function main() {
  console.log('Iniciando script de seed...')

  try {
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const existingBarber = await prisma.barber.findFirst()

    if (existingBarber) {
      console.log(`Barbeiro encontrado (ID: ${existingBarber.id}). Atualizando credenciais...`)
      
      const updatedBarber = await prisma.barber.update({
        where: { id: existingBarber.id },
        data: {
          username: 'admin',
          password: hashedPassword,
          whatsapp: '11999999999'
        }
      })
      
      console.log('Barbeiro atualizado com sucesso:', updatedBarber.username)
    } else {
      console.log('Nenhum barbeiro encontrado. Criando um novo...')
      
      const newBarber = await prisma.barber.create({
        data: {
          name: 'Barbeiro Principal',
          username: 'admin',
          password: hashedPassword,
          whatsapp: '11999999999'
        }
      })
      
      console.log('Barbeiro criado com sucesso:', newBarber.username)
    }

  } catch (error) {
    console.error('Erro ao executar o seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
