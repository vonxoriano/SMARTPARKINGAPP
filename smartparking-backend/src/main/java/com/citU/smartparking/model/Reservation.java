package com.citU.smartparking.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

/**
 * Represents a parking reservation made by a User for a specific ParkingSpot.
 */
@Entity
@Table(name = "reservations")
public class Reservation {

    public enum Status  { ACTIVE, COMPLETED, CANCELLED }
    public enum Vehicle { CAR, MOTORCYCLE }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "spot_id", nullable = false)
    private ParkingSpot spot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    @Column(nullable = false)
    private int durationHours;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // ── Constructors ────────────────────────────────────────────────────────
    public Reservation() {}

    // ── Getters & Setters ───────────────────────────────────────────────────
    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }

    public User getUser()                            { return user; }
    public void setUser(User user)                   { this.user = user; }

    public ParkingSpot getSpot()                     { return spot; }
    public void setSpot(ParkingSpot spot)            { this.spot = spot; }

    public Vehicle getVehicle()                      { return vehicle; }
    public void setVehicle(Vehicle vehicle)          { this.vehicle = vehicle; }

    public LocalDate getDate()                       { return date; }
    public void setDate(LocalDate date)              { this.date = date; }

    public LocalTime getTime()                       { return time; }
    public void setTime(LocalTime time)              { this.time = time; }

    public int getDurationHours()                    { return durationHours; }
    public void setDurationHours(int h)              { this.durationHours = h; }

    public Status getStatus()                        { return status; }
    public void setStatus(Status status)             { this.status = status; }

    public LocalDateTime getCreatedAt()              { return createdAt; }
    public void setCreatedAt(LocalDateTime t)        { this.createdAt = t; }
}
