import { Routes, Route } from 'react-router-dom'

import Home from './pages/home/Home'
import Booking from './pages/booking/Booking'
import BookingSuccess from './pages/booking/BookingSuccess'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendar" element={<Booking />} />
      <Route path="/agendamento/sucesso" element={<BookingSuccess />} />
    </Routes>
  )
}

export default App