package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type Handler struct {
	DB *gorm.DB
}

func (h *Handler) GetDoctors(w http.ResponseWriter, r *http.Request) {
	var doctors []Doctor
	query := h.DB

	// Handle search
	search := r.URL.Query().Get("search")
	if search != "" {
		query = query.Where("name ILIKE ?", "%"+search+"%")
	}

	// Handle specialty filter
	specialty := r.URL.Query().Get("specialty")
	if specialty != "" {
		query = query.Where("specialty = ?", specialty)
	}

	if err := query.Find(&doctors).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(doctors)
}

func (h *Handler) GetServices(w http.ResponseWriter, r *http.Request) {
	var services []Service
	if err := h.DB.Find(&services).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(services)
}

func (h *Handler) CreateAppointment(w http.ResponseWriter, r *http.Request) {
	var appointment Appointment
	if err := json.NewDecoder(r.Body).Decode(&appointment); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	appointment.Status = "pending"
	if err := h.DB.Create(&appointment).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(appointment)
}

func (h *Handler) GetAppointments(w http.ResponseWriter, r *http.Request) {
	var appointments []Appointment
	query := h.DB

	// Filter by doctor
	doctorID := r.URL.Query().Get("doctorId")
	if doctorID != "" {
		query = query.Where("doctor_id = ?", doctorID)
	}

	// Filter by date
	date := r.URL.Query().Get("date")
	if date != "" {
		query = query.Where("date = ?", date)
	}

	if err := query.Find(&appointments).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(appointments)
}

func (h *Handler) GetAppointment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var appointment Appointment
	if err := h.DB.First(&appointment, "id = ?", id).Error; err != nil {
		http.Error(w, "Appointment not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(appointment)
}

func (h *Handler) UpdateAppointmentStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var update struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate status
	validStatuses := map[string]bool{"pending": true, "confirmed": true, "cancelled": true}
	if !validStatuses[update.Status] {
		http.Error(w, "Invalid status", http.StatusBadRequest)
		return
	}

	var appointment Appointment
	if err := h.DB.First(&appointment, "id = ?", id).Error; err != nil {
		http.Error(w, "Appointment not found", http.StatusNotFound)
		return
	}

	appointment.Status = update.Status
	if err := h.DB.Save(&appointment).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(appointment)
}
