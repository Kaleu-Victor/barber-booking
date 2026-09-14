import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import Booking from './pages/Booking/Booking'
import BookingSuccess from './pages/Booking/BookingSuccess'
import Dashboard from './pages/dashboard/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendar" element={<Booking />} />
      <Route
        path="/agendamento/sucesso"
        element={<BookingSuccess />}
      />
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />
    </Routes>
  )
}

export default App