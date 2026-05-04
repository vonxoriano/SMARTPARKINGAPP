package com.citU.smartparking.controller;

import com.citU.smartparking.model.ParkingArea;
import com.citU.smartparking.model.ParkingSpot;
import com.citU.smartparking.model.ParkingSpot.Status;
import com.citU.smartparking.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Parking area and spot management endpoints.
 *
 * Base URL: /api/parking
 */
@RestController
@RequestMapping("/api/parking")
@CrossOrigin(origins = "*")
public class ParkingController {

    @Autowired
    private ParkingService parkingService;

    // ════════════════════════════════════════════════════════════════════════
    //  PARKING AREAS
    // ════════════════════════════════════════════════════════════════════════

    // ── GET /api/parking/areas ───────────────────────────────────────────────
    /** Return all parking areas with their spots and status summary. */
    @GetMapping("/areas")
    public ResponseEntity<?> getAllAreas() {
        List<ParkingArea> areas = parkingService.getAllAreas();
        List<Map<String, Object>> result = new ArrayList<>();

        for (ParkingArea area : areas) {
            long vacant = area.getSpots().stream()
                    .filter(s -> s.getStatus() == Status.VACANT).count();
            long total  = area.getSpots().size();

            List<Map<String, Object>> spots = new ArrayList<>();
            for (ParkingSpot spot : area.getSpots()) {
                spots.add(Map.of(
                    "id",         spot.getId(),
                    "slotNumber", spot.getSlotNumber(),
                    "status",     spot.getStatus().name().toLowerCase()
                ));
            }

            result.add(Map.of(
                "id",          area.getId(),
                "name",        area.getName(),
                "totalSpots",  total,
                "vacantSpots", vacant,
                "spots",       spots
            ));
        }
        return ResponseEntity.ok(result);
    }

    // ── GET /api/parking/areas/{id} ──────────────────────────────────────────
    /** Return one area by ID. */
    @GetMapping("/areas/{id}")
    public ResponseEntity<?> getArea(@PathVariable Long id) {
        ParkingArea area = parkingService.getAreaById(id);
        return ResponseEntity.ok(areaMap(area));
    }

    // ── POST /api/parking/areas ──────────────────────────────────────────────
    /** Create a new parking area (admin). */
    @PostMapping("/areas")
    public ResponseEntity<?> createArea(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "name is required"));
        }
        ParkingArea area = parkingService.createArea(name);
        return ResponseEntity.status(HttpStatus.CREATED).body(areaMap(area));
    }

    // ── PUT /api/parking/areas/{id} ──────────────────────────────────────────
    /** Rename a parking area (admin). */
    @PutMapping("/areas/{id}")
    public ResponseEntity<?> updateArea(@PathVariable Long id,
                                        @RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "name is required"));
        }
        ParkingArea area = parkingService.updateAreaName(id, name);
        return ResponseEntity.ok(areaMap(area));
    }

    // ── DELETE /api/parking/areas/{id} ───────────────────────────────────────
    /** Delete a parking area (admin). */
    @DeleteMapping("/areas/{id}")
    public ResponseEntity<?> deleteArea(@PathVariable Long id) {
        parkingService.deleteArea(id);
        return ResponseEntity.ok(Map.of("message", "Parking area deleted"));
    }

    // ════════════════════════════════════════════════════════════════════════
    //  PARKING SPOTS
    // ════════════════════════════════════════════════════════════════════════

    // ── GET /api/parking/areas/{areaId}/spots ────────────────────────────────
    /** List all spots for an area. */
    @GetMapping("/areas/{areaId}/spots")
    public ResponseEntity<?> getSpots(@PathVariable Long areaId) {
        List<ParkingSpot> spots = parkingService.getSpotsByArea(areaId);
        return ResponseEntity.ok(spots.stream().map(this::spotMap).toList());
    }

    // ── GET /api/parking/areas/{areaId}/spots/vacant ─────────────────────────
    /** Return only vacant spots for an area. */
    @GetMapping("/areas/{areaId}/spots/vacant")
    public ResponseEntity<?> getVacantSpots(@PathVariable Long areaId) {
        List<ParkingSpot> spots = parkingService.getVacantSpots(areaId);
        return ResponseEntity.ok(spots.stream().map(this::spotMap).toList());
    }

    // ── POST /api/parking/areas/{areaId}/spots ───────────────────────────────
    /** Add a new spot to an area (admin). */
    @PostMapping("/areas/{areaId}/spots")
    public ResponseEntity<?> addSpot(@PathVariable Long areaId,
                                     @RequestBody Map<String, Object> body) {
        int    slotNumber = (int) body.getOrDefault("slotNumber", 1);
        String statusStr  = (String) body.getOrDefault("status", "VACANT");
        Status status     = Status.valueOf(statusStr.toUpperCase());

        ParkingSpot spot = parkingService.addSpot(areaId, slotNumber, status);
        return ResponseEntity.status(HttpStatus.CREATED).body(spotMap(spot));
    }

    // ── PATCH /api/parking/spots/{spotId}/status ─────────────────────────────
    /** Update a spot's status (admin). */
    @PatchMapping("/spots/{spotId}/status")
    public ResponseEntity<?> updateSpotStatus(@PathVariable Long spotId,
                                               @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "status is required"));
        }
        Status status = Status.valueOf(statusStr.toUpperCase());
        ParkingSpot spot = parkingService.updateSpotStatus(spotId, status);
        return ResponseEntity.ok(spotMap(spot));
    }

    // ── DELETE /api/parking/spots/{spotId} ───────────────────────────────────
    /** Delete a spot (admin). */
    @DeleteMapping("/spots/{spotId}")
    public ResponseEntity<?> deleteSpot(@PathVariable Long spotId) {
        parkingService.deleteSpot(spotId);
        return ResponseEntity.ok(Map.of("message", "Spot deleted"));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    private Map<String, Object> spotMap(ParkingSpot s) {
        return Map.of(
            "id",         s.getId(),
            "slotNumber", s.getSlotNumber(),
            "status",     s.getStatus().name().toLowerCase(),
            "areaId",     s.getParkingArea().getId(),
            "areaName",   s.getParkingArea().getName()
        );
    }

    private Map<String, Object> areaMap(ParkingArea area) {
        List<Map<String, Object>> spots = area.getSpots().stream()
                .map(this::spotMap).toList();
        return Map.of(
            "id",    area.getId(),
            "name",  area.getName(),
            "spots", spots
        );
    }
}
