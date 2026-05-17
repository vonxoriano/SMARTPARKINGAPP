package com.citU.smartparking.dto;

import jakarta.validation.constraints.*;

// ════════════════════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════════════════════

/** POST /api/auth/register */
class RegisterRequest {
    @NotBlank public String name;
    @NotBlank public String studentId;
    @Email @NotBlank public String email;
    @NotBlank @Size(min = 4) public String password;
}

/** POST /api/auth/login */
class LoginRequest {
    @NotBlank public String studentId;
    @NotBlank public String password;
}

/** POST /api/auth/change-password */
class ChangePasswordRequest {
    @NotBlank public String studentId;
    @NotBlank public String currentPassword;
    @NotBlank @Size(min = 4) public String newPassword;
}

// ════════════════════════════════════════════════════════════════════════════
//  RESERVATION
// ════════════════════════════════════════════════════════════════════════════

/** POST /api/reservations */
class CreateReservationRequest {
    @NotNull  public Long   userId;
    @NotNull  public Long   spotId;
    @NotBlank public String vehicle;       // CAR | MOTORCYCLE
    @NotBlank public String date;          // yyyy-MM-dd
    @NotBlank public String time;          // HH:mm
    @Min(1) @Max(8)
              public int    durationHours;
}
