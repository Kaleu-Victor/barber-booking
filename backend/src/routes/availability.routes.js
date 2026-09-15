const { Router } = require('express')
const { checkAvailability } = require('../controllers/availability.controller')

const router = Router()

router.get('/', checkAvailability)

module.exports = router
