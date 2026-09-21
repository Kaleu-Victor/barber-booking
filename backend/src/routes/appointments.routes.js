const { Router } = require('express')
const { bookAppointment, listAppointments, getMetrics, updateAppointmentStatus } = require('../controllers/appointments.controller')

const router = Router()

router.get('/metrics', getMetrics)
router.get('/', listAppointments)
router.post('/', bookAppointment)
router.patch('/:id/status', updateAppointmentStatus)

module.exports = router
