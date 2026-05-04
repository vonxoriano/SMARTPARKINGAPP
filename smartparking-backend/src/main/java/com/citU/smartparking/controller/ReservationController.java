package com.citU.smartparking.controller;

import com.citU.smartparking.model.Reservation;
import com.citU.smartparking.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

/**
 * Reservation management endpoints.
 *
 * Base URL: /api/reservations
 */
@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // ── POST /api/reservations ───────────────────────────────────────────────
    /**
     * Create a new reservation.
     *
     * Request body (JSON):
     * {
     *   "userId": 1,
     *   "spotId": 5,
     *   "vehicle": "CAR",
     *   "date": "2026-05-10",
     *   "time": "14:00",
     *   "durationHours": 2
     * }
     */
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Map<String, Object> body) {
        try {
            Long   userId        = Long.valueOf(body.get("userId").toString());
            Long   spotId        = Long.valueOf(body.get("spotId").toString());
            String vehicle       = body.get("vehicle").toString();
            LocalDate date       = LocalDate.parse(body.get("date").toString());
            LocalTime time       = LocalTime.parse(body.get("time").toString());
            int durationHours    = Integer.parseInt(body.get("durationHours").toString());

            Reservation res = reservationService.createReservation(
                    userId, spotId, vehicle, date, time, durationHours);

            return ResponseEntity.status(HttpStatus.CREATED).body(resMap(res));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── GET /api/reservations ────────────────────────────────────────────────
    /** Get ALL reservations (admin). */
    @GetMapping
    public ResponseEntity<?> getAllReservations() {
        List<Reservation> list = reservationService.getAllReservations();
        return ResponseEntity.ok(list.stream().map(this::resMap).toList());
    }

    // ── GET /api/reservations/{id} ───────────────────────────────────────────
    /** Get a single reservation by ID. */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservation(@PathVariable Long id) {
        Reservation res = reservationService.getReservationById(id);
        return ResponseEntity.ok(resMap(res));
    }

    // ── GET /api/reservations/user/{userId} ──────────────────────────────────
    /** Get all reservations for a specific user. */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserReservations(@PathVariable Long userId,
                                                  @RequestParam(required = false) String status) {
        List<Reservation> list = (status != null)
                ? reservationService.getReservationsByUserAndStatus(userId, status)
                : reservationService.getReservationsByUser(userId);
        return ResponseEntity.ok(list.stream().map(this::resMap).toList());
    }

    // ── PATCH /api/reservations/{id}/complete ────────────────────────────────
    /** Mark a reservation as COMPLETED (admin / system job). */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completeReservation(@PathVariable Long id) {
        Reservation res = reservationService.completeReservation(id);
        return ResponseEntity.ok(resMap(res));
    }

    // ── PATCH /api/reservations/{id}/cancel ─────────────────────────────────
    /** Cancel an ACTIVE reservation (user action). Frees the spot. */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        Reservation res = reservationService.cancelReservation(id);
        return ResponseEntity.ok(resMap(res));
    }

    // ── DELETE /api/reservations/{id} ───────────────────────────────────────
    /** Hard-delete a reservation record (admin only). */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.ok(Map.of("message", "Reservation deleted"));
    }

    // ── Helper: convert Reservation entity to a clean Map ───────────────────
    private Map<String, Object> resMap(Reservation r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id",            r.getId());
        map.put("userId",        r.getUser().getId());
        map.put("userName",      r.getUser().getName());
        map.put("spotId",        r.getSpot().getId());
        map.put("slotNumber",    r.getSpot().getSlotNumber());
        map.put("areaName",      r.getSpot().getParkingArea().getName());
        map.put("vehicle",       r.getVehicle().name());
        map.put("date",          r.getDate().toString());
        map.put("time",          r.getTime().toString());
        map.put("durationHours", r.getDurationHours());
        map.put("status",        r.getStatus().name());
        map.put("createdAt",     r.getCreatedAt().toString());
        return map;
    }
}
