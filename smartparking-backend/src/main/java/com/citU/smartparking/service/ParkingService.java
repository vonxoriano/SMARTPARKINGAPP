package com.citU.smartparking.service;

import com.citU.smartparking.model.ParkingArea;
import com.citU.smartparking.model.ParkingSpot;
import com.citU.smartparking.model.ParkingSpot.Status;
import com.citU.smartparking.repository.ParkingAreaRepository;
import com.citU.smartparking.repository.ParkingSpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ParkingService {

    @Autowired private ParkingAreaRepository areaRepository;
    @Autowired private ParkingSpotRepository spotRepository;

    // ── AREAS: READ ─────────────────────────────────────────────────────────

    /** Return all parking areas with their spots. */
    public List<ParkingArea> getAllAreas() {
        return areaRepository.findAll();
    }

    /** Return a single area by ID. */
    public ParkingArea getAreaById(Long id) {
        return areaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Parking area not found: " + id));
    }

    /** Return a single area by name (e.g. "RTL AREA"). */
    public ParkingArea getAreaByName(String name) {
        return areaRepository.findByName(name)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Parking area not found: " + name));
    }

    // ── AREAS: CREATE / UPDATE / DELETE ─────────────────────────────────────

    /** Create a new parking area (admin). */
    public ParkingArea createArea(String name) {
        ParkingArea area = new ParkingArea(name);
        return areaRepository.save(area);
    }

    /** Rename a parking area (admin). */
    public ParkingArea updateAreaName(Long areaId, String newName) {
        ParkingArea area = getAreaById(areaId);
        area.setName(newName);
        return areaRepository.save(area);
    }

    /** Delete a parking area and all its spots (admin). */
    public void deleteArea(Long areaId) {
        if (!areaRepository.existsById(areaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Parking area not found: " + areaId);
        }
        areaRepository.deleteById(areaId);
    }

    // ── SPOTS: READ ─────────────────────────────────────────────────────────

    /** Return all spots for a given area. */
    public List<ParkingSpot> getSpotsByArea(Long areaId) {
        return spotRepository.findByParkingAreaId(areaId);
    }

    /** Return a single spot by ID. */
    public ParkingSpot getSpotById(Long spotId) {
        return spotRepository.findById(spotId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Parking spot not found: " + spotId));
    }

    /** Return vacant spots for a given area. */
    public List<ParkingSpot> getVacantSpots(Long areaId) {
        return spotRepository.findByParkingAreaIdAndStatus(areaId, Status.VACANT);
    }

    // ── SPOTS: CREATE / UPDATE / DELETE ─────────────────────────────────────

    /** Add a new spot to an area (admin). */
    public ParkingSpot addSpot(Long areaId, int slotNumber, Status status) {
        ParkingArea area = getAreaById(areaId);
        ParkingSpot spot = new ParkingSpot(slotNumber, status, area);
        return spotRepository.save(spot);
    }

    /** Update a spot's status (VACANT | TAKEN | RESERVED). */
    public ParkingSpot updateSpotStatus(Long spotId, Status newStatus) {
        ParkingSpot spot = getSpotById(spotId);
        spot.setStatus(newStatus);
        return spotRepository.save(spot);
    }

    /** Delete a spot (admin). */
    public void deleteSpot(Long spotId) {
        if (!spotRepository.existsById(spotId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Parking spot not found: " + spotId);
        }
        spotRepository.deleteById(spotId);
    }
}
