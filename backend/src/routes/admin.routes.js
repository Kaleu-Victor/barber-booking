const express = require('express')
const { updateProfile } = require('../controllers/admin.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')

const router = express.Router()

router.put('/profile', authMiddleware, updateProfile)

module.exports = router
