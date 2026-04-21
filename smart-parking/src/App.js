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
import SuccessReservation from './pages/SuccessReservation';

export default function App() {
  return (
    <BrowserRouter>
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
        <Route path="/success-reservation" element={<SuccessReservation />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
