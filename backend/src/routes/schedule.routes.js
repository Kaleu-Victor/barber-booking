const { Router } = require('express')
const { getSchedule, updateSchedule } = require('../controllers/schedule.controller')

const router = Router()

router.get('/', getSchedule)
router.put('/', updateSchedule)

module.exports = router
