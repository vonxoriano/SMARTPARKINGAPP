package com.citU.smartparking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Represents a registered student / user of the parking system.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(name = "student_id", nullable = false, unique = true)
    private String studentId;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;        // stored as plain text for demo; BCrypt in production

    @Column(nullable = false)
    private String role = "USER";   // "USER" or "ADMIN"

    public String getRole()              { return role; }
    public void setRole(String role)     { this.role = role; }

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // ── Constructors ────────────────────────────────────────────────────────
    public User() {}

    public User(String name, String studentId, String email, String password) {
        this.name = name;
        this.studentId = studentId;
        this.email = email;
        this.password = password;
    }

    // ── Getters & Setters ───────────────────────────────────────────────────
    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }

    public String getName()                      { return name; }
    public void setName(String name)             { this.name = name; }

    public String getStudentId()                 { return studentId; }
    public void setStudentId(String studentId)   { this.studentId = studentId; }

    public String getEmail()                     { return email; }
    public void setEmail(String email)           { this.email = email; }

    public String getPassword()                  { return password; }
    public void setPassword(String password)     { this.password = password; }

    public String getProfilePhotoUrl()           { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String url)   { this.profilePhotoUrl = url; }

    public LocalDateTime getCreatedAt()          { return createdAt; }
    public void setCreatedAt(LocalDateTime t)    { this.createdAt = t; }
}
