import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/index.jsx'
import AppLayout from './components/AppLayout.jsx'
import Dashboard from './pages/app/dashboard.jsx'
import Jets from './pages/app/jets.jsx'
import Flights from './pages/app/flights.jsx'
import Billing from './pages/app/billing.jsx'
import Mission from './pages/app/mission.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jets" element={<Jets />} />
          <Route path="flights" element={<Flights />} />
          <Route path="billing" element={<Billing />} />
          <Route path="mission" element={<Mission />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}