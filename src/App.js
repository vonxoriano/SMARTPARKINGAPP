import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ParkingMap from './pages/ParkingMap';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import MyReservations from './pages/MyReservations';
import ReserveSpot from './pages/ReserveSpot';
import ReservationSuccess from './pages/ReservationSuccess';
import bgImage from './assets/cit-background.png';

export default function App() {
  return (
    <BrowserRouter>
      {/* Persistent full-page background — never unmounts */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -2,
      }} />
      {/* Dark blur overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backdropFilter: 'blur(6px)',
        background: 'rgba(0,0,0,0.45)',
        zIndex: -1,
      }} />

      {/* Scrollable page content */}
      <div style={{ minHeight: '100vh', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parking-map" element={<ParkingMap />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reservations" element={<MyReservations />} />
          <Route path="/reserve-spot" element={<ReserveSpot />} />
          <Route path="/reservation-success" element={<ReservationSuccess />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
