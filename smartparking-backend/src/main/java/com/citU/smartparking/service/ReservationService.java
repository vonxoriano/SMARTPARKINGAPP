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
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired private ReservationRepository reservationRepository;
    @Autowired private UserService           userService;
    @Autowired private ParkingService        parkingService;

    // ── CREATE ──────────────────────────────────────────────────────────────

    @Transactional
    public Reservation createReservation(Long userId, Long spotId,
                                     String vehicleStr, LocalDate date,
                                     LocalTime time, int durationHours, Long durationMs) {

        User user = userService.getUserById(userId);
        ParkingSpot spot = parkingService.getSpotById(spotId);

        // Guard: user cannot have more than one active reservation
        boolean hasActive = reservationRepository.findByUserId(userId).stream()
                .anyMatch(r -> r.getStatus() == Status.RESERVED
                            || r.getStatus() == Status.OCCUPIED);
        if (hasActive) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "You already have an active reservation. Cancel or complete it first.");
        }

        // Guard: spot must be vacant
        if (spot.getStatus() != ParkingSpot.Status.VACANT) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Spot " + spotId + " is not available (status: " + spot.getStatus() + ")");
        }

        // Mark spot as RESERVED
        parkingService.updateSpotStatus(spotId, ParkingSpot.Status.RESERVED);

        Reservation res = new Reservation();
        res.setUser(user);
        res.setSpot(spot);
        res.setVehicle(Vehicle.valueOf(vehicleStr.toUpperCase()));
        res.setDate(date);
        res.setTime(time);
        res.setDurationHours(durationHours);
        res.setDurationMs(durationMs);
        res.setStatus(Status.RESERVED);
        res.setReservedAt(LocalDateTime.now());

        return reservationRepository.save(res);
    }

    // ── ARRIVE (RESERVED → OCCUPIED) ────────────────────────────────────────

    @Transactional
    public Reservation arriveReservation(Long reservationId) {
        Reservation res = getReservationById(reservationId);

        if (res.getStatus() != Status.RESERVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Can only arrive on a RESERVED reservation. Current status: " + res.getStatus());
        }

        // Check it hasn't already expired (1 hour window)
        long durationMs = res.getDurationMs() != null ? res.getDurationMs() : 3600000L;
        LocalDateTime expiry = res.getReservedAt().plus(durationMs, java.time.temporal.ChronoUnit.MILLIS);
        if (LocalDateTime.now().isAfter(expiry)) {
            // Auto-expire it instead
            return expireReservation(reservationId);
        }

        res.setStatus(Status.OCCUPIED);
        parkingService.updateSpotStatus(res.getSpot().getId(), ParkingSpot.Status.TAKEN);
        return reservationRepository.save(res);
    }

    // ── EXIT (OCCUPIED → COMPLETED) ─────────────────────────────────────────

    @Transactional
    public Reservation exitReservation(Long reservationId) {
        Reservation res = getReservationById(reservationId);

        if (res.getStatus() != Status.OCCUPIED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Can only exit an OCCUPIED reservation. Current status: " + res.getStatus());
        }

        res.setStatus(Status.COMPLETED);
        parkingService.updateSpotStatus(res.getSpot().getId(), ParkingSpot.Status.VACANT);
        return reservationRepository.save(res);
    }

    // ── EXPIRE (RESERVED → EXPIRED, no-show after 1 hr) ────────────────────

    @Transactional
    public Reservation expireReservation(Long reservationId) {
        Reservation res = getReservationById(reservationId);

        if (res.getStatus() != Status.RESERVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Can only expire a RESERVED reservation. Current status: " + res.getStatus());
        }

        res.setStatus(Status.EXPIRED);
        parkingService.updateSpotStatus(res.getSpot().getId(), ParkingSpot.Status.VACANT);
        return reservationRepository.save(res);
    }

    // ── READ ────────────────────────────────────────────────────────────────

    public List<Reservation> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    public List<Reservation> getReservationsByUserAndStatus(Long userId, String statusStr) {
        Status status = Status.valueOf(statusStr.toUpperCase());
        return reservationRepository.findByUserIdAndStatus(userId, status);
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Reservation not found: " + id));
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // ── CANCEL ──────────────────────────────────────────────────────────────

    @Transactional
    public Reservation cancelReservation(Long reservationId) {
        Reservation res = getReservationById(reservationId);

        if (res.getStatus() != Status.RESERVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only RESERVED reservations can be cancelled. Current status: " + res.getStatus());
        }

        res.setStatus(Status.CANCELLED);
        parkingService.updateSpotStatus(res.getSpot().getId(), ParkingSpot.Status.VACANT);
        return reservationRepository.save(res);
    }

    // ── COMPLETE (kept for admin use) ────────────────────────────────────────

    @Transactional
    public Reservation completeReservation(Long reservationId) {
        Reservation res = getReservationById(reservationId);
        res.setStatus(Status.COMPLETED);
        parkingService.updateSpotStatus(res.getSpot().getId(), ParkingSpot.Status.VACANT);
        return reservationRepository.save(res);
    }

    public void deleteReservation(Long reservationId) {
        if (!reservationRepository.existsById(reservationId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Reservation not found: " + reservationId);
        }
        reservationRepository.deleteById(reservationId);
    }
}