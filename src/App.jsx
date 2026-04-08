import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Homepage from './pages/index.jsx'
import Login from './pages/login.jsx'
import Welcome from './pages/welcome.jsx'
import Privacy from './pages/privacy.jsx'
import Terms from './pages/terms.jsx'
import NotFound from './pages/404.jsx'
import AppLayout from './components/AppLayout.jsx'
import Dashboard from './pages/app/dashboard.jsx'
import Intel from './pages/app/intel.jsx'
import Fleet from './pages/app/fleet.jsx'
import Track from './pages/app/track.jsx'
import Plan from './pages/app/plan.jsx'
import Billing from './pages/app/billing.jsx'
import Settings from './pages/app/settings.jsx'
import CookieBanner from './components/CookieBanner.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="intel" element={<Intel />} />
            <Route path="fleet" element={<Fleet />} />
            <Route path="track" element={<Track />} />
            <Route path="plan" element={<Plan />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
      </BrowserRouter>
    </AuthProvider>
  )
}