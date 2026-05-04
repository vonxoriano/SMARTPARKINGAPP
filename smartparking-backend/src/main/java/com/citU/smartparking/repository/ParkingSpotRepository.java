package com.citU.smartparking.repository;

import com.citU.smartparking.model.ParkingSpot;
import com.citU.smartparking.model.ParkingSpot.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {

    List<ParkingSpot> findByParkingAreaId(Long areaId);

    List<ParkingSpot> findByParkingAreaIdAndStatus(Long areaId, Status status);
}
