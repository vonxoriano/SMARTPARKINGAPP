/**
 * api.js  —  Central API service for Smart Parking App
 *
 * All calls go to the Spring Boot backend at http://localhost:8080
 * Usage: import { AuthAPI, ParkingAPI, ReservationAPI } from './api';
 */

const BASE_URL = 'http://localhost:8080/api';

// ── Generic fetch helper ──────────────────────────────────────────────────────
async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }
  return data;
}

// ════════════════════════════════════════════════════════════════════════════
//  AUTH  (/api/auth)
// ════════════════════════════════════════════════════════════════════════════
export const AuthAPI = {

  /** Register a new user. Returns { id, name, studentId, email } */
  register: (name, studentId, email, password) =>
    request('POST', '/auth/register', { name, studentId, email, password }),

  /** Login. Returns { id, name, studentId, email } */
  login: (studentId, password) =>
    request('POST', '/auth/login', { studentId, password }),

  /** Change password. Returns { message, user } */
  changePassword: (studentId, currentPassword, newPassword) =>
    request('POST', '/auth/change-password', { studentId, currentPassword, newPassword }),
};

// ════════════════════════════════════════════════════════════════════════════
//  USERS  (/api/users)
// ════════════════════════════════════════════════════════════════════════════
export const UserAPI = {

  /** Get user by database ID */
  getById: (id) => request('GET', `/users/${id}`),

  /** Get user by student ID string */
  getByStudentId: (studentId) => request('GET', `/users/by-student/${studentId}`),

  /** Update profile photo URL */
  updatePhoto: (id, photoUrl) => request('PATCH', `/users/${id}/photo`, { photoUrl }),

  /** Delete user account */
  delete: (id) => request('DELETE', `/users/${id}`),
};

// ════════════════════════════════════════════════════════════════════════════
//  PARKING  (/api/parking)
// ════════════════════════════════════════════════════════════════════════════
export const ParkingAPI = {

  /** Get all parking areas with spot counts & status */
  getAllAreas: () => request('GET', '/parking/areas'),

  /** Get one area by ID */
  getAreaById: (id) => request('GET', `/parking/areas/${id}`),

  /** Get spots for an area */
  getSpots: (areaId) => request('GET', `/parking/areas/${areaId}/spots`),

  /** Get only vacant spots for an area */
  getVacantSpots: (areaId) => request('GET', `/parking/areas/${areaId}/spots/vacant`),

  /** Update a spot's status: 'vacant' | 'taken' | 'reserved' */
  updateSpotStatus: (spotId, status) =>
    request('PATCH', `/parking/spots/${spotId}/status`, { status }),
};

// ════════════════════════════════════════════════════════════════════════════
//  RESERVATIONS  (/api/reservations)
// ════════════════════════════════════════════════════════════════════════════
export const ReservationAPI = {

  /**
   * Create a reservation.
   * @param {Object} data - { userId, spotId, vehicle, date, time, durationHours }
   */
  create: (data) => request('POST', '/reservations', data),

  /** Get a single reservation by ID */
  getById: (id) => request('GET', `/reservations/${id}`),

  /** Get all reservations for a user (optionally filtered by status) */
  getByUser: (userId, status = null) => {
    const query = status ? `?status=${status}` : '';
    return request('GET', `/reservations/user/${userId}${query}`);
  },

  /** Cancel an active reservation (frees the spot) */
  cancel: (id) => request('PATCH', `/reservations/${id}/cancel`),

  /** Mark a reservation as completed */
  complete: (id) => request('PATCH', `/reservations/${id}/complete`),

  /** Hard-delete a reservation record (admin) */
  delete: (id) => request('DELETE', `/reservations/${id}`),
};
