/**
 * Middleware de tratamento de erros centralizado.
 * Deve ser o ÚLTIMO middleware registrado no app.js.
 */

function errorHandler(err, req, res, next) {
  // Erros de negócio lançados explicitamente pelos services
  if (err.type === 'BUSINESS_ERROR') {
    return res.status(err.statusCode || 400).json({
      error: err.message,
      code: err.code,
    })
  }

  // Erro de conflito de serialização do Prisma (race condition)
  // Código P2034: transaction failed due to a write conflict or deadlock
  if (err.code === 'P2034') {
    return res.status(409).json({
      error: 'Horário não disponível. Outro agendamento foi confirmado ao mesmo tempo. Tente novamente.',
      code: 'SLOT_CONFLICT',
    })
  }

  // Violação de constraint unique do Prisma (ex: mesmo horário exato)
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Horário não disponível.',
      code: 'SLOT_TAKEN',
    })
  }

  // Registro não encontrado (ex: serviceId inválido)
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Recurso não encontrado.',
      code: 'NOT_FOUND',
    })
  }

  // Erros de validação de schema (Zod)
  if (err.name === 'ZodError') {
    return res.status(422).json({
      error: 'Dados inválidos.',
      code: 'VALIDATION_ERROR',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  // Fallback: erro interno não esperado
  console.error('[ErrorHandler]', err)

  return res.status(500).json({
    error: 'Erro interno do servidor.',
    code: 'INTERNAL_ERROR',
  })
}

// Fábrica para criar erros de negócio tipados
function createBusinessError(message, code, statusCode = 400) {
  const err = new Error(message)
  err.type = 'BUSINESS_ERROR'
  err.code = code
  err.statusCode = statusCode
  return err
}

module.exports = { errorHandler, createBusinessError }
