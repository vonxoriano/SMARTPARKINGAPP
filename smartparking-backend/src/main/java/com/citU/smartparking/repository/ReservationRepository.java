package com.citU.smartparking.repository;

import com.citU.smartparking.model.Reservation;
import com.citU.smartparking.model.Reservation.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // All reservations for a specific user
    List<Reservation> findByUserId(Long userId);

    // All reservations for a user filtered by status
    List<Reservation> findByUserIdAndStatus(Long userId, Status status);

    // All active reservations on a specific spot (to check for conflicts)
    List<Reservation> findBySpotIdAndStatus(Long spotId, Status status);
}
