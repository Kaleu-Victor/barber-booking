import { Routes, Route } from 'react-router-dom'

import Home from './pages/home/Home'
import Booking from './pages/booking/Booking'
import BookingSuccess from './pages/booking/BookingSuccess'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/dashboard/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendar" element={<Booking />} />
      <Route
        path="/agendamento/sucesso"
        element={<BookingSuccess />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App