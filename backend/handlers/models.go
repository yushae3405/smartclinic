package handlers

import (
	"time"
)

type Doctor struct {
	ID         string    `json:"id" gorm:"primaryKey"`
	Name       string    `json:"name"`
	Specialty  string    `json:"specialty"`
	Image      string    `json:"image"`
	Experience int       `json:"experience"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type Service struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Appointment struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	DoctorID    string    `json:"doctor_id"`
	PatientName string    `json:"patient_name"`
	Date        string    `json:"date"`
	Time        string    `json:"time"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
