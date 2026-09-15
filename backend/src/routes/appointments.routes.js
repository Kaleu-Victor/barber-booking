const { Router } = require('express')
const { bookAppointment, listAppointments } = require('../controllers/appointments.controller')

const router = Router()

router.get('/', listAppointments)
router.post('/', bookAppointment)

module.exports = router
