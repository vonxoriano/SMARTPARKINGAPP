package com.citU.smartparking.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    // RESERVED  = waiting for user to arrive (1 hr window)
    // OCCUPIED  = user arrived, currently parked
    // EXPIRED   = user never arrived within 1 hr
    // COMPLETED = user exited normally
    // CANCELLED = user cancelled before arriving
    public enum Status  { RESERVED, OCCUPIED, EXPIRED, COMPLETED, CANCELLED }
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
    private Status status = Status.RESERVED;

    // Timestamp when reservation was created — used to calculate 1-hr expiry
    @Column(name = "reserved_at")
    private LocalDateTime reservedAt = LocalDateTime.now();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Reservation() {}

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

    public LocalDateTime getReservedAt()             { return reservedAt; }
    public void setReservedAt(LocalDateTime t)       { this.reservedAt = t; }

    public LocalDateTime getCreatedAt()              { return createdAt; }
    public void setCreatedAt(LocalDateTime t)        { this.createdAt = t; }
}