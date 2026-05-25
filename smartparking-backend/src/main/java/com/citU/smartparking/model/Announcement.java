package com.citU.smartparking.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Announcement() {}

    public Announcement(String title, String message) {
        this.title   = title;
        this.message = message;
    }

    public Long getId()                        { return id; }
    public String getTitle()                   { return title; }
    public void setTitle(String title)         { this.title = title; }
    public String getMessage()                 { return message; }
    public void setMessage(String message)     { this.message = message; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
    public void setCreatedAt(LocalDateTime t)  { this.createdAt = t; }
}