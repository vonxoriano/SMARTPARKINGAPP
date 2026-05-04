package com.citU.smartparking.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents one parking area on campus (e.g. RTL AREA, OPEN AREA, BACKGATE).
 */
@Entity
@Table(name = "parking_areas")
public class ParkingArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // One area has many spots
    @OneToMany(mappedBy = "parkingArea", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ParkingSpot> spots = new ArrayList<>();

    // ── Constructors ────────────────────────────────────────────────────────
    public ParkingArea() {}

    public ParkingArea(String name) {
        this.name = name;
    }

    // ── Getters & Setters ───────────────────────────────────────────────────
    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }

    public String getName()                          { return name; }
    public void setName(String name)                 { this.name = name; }

    public List<ParkingSpot> getSpots()              { return spots; }
    public void setSpots(List<ParkingSpot> spots)    { this.spots = spots; }
}
