package com.citU.smartparking.service;

import com.citU.smartparking.model.User;
import com.citU.smartparking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // ── CREATE ──────────────────────────────────────────────────────────────

    /**
     * Register a new user.
     * Throws 409 if the student ID or email already exists.
     */
    public User register(String name, String studentId, String email, String password) {
        if (userRepository.existsByStudentId(studentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Student ID already registered: " + studentId);
        }
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Email already registered: " + email);
        }
        // NOTE: In production, hash password with BCryptPasswordEncoder
        User user = new User(name, studentId, email, password);
        return userRepository.save(user);
    }

    // ── READ ────────────────────────────────────────────────────────────────

    /** Login: validate credentials and return the User. */
    public User login(String studentId, String password) {
        User user = userRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Invalid student ID or password"));
        if (!user.getPassword().equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Invalid student ID or password");
        }
        return user;
    }

    /** Get a user by their database ID. */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User not found with id: " + id));
    }

    /** Get a user by student ID. */
    public User getUserByStudentId(String studentId) {
        return userRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User not found: " + studentId));
    }

    /** Return all users (admin use). */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ── UPDATE ──────────────────────────────────────────────────────────────

    /** Change password after verifying the current one. */
    public User changePassword(String studentId, String currentPassword, String newPassword) {
        User user = login(studentId, currentPassword);   // validates current password
        user.setPassword(newPassword);
        return userRepository.save(user);
    }

    /** Update profile photo URL. */
    public User updateProfilePhoto(Long userId, String photoUrl) {
        User user = getUserById(userId);
        user.setProfilePhotoUrl(photoUrl);
        return userRepository.save(user);
    }

    // ── DELETE ──────────────────────────────────────────────────────────────

    /** Delete a user account. */
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
