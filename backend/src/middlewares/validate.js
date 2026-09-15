const { z } = require('zod')

/**
 * Fábrica de middleware de validação com Zod.
 * Uso: router.post('/', validate(MySchema), controller)
 *
 * @param {z.ZodSchema} schema - schema Zod que valida req.body
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return next(result.error) // repassado ao errorHandler (ZodError)
    }

    // Substitui req.body pelo valor parseado e coercido pelo Zod
    req.body = result.data
    return next()
  }
}

module.exports = { validate }
