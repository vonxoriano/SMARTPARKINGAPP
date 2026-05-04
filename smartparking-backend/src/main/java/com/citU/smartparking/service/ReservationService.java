package com.citU.smartparking.service;

import com.citU.smartparking.model.*;
import com.citU.smartparking.model.Reservation.Status;
import com.citU.smartparking.model.Reservation.Vehicle;
import com.citU.smartparking.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired private ReservationRepository reservationRepository;
    @Autowired private UserService           userService;
    @Autowired private ParkingService        parkingService;

    // ── CREATE ──────────────────────────────────────────────────────────────

    /**
     * Create a new reservation.
     * - Verifies the spot is VACANT.
     * - Marks the spot RESERVED.
     * - Saves the Reservation record.
     */
    @Transactional
    public Reservation createReservation(Long userId, Long spotId,
                                         String vehicleStr, LocalDate date,
                                         LocalTime time, int durationHours) {

        User user = userService.getUserById(userId);
        ParkingSpot spot = parkingService.getSpotById(spotId);

        // Guard: spot must be vacant
        if (spot.getStatus() != ParkingSpot.Status.VACANT) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Spot " + spotId + " is not available (status: " + spot.getStatus() + ")");
        }

        // Mark spot as RESERVED
        parkingService.updateSpotStatus(spotId, ParkingSpot.Status.RESERVED);

        // Build and save reservation
        Reservation res = new Reservation();
        res.setUser(user);
        res.setSpot(spot);
        res.setVehicle(Vehicle.valueOf(vehicleStr.toUpperCase()));
        res.setDate(date);
        res.setTime(time);
        res.setDurationHours(durationHours);
        res.setStatus(Status.ACTIVE);

        return reservationRepository.save(res);
    }

    // ── READ ────────────────────────────────────────────────────────────────

    /** Get all reservations for a user. */
    public List<Reservation> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    /** Get reservations for a user filtered by status. */
    public List<Reservation> getReservationsByUserAndStatus(Long userId, String statusStr) {
        Status status = Status.valueOf(statusStr.toUpperCase());
        return reservationRepository.findByUserIdAndStatus(userId, status);
    }

    /** Get a single reservation by ID. */
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Reservation not found: " + id));
    }

    /** Get all reservations (admin). */
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // ── UPDATE ──────────────────────────────────────────────────────────────

    /** Mark a reservation as COMPLETED (admin or scheduled job). */
    @Transactional
    public Reservation completeReservation(Long reservationId) {
        Reservation res = getReservationById(reservationId);
        res.setStatus(Status.COMPLETED);
        // Free the spot
        parkingService.updateSpotStatus(res.getSpot().getId(), ParkingSpot.Status.VACANT);
        return reservationRepository.save(res);
    }

    // ── DELETE (Cancel) ──────────────────────────────────────────────────────

    /**
     * Cancel a reservation.
     * - Only ACTIVE reservations can be cancelled.
     * - Restores the spot to VACANT.
     */
    @Transactional
    public Reservation cancelReservation(Long reservationId) {
        Reservation res = getReservationById(reservationId);

        if (res.getStatus() != Status.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only ACTIVE reservations can be cancelled. Current status: " + res.getStatus());
        }

        res.setStatus(Status.CANCELLED);
        parkingService.updateSpotStatus(res.getSpot().getId(), ParkingSpot.Status.VACANT);
        return reservationRepository.save(res);
    }

    /** Hard-delete a reservation record (admin only). */
    public void deleteReservation(Long reservationId) {
        if (!reservationRepository.existsById(reservationId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Reservation not found: " + reservationId);
        }
        reservationRepository.deleteById(reservationId);
    }
}
