package com.citU.smartparking.model;

import jakarta.persistence.*;

/**
 * Represents a single parking spot within a ParkingArea.
 * Status: VACANT | TAKEN | RESERVED
 */
@Entity
@Table(name = "parking_spots")
public class ParkingSpot {

    public enum Status { VACANT, TAKEN, RESERVED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Slot number within its area (1, 2, 3 …)
    @Column(name = "slot_number", nullable = false)
    private int slotNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.VACANT;

    @ManyToOne
    @JoinColumn(name = "parking_area_id", nullable = false)
    private ParkingArea parkingArea;

    // ── Constructors ────────────────────────────────────────────────────────
    public ParkingSpot() {}

    public ParkingSpot(int slotNumber, Status status, ParkingArea parkingArea) {
        this.slotNumber  = slotNumber;
        this.status      = status;
        this.parkingArea = parkingArea;
    }

    // ── Getters & Setters ───────────────────────────────────────────────────
    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }

    public int getSlotNumber()                   { return slotNumber; }
    public void setSlotNumber(int n)             { this.slotNumber = n; }

    public Status getStatus()                    { return status; }
    public void setStatus(Status status)         { this.status = status; }

    public ParkingArea getParkingArea()          { return parkingArea; }
    public void setParkingArea(ParkingArea a)    { this.parkingArea = a; }
}
