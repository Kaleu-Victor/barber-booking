const express = require('express')
const cors = require('cors')
const { errorHandler } = require('./middlewares/errorHandler')

// Import das rotas
const servicesRoutes = require('./routes/services.routes')
const scheduleRoutes = require('./routes/schedule.routes')
const availabilityRoutes = require('./routes/availability.routes')
const appointmentsRoutes = require('./routes/appointments.routes')
const authRoutes = require('./routes/auth.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()

app.use(cors())
app.use(express.json())

// Configuração das rotas
app.use('/api/services', servicesRoutes)
app.use('/api/working-hours', scheduleRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

// Middleware global de tratamento de erros (deve ser sempre o último)
app.use(errorHandler)

module.exports = app
