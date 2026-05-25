package com.citU.smartparking.controller;

import com.citU.smartparking.model.Reservation;
import com.citU.smartparking.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // POST /api/reservations
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Map<String, Object> body) {
        try {
            Long      userId       = Long.valueOf(body.get("userId").toString());
            Long      spotId       = Long.valueOf(body.get("spotId").toString());
            String    vehicle      = body.get("vehicle").toString();
            LocalDate date         = LocalDate.parse(body.get("date").toString());
            LocalTime time         = LocalTime.parse(body.get("time").toString());
            int       durationHours = Integer.parseInt(body.get("durationHours").toString());
            Long durationMs = body.containsKey("durationMs") ? Long.valueOf(body.get("durationMs").toString()) : 3600000L;

            Reservation res = reservationService.createReservation(
        userId, spotId, vehicle, date, time, durationHours, durationMs);
            return ResponseEntity.status(HttpStatus.CREATED).body(resMap(res));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/reservations
    @GetMapping
    public ResponseEntity<?> getAllReservations() {
        List<Reservation> list = reservationService.getAllReservations();
        return ResponseEntity.ok(list.stream().map(this::resMap).toList());
    }

    // GET /api/reservations/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservation(@PathVariable Long id) {
        return ResponseEntity.ok(resMap(reservationService.getReservationById(id)));
    }

    // GET /api/reservations/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserReservations(@PathVariable Long userId,
                                                  @RequestParam(required = false) String status) {
        List<Reservation> list = (status != null)
                ? reservationService.getReservationsByUserAndStatus(userId, status)
                : reservationService.getReservationsByUser(userId);
        return ResponseEntity.ok(list.stream().map(this::resMap).toList());
    }

    // PATCH /api/reservations/{id}/arrive  — user pressed "Arrived"
    @PatchMapping("/{id}/arrive")
    public ResponseEntity<?> arrive(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(resMap(reservationService.arriveReservation(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PATCH /api/reservations/{id}/exit  — user pressed "Exit"
    @PatchMapping("/{id}/exit")
    public ResponseEntity<?> exit(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(resMap(reservationService.exitReservation(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PATCH /api/reservations/{id}/expire  — called by frontend timer when 1 hr is up
    @PatchMapping("/{id}/expire")
    public ResponseEntity<?> expire(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(resMap(reservationService.expireReservation(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PATCH /api/reservations/{id}/cancel
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(resMap(reservationService.cancelReservation(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PATCH /api/reservations/{id}/complete
    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completeReservation(@PathVariable Long id) {
        return ResponseEntity.ok(resMap(reservationService.completeReservation(id)));
    }
    //must be in homepage and must not be available to view
    // DELETE /api/reservations/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.ok(Map.of("message", "Reservation deleted"));
    }

    // Helper: entity → JSON map
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
        map.put("durationMs", r.getDurationMs());
        map.put("status",        r.getStatus().name());
        map.put("reservedAt",    r.getReservedAt().toString());  // frontend uses this for countdown
        map.put("createdAt",     r.getCreatedAt().toString());
        return map;
    }
}