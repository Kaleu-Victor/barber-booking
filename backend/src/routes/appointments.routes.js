const { Router } = require('express')
const { bookAppointment, listAppointments, getMetrics } = require('../controllers/appointments.controller')

const router = Router()

router.get('/metrics', getMetrics)
router.get('/', listAppointments)
router.post('/', bookAppointment)

module.exports = router
