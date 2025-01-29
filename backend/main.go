package main

import (
	"log"
	"net/http"
	"os"

	"smartclinic/handlers"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Database connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=#Yashar3405#H dbname=smartclinic port=5432 sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate the schema
	db.AutoMigrate(&handlers.Doctor{}, &handlers.Service{}, &handlers.Appointment{})

	// Initialize handlers
	h := &handlers.Handler{DB: db}

	// Router setup
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/doctors", h.GetDoctors).Methods("GET")
	api.HandleFunc("/services", h.GetServices).Methods("GET")
	api.HandleFunc("/appointments", h.CreateAppointment).Methods("POST")
	api.HandleFunc("/appointments", h.GetAppointments).Methods("GET")
	api.HandleFunc("/appointments/{id}", h.GetAppointment).Methods("GET")
	api.HandleFunc("/appointments/{id}", h.UpdateAppointmentStatus).Methods("PATCH")

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders: []string{"*"},
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	handler := c.Handler(r)
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
