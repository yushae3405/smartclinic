package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(doctors)
}

func (h *Handler) GetServices(w http.ResponseWriter, r *http.Request) {
	var services []Service
	if err := h.DB.Find(&services).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(services)
}
func (h *Handler) CreateContactMessage(w http.ResponseWriter, r *http.Request) {
	var message ContactMessage
	if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.DB.Create(&message).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(message)
}

func (h *Handler) SeedServices(w http.ResponseWriter, r *http.Request) {
	services := []Service{
		{
			ID:          uuid.New().String(),
			Name:        "General Medicine",
			Description: "Comprehensive healthcare for all ages",
			Icon:        "Stethoscope",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Cardiology",
			Description: "Expert heart care and treatment",
			Icon:        "Heart",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Neurology",
			Description: "Advanced brain and nervous system care",
			Icon:        "Brain",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Ophthalmology",
			Description: "Complete eye care services",
			Icon:        "Eye",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Dental Care",
			Description: "Professional dental services",
			Icon:        "Tooth",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Emergency Care",
			Description: "24/7 emergency medical services",
			Icon:        "FirstAid",
		},
	}

	// Clear existing services first
	if err := h.DB.Exec("TRUNCATE TABLE services CASCADE").Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert new services
	for _, service := range services {
		if err := h.DB.Create(&service).Error; err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(services)
}

func (h *Handler) SeedDoctors(w http.ResponseWriter, r *http.Request) {
	doctors := []Doctor{
		{
			ID:         uuid.New().String(),
			Name:       "Dr. Sarah Johnson",
			Specialty:  "Cardiology",
			Image:      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			Experience: 12,
		},
		{
			ID:         uuid.New().String(),
			Name:       "Dr. Michael Chen",
			Specialty:  "Neurology",
			Image:      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			Experience: 15,
		},
		{
			ID:         uuid.New().String(),
			Name:       "Dr. Emily Williams",
			Specialty:  "General Medicine",
			Image:      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			Experience: 8,
		},
		{
			ID:         uuid.New().String(),
			Name:       "Dr. James Wilson",
			Specialty:  "Ophthalmology",
			Image:      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
			Experience: 10,
		},
	}

	// Clear existing doctors first
	if err := h.DB.Exec("TRUNCATE TABLE doctors CASCADE").Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert new doctors
	for _, doctor := range doctors {
		if err := h.DB.Create(&doctor).Error; err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	log.Println("Fetched Services:", doctors)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(doctors)
}

func (h *Handler) CreateAppointment(w http.ResponseWriter, r *http.Request) {
	var appointment Appointment
	if err := json.NewDecoder(r.Body).Decode(&appointment); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	appointment.ID = uuid.New().String()
	appointment.Status = "pending"
	if err := h.DB.Create(&appointment).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
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

	w.Header().Set("Content-Type", "application/json")
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

	w.Header().Set("Content-Type", "application/json")
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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointment)
}

func (h *Handler) GetPosts(w http.ResponseWriter, r *http.Request) {
	var posts []Post
	query := h.DB.Preload("Author").Preload("Comments")

	// Handle category filter
	category := r.URL.Query().Get("category")
	if category != "" {
		query = query.Where("category = ?", category)
	}

	// Handle search
	search := r.URL.Query().Get("search")
	if search != "" {
		query = query.Where("title ILIKE ? OR content ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	if err := query.Order("created_at DESC").Find(&posts).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func (h *Handler) GetPost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	var post Post
	if err := h.DB.Preload("Author").Preload("Comments").Where("slug = ?", slug).First(&post).Error; err != nil {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	// Increment views
	post.Views++
	h.DB.Save(&post)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

func (h *Handler) CreateComment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	postID := vars["id"]

	var comment Comment
	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	comment.ID = uuid.New().String()
	comment.PostID = postID
	comment.CreatedAt = time.Now()
	comment.UpdatedAt = time.Now()

	if err := h.DB.Create(&comment).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(comment)
}

func (h *Handler) SeedPosts(w http.ResponseWriter, r *http.Request) {
	// Get all doctors for random assignment
	var doctors []Doctor
	if err := h.DB.Find(&doctors).Error; err != nil {
		http.Error(w, "Failed to fetch doctors", http.StatusInternalServerError)
		return
	}

	if len(doctors) == 0 {
		http.Error(w, "No doctors found. Please seed doctors first", http.StatusBadRequest)
		return
	}

	posts := []Post{
		{
			ID:        uuid.New().String(),
			Title:     "Understanding Heart Health: A Comprehensive Guide",
			Slug:      "understanding-heart-health",
			Content:   "<p>Heart disease remains one of the leading causes of death globally. In this comprehensive guide, we'll explore the factors that contribute to heart health and preventive measures you can take...</p>",
			Summary:   "A detailed look at maintaining cardiovascular health and preventing heart disease.",
			AuthorID:  doctors[0].ID,
			Category:  "Health Tips",
			Image:     "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
			Published: true,
		},
		{
			ID:        uuid.New().String(),
			Title:     "Latest Advances in Neurology Research",
			Slug:      "latest-advances-neurology-research",
			Content:   "<p>The field of neurology continues to evolve with groundbreaking discoveries. Recent studies have shown promising results in treating neurological disorders...</p>",
			Summary:   "Exploring recent breakthroughs in neurological research and treatment methods.",
			AuthorID:  doctors[1].ID,
			Category:  "Medical Research",
			Image:     "https://images.unsplash.com/photo-1559757175-7b31bfb2c5cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
			Published: true,
		},
		{
			ID:        uuid.New().String(),
			Title:     "The Importance of Regular Eye Check-ups",
			Slug:      "importance-regular-eye-checkups",
			Content:   "<p>Regular eye examinations are crucial for maintaining good vision and detecting early signs of eye diseases. Learn about the recommended frequency of check-ups and common eye conditions...</p>",
			Summary:   "Why you shouldn't skip your regular eye examinations and what to expect during a check-up.",
			AuthorID:  doctors[2].ID,
			Category:  "Patient Care",
			Image:     "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
			Published: true,
		},
		{
			ID:        uuid.New().String(),
			Title:     "AI in Healthcare: Transforming Patient Care",
			Slug:      "ai-healthcare-transforming-patient-care",
			Content:   "<p>Artificial Intelligence is revolutionizing healthcare delivery. From diagnosis to treatment planning, AI is helping healthcare providers make more accurate decisions...</p>",
			Summary:   "How artificial intelligence is improving healthcare delivery and patient outcomes.",
			AuthorID:  doctors[3].ID,
			Category:  "Technology",
			Image:     "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
			Published: true,
		},
	}

	// Clear existing posts first
	if err := h.DB.Exec("TRUNCATE TABLE posts CASCADE").Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert new posts
	for _, post := range posts {
		post.CreatedAt = time.Now()
		post.UpdatedAt = time.Now()
		if err := h.DB.Create(&post).Error; err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Add some sample comments
	comments := []Comment{
		{
			ID:      uuid.New().String(),
			PostID:  posts[0].ID,
			Name:    "John Smith",
			Email:   "john@example.com",
			Content: "Very informative article! I learned a lot about heart health.",
		},
		{
			ID:      uuid.New().String(),
			PostID:  posts[1].ID,
			Name:    "Sarah Johnson",
			Email:   "sarah@example.com",
			Content: "The research findings are fascinating. Looking forward to seeing how this develops.",
		},
	}

	for _, comment := range comments {
		comment.CreatedAt = time.Now()
		comment.UpdatedAt = time.Now()
		if err := h.DB.Create(&comment).Error; err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(posts)
}
