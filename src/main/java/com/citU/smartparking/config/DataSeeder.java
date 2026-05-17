package com.citU.smartparking.config;

import com.citU.smartparking.model.*;
import com.citU.smartparking.model.ParkingSpot.Status;
import com.citU.smartparking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private ParkingAreaRepository areaRepo;
    @Autowired private ParkingSpotRepository spotRepo;
    @Autowired private UserRepository        userRepo;

    @Override
    public void run(String... args) {

        // ── Default test user ────────────────────────────────────────────────
        if (!userRepo.existsByStudentId("23-3724-353")) {
            userRepo.save(new User("Superuser Test", "23-3724-353",
                                   "superuser@cit-u.edu.ph", "test1234"));
            System.out.println("✅ Seeded default test user: 23-3724-353 / test1234");
        }

        // ── RTL AREA — all 20 spots VACANT ───────────────────────────────────
        if (areaRepo.findByName("RTL AREA").isEmpty()) {
            ParkingArea rtl = areaRepo.save(new ParkingArea("RTL AREA"));
            seedSpots(rtl, 20);
            System.out.println("✅ Seeded RTL AREA (20 vacant spots)");
        }

        // ── OPEN AREA — all 20 spots VACANT ──────────────────────────────────
        if (areaRepo.findByName("OPEN AREA").isEmpty()) {
            ParkingArea open = areaRepo.save(new ParkingArea("OPEN AREA"));
            seedSpots(open, 20);
            System.out.println("✅ Seeded OPEN AREA (20 vacant spots)");
        }

        // ── BACKGATE — all 20 spots VACANT ───────────────────────────────────
        if (areaRepo.findByName("BACKGATE").isEmpty()) {
            ParkingArea back = areaRepo.save(new ParkingArea("BACKGATE"));
            seedSpots(back, 20);
            System.out.println("✅ Seeded BACKGATE (20 vacant spots)");
        }
    }

    private void seedSpots(ParkingArea area, int count) {
        for (int i = 1; i <= count; i++) {
            spotRepo.save(new ParkingSpot(i, Status.VACANT, area));
        }
    }
}