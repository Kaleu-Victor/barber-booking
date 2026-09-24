const prisma = require('../lib/prisma')
const bcrypt = require('bcrypt')

const updateProfile = async (req, res, next) => {
  try {
    const { name, whatsapp, username, currentPassword, newPassword } = req.body
    const barberId = req.barberId

    const barber = await prisma.barber.findUnique({ where: { id: barberId } })

    if (!barber) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' })
    }

    // Verificar senha atual se for mudar a senha ou o username/whatsapp/name? 
    // O prompt diz: "exigindo a senha atual para confirmar a troca" (pode ser só para a senha ou para qualquer dado, vamos exigir sempre se for atualizar algo)
    if (currentPassword) {
      if (!barber.password) {
        return res.status(400).json({ error: 'Barbeiro não possui senha configurada' })
      }
      const isPasswordValid = await bcrypt.compare(currentPassword, barber.password)
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha atual incorreta' })
      }
    } else {
        return res.status(400).json({ error: 'Senha atual é obrigatória para fazer alterações' })
    }

    const updateData = {}
    if (name) updateData.name = name
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp
    if (username) {
        // Verificar se username já existe
        const existing = await prisma.barber.findUnique({ where: { username } })
        if (existing && existing.id !== barberId) {
            return res.status(400).json({ error: 'Nome de utilizador já está em uso' })
        }
        updateData.username = username
    }
    
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    const updatedBarber = await prisma.barber.update({
      where: { id: barberId },
      data: updateData,
      select: { id: true, name: true, username: true, whatsapp: true }
    })

    return res.json(updatedBarber)

  } catch (error) {
    next(error)
  }
}

module.exports = { updateProfile }
