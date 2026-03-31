import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Homepage from './pages/index.jsx'
import Login from './pages/login.jsx'
import Setup from './pages/setup.jsx'
import AppLayout from './components/AppLayout.jsx'
import Dashboard from './pages/app/dashboard.jsx'
import Jets from './pages/app/jets.jsx'
import Flights from './pages/app/flights.jsx'
import Billing from './pages/app/billing.jsx'
import Mission from './pages/app/mission.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="jets" element={<Jets />} />
            <Route path="flights" element={<Flights />} />
            <Route path="billing" element={<Billing />} />
            <Route path="mission" element={<Mission />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
