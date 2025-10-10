<template>
  <div>
    <Navbar />

    <div class="container-fluid px-4 mt-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2><i class="bi bi-book me-2"></i>Cursos Disponibles</h2>
            <span class="badge bg-primary fs-6">{{ courses.length }} cursos</span>
          </div>
        </div>
      </div>

      <!-- Mensaje de login exitoso -->
      <div v-if="showLoginMessage" class="row">
        <div class="col-12">
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle me-2"></i>
            ¡Bienvenido! Has iniciado sesión correctamente.
            <button
              type="button"
              class="btn-close"
              @click="hideLoginMessage"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>

      <!-- Loading spinner -->
      <div v-if="loading" class="row">
        <div class="col-12 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Cargando cursos...</p>
        </div>
      </div>

      <!-- Course cards -->
      <div v-else class="row g-4 justify-content-center">
        <div
          v-for="course in courses"
          :key="course.id"
          class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 col-xxl-3"
        >
          <div class="card course-card h-100 shadow-sm">
            <div class="card-img-container">
              <img
                :src="course.img"
                class="card-img-top course-image"
                :alt="course.nombre"
                @error="handleImageError"
              >
              <div class="course-status" :class="{ 'inactive': !course.estado }">
                <span class="badge" :class="course.estado ? 'bg-success' : 'bg-secondary'">
                  {{ course.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>

            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-center mb-3">{{ course.nombre }}</h5>
              <p class="card-text flex-grow-1">{{ course.descripcion }}</p>

              <div class="course-details mb-3">
                <div class="row text-center g-2">
                  <div class="col-6">
                    <div class="detail-item">
                      <small class="text-muted">Precio</small>
                      <div class="fw-bold text-success fs-5">
                        <i class="bi bi-currency-dollar"></i>${{ course.precio?.toLocaleString() }}
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="detail-item">
                      <small class="text-muted">Duración</small>
                      <div class="fw-bold fs-6">
                        <i class="bi bi-clock"></i> {{ course.duracion }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row text-center g-2 mt-2">
                  <div class="col-6">
                    <div class="detail-item">
                      <small class="text-muted">Cupos</small>
                      <div class="fw-bold text-primary fs-6">
                        <i class="bi bi-people"></i> {{ course.cupos }}
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="detail-item">
                      <small class="text-muted">Inscritos</small>
                      <div class="fw-bold text-info fs-6">
                        <i class="bi bi-person-check"></i> {{ course.inscritos }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">Código: {{ course.codigo }}</small>
                  <button
                    v-if="course.estado"
                    class="btn btn-primary"
                    @click="inscribirseCurso(course)"
                  >
                    <i class="bi bi-person-plus me-2"></i>
                    Inscribirse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay cursos -->
      <div v-if="!loading && courses.length === 0" class="row">
        <div class="col-12 text-center">
          <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            No hay cursos disponibles en este momento.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Navbar from './Navbar.vue'

const store = useStore()

const courses = computed(() => store.getters.courses)
const loading = computed(() => store.getters.loading)
const showLoginMessage = computed(() => store.getters.showLoginMessage)

const hideLoginMessage = () => {
  store.dispatch('hideLoginMessage')
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible'
}

const inscribirseCurso = (course) => {
  // Aquí puedes implementar la lógica de inscripción
  alert(`Inscripción al curso ${course.nombre} - Esta funcionalidad se implementará próximamente`)
}

onMounted(() => {
  // Suscribirse a los cambios en la colección de cursos
  store.dispatch('subscribeToCourses')
})
</script>

<style scoped>
.course-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  border-radius: 15px;
  overflow: hidden;
  height: 100%;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card-img-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-card:hover .course-image {
  transform: scale(1.05);
}

.course-status {
  position: absolute;
  top: 12px;
  right: 12px;
}

.course-details {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 20px 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.detail-item {
  padding: 15px 10px;
  background: white;
  border-radius: 8px;
  transition: transform 0.2s ease;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.detail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
}

.badge {
  font-size: 0.75rem;
  padding: 6px 10px;
}

/* Responsive adjustments */
@media (max-width: 575px) {
  .course-details {
    padding: 15px 10px;
  }

  .detail-item {
    padding: 10px 8px;
    min-height: 70px;
  }
}
</style>
