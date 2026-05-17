package com.citU.smartparking.controller;

import com.citU.smartparking.model.User;
import com.citU.smartparking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Handles user registration, login, and password management.
 *
 * Base URL: /api/auth
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")   // allows React dev server (localhost:3000) to call this
public class AuthController {

    @Autowired
    private UserService userService;

    // ── POST /api/auth/register ──────────────────────────────────────────────
    /**
     * Register a new user account.
     *
     * Request body (JSON):
     *   { "name": "...", "studentId": "...", "email": "...", "password": "..." }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name      = body.get("name");
        String studentId = body.get("studentId");
        String email     = body.get("email");
        String password  = body.get("password");

        if (name == null || studentId == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
        }
        if (password.length() < 4) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 4 characters"));
        }

        User user = userService.register(name, studentId, email, password);
        return ResponseEntity.status(HttpStatus.CREATED).body(safeUser(user));
    }

    // ── POST /api/auth/login ─────────────────────────────────────────────────
    /**
     * Authenticate a user.
     *
     * Request body (JSON):
     *   { "studentId": "...", "password": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String studentId = body.get("studentId");
        String password  = body.get("password");

        if (studentId == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "studentId and password are required"));
        }

        User user = userService.login(studentId, password);
        return ResponseEntity.ok(safeUser(user));
    }

    // ── POST /api/auth/change-password ───────────────────────────────────────
    /**
     * Change password.
     *
     * Request body (JSON):
     *   { "studentId": "...", "currentPassword": "...", "newPassword": "..." }
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        String studentId       = body.get("studentId");
        String currentPassword = body.get("currentPassword");
        String newPassword     = body.get("newPassword");

        if (studentId == null || currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "All password fields are required"));
        }
        if (newPassword.length() < 4) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password must be at least 4 characters"));
        }

        User user = userService.changePassword(studentId, currentPassword, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully", "user", safeUser(user)));
    }

    // ── Helper: return user without the password field ───────────────────────
    private Map<String, Object> safeUser(User u) {
        return Map.of(
            "id",        u.getId(),
            "name",      u.getName(),
            "studentId", u.getStudentId(),
            "email",     u.getEmail()
        );
    }
}
