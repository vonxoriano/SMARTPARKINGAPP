package com.citU.smartparking.repository;

import com.citU.smartparking.model.ParkingArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParkingAreaRepository extends JpaRepository<ParkingArea, Long> {
    Optional<ParkingArea> findByName(String name);
}
