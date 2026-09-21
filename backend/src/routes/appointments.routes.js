const { Router } = require('express')
const { bookAppointment, listAppointments, getMetrics, updateAppointmentStatus, getClientAppointments, clientCancelAppointment } = require('../controllers/appointments.controller')

const router = Router()

router.get('/metrics', getMetrics)
router.get('/client', getClientAppointments) // MUST be before /:id
router.get('/', listAppointments)
router.post('/', bookAppointment)
router.patch('/:id/status', updateAppointmentStatus)
router.patch('/:id/client-cancel', clientCancelAppointment)

module.exports = router
