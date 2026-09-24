const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key')
    req.barberId = decoded.barberId
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

module.exports = { authMiddleware }
