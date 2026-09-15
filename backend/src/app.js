const express = require('express')
const cors = require('cors')
const { errorHandler } = require('./middlewares/errorHandler')

// Import das rotas
const servicesRoutes = require('./routes/services.routes')
const scheduleRoutes = require('./routes/schedule.routes')
const availabilityRoutes = require('./routes/availability.routes')
const appointmentsRoutes = require('./routes/appointments.routes')

const app = express()

app.use(cors())
app.use(express.json())

// Configuração das rotas
app.use('/api/services', servicesRoutes)
app.use('/api/schedule', scheduleRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/appointments', appointmentsRoutes)

// Middleware global de tratamento de erros (deve ser sempre o último)
app.use(errorHandler)

module.exports = app
