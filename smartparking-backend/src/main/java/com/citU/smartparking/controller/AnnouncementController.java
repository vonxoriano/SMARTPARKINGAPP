package com.citU.smartparking.controller;

import com.citU.smartparking.model.Announcement;
import com.citU.smartparking.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepo;

    // GET /api/announcements — all users can read
    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Announcement> list = announcementRepo.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(list.stream().map(this::toMap).toList());
    }

    // POST /api/announcements — admin creates
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
        String title   = body.get("title");
        String message = body.get("message");
        if (title == null || title.isBlank() || message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "title and message are required"));
        }
        Announcement a = announcementRepo.save(new Announcement(title, message));
        return ResponseEntity.status(HttpStatus.CREATED).body(toMap(a));
    }

    // DELETE /api/announcements/{id} — admin deletes
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!announcementRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        announcementRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Announcement deleted"));
    }

    private Map<String, Object> toMap(Announcement a) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id",        a.getId());
        map.put("title",     a.getTitle());
        map.put("message",   a.getMessage());
        map.put("createdAt", a.getCreatedAt().toString());
        return map;
    }
}