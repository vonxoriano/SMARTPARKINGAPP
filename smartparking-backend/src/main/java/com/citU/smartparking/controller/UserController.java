package com.citU.smartparking.controller;

import com.citU.smartparking.model.User;
import com.citU.smartparking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * User profile management endpoints.
 *
 * Base URL: /api/users
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // ── GET /api/users/{id} ──────────────────────────────────────────────────
    /** Fetch a user's profile by database ID. */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(safeUser(user));
    }

    // ── GET /api/users/by-student/{studentId} ────────────────────────────────
    /** Fetch a user by student ID string. */
    @GetMapping("/by-student/{studentId}")
    public ResponseEntity<?> getUserByStudentId(@PathVariable String studentId) {
        User user = userService.getUserByStudentId(studentId);
        return ResponseEntity.ok(safeUser(user));
    }

    // ── PATCH /api/users/{id}/photo ──────────────────────────────────────────
    /**
     * Update profile photo URL.
     *
     * Request body: { "photoUrl": "https://..." }
     */
    @PatchMapping("/{id}/photo")
    public ResponseEntity<?> updatePhoto(@PathVariable Long id,
                                         @RequestBody Map<String, String> body) {
        String photoUrl = body.get("photoUrl");
        if (photoUrl == null || photoUrl.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "photoUrl is required"));
        }
        User user = userService.updateProfilePhoto(id, photoUrl);
        return ResponseEntity.ok(safeUser(user));
    }

    // ── DELETE /api/users/{id} ───────────────────────────────────────────────
    /** Delete a user account. */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @GetMapping
public ResponseEntity<?> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers().stream().map(this::safeUser).toList());
}
    // ── Helper ───────────────────────────────────────────────────────────────
    private Map<String, Object> safeUser(User u) {
        return Map.of(
            "id",             u.getId(),
            "name",           u.getName(),
            "studentId",      u.getStudentId(),
            "email",          u.getEmail(),
            "profilePhotoUrl", u.getProfilePhotoUrl() != null ? u.getProfilePhotoUrl() : ""
        );
    }
}
