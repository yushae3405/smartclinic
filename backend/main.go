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
	dsn := "host=localhost user=postgres password=#Yashar3405#H dbname=smartclinic port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate the schema
	db.AutoMigrate(&handlers.Doctor{}, &handlers.Service{}, &handlers.Appointment{}, &handlers.Post{}, &handlers.Comment{}, &handlers.ContactMessage{})

	// Initialize handler
	h := &handlers.Handler{DB: db}

	// Router setup
	r := mux.NewRouter()
	api := r.PathPrefix("/api").Subrouter()

	// Routes
	api.HandleFunc("/doctors", h.GetDoctors).Methods("GET")
	api.HandleFunc("/services", h.GetServices).Methods("GET")
	api.HandleFunc("/appointments", h.CreateAppointment).Methods("POST")
	api.HandleFunc("/appointments", h.GetAppointments).Methods("GET")
	api.HandleFunc("/appointments/{id}", h.GetAppointment).Methods("GET")
	api.HandleFunc("/appointments/{id}/status", h.UpdateAppointmentStatus).Methods("PUT")

	// Blog routes
	api.HandleFunc("/posts", h.GetPosts).Methods("GET")
	api.HandleFunc("/posts/{slug}", h.GetPost).Methods("GET")
	api.HandleFunc("/posts/{id}/comments", h.CreateComment).Methods("POST")

	// Development routes
	if os.Getenv("ENVIRONMENT") != "production" {
		api.HandleFunc("/seed/doctors", h.SeedDoctors).Methods("POST")
		api.HandleFunc("/seed/services", h.SeedServices).Methods("POST")
		api.HandleFunc("/seed/posts", h.SeedPosts).Methods("POST")
	}

	// CORS setup
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, c.Handler(r)))
}
