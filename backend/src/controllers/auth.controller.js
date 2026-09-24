const prisma = require('../lib/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e senha são obrigatórios' })
    }

    const barber = await prisma.barber.findUnique({
      where: { username }
    })

    if (!barber) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    if (!barber.password) {
       return res.status(401).json({ error: 'Senha não configurada para este usuário' })
    }

    const isPasswordValid = await bcrypt.compare(password, barber.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      { barberId: barber.id },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1d' }
    )

    return res.json({
      token,
      barber: {
        id: barber.id,
        name: barber.name,
        username: barber.username
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { login }
