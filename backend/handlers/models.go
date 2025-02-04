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
	Bio        string    `json:"bio"`
	Posts      []Post    `json:"posts,omitempty" gorm:"foreignKey:AuthorID"`
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
	Doctor      Doctor    `json:"doctor" gorm:"foreignKey:DoctorID"`
	PatientName string    `json:"patient_name"`
	Date        string    `json:"date"`
	Time        string    `json:"time"`
	Status      string    `json:"status"`
	Notes       string    `json:"notes"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Post struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	Title     string    `json:"title"`
	Slug      string    `json:"slug"`
	Content   string    `json:"content"`
	Summary   string    `json:"summary"`
	AuthorID  string    `json:"author_id"`
	Author    Doctor    `json:"author" gorm:"foreignKey:AuthorID"`
	Category  string    `json:"category"`
	Image     string    `json:"image"`
	Published bool      `json:"published" gorm:"default:false"`
	Views     int       `json:"views" gorm:"default:0"`
	Comments  []Comment `json:"comments,omitempty" gorm:"foreignKey:PostID"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Comment struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	PostID    string    `json:"post_id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ContactMessage struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Subject   string    `json:"subject"`
	Message   string    `json:"message"`
	Status    string    `json:"status" gorm:"default:'unread'"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
