import { createContext, useState } from 'react';

export const ParkingContext = createContext();

const generateSpots = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status:
      Math.random() > 0.7
        ? 'taken'
        : Math.random() > 0.9
        ? 'reserved'
        : 'vacant',
  }));

const initialAreas = [
  { name: 'RTL AREA', spots: generateSpots(20) },
  { name: 'OPEN AREA', spots: generateSpots(20) },
  { name: 'BACKGATE', spots: generateSpots(20) },
];

export const ParkingProvider = ({ children }) => {
  const [parkingAreas, setParkingAreas] = useState(initialAreas);

  const [reservations, setReservations] = useState([
    {
      id: 1,
      spotId: null,
      area: 'RTL AREA',
      vehicle: 'CAR',
      time: '2:00PM',
      date: '3/14/2026',
      status: 'ACTIVE',
      minutesLeft: '10:37'
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'System Ready',
      message: 'Parking system initialized.',
      time: 'Just now',
      read: false,
    }
  ]);

  const reserveSpot = (areaName, spotId, vehicle, time) => {
    setParkingAreas(prev =>
      prev.map(area => {
        if (area.name === areaName || area.name.includes(areaName)) {
          return {
            ...area,
            spots: area.spots.map(spot =>
              spot.id.toString() === spotId.toString()
                ? { ...spot, status: 'taken' }
                : spot
            )
          };
        }
        return area;
      })
    );

    const newReservation = {
      id: Date.now(),
      spotId,
      area: areaName,
      vehicle,
      time,
      date: new Date().toLocaleDateString(),
      status: 'ACTIVE',
      minutesLeft: '15:00'
    };

    setReservations(prev => [...prev, newReservation]);

    const newNotification = {
      id: Date.now(),
      title: 'Reservation Confirmed',
      message: `Your ${vehicle} spot at ${areaName} has been reserved.`,
      time: 'Just now',
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const cancelReservation = (reservationId) => {
    const res = reservations.find(r => r.id === reservationId);

    if (res && res.spotId) {
      setParkingAreas(prev =>
        prev.map(area => {
          if (area.name === res.area || area.name.includes(res.area)) {
            return {
              ...area,
              spots: area.spots.map(spot =>
                spot.id.toString() === res.spotId.toString()
                  ? { ...spot, status: 'vacant' }
                  : spot
              )
            };
          }
          return area;
        })
      );
    }

    setReservations(prev => prev.filter(r => r.id !== reservationId));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <ParkingContext.Provider
      value={{
        parkingAreas,
        reservations,
        notifications,
        reserveSpot,
        cancelReservation,
        markAllAsRead
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};