const { Router } = require('express')
const { getServices } = require('../controllers/services.controller')

const router = Router()

router.get('/', getServices)

module.exports = router
