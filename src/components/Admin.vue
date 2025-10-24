<template>
  <div>
    <Navbar />

    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2><i class="bi bi-gear me-2"></i>Administración de Cursos</h2>
            <button
              class="btn btn-primary"
              @click="showAddModal = true"
            >
              <i class="bi bi-plus-circle me-2"></i>
              Agregar Curso
            </button>
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

      <!-- Courses table -->
      <div v-else class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Estado</th>
                      <th>Precio</th>
                      <th>Duración</th>
                      <th>Cupos</th>
                      <th>Inscritos</th>
                      <th class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="course in courses" :key="course.id">
                      <td class="fw-bold">{{ course.codigo }}</td>
                      <td>{{ course.nombre }}</td>
                      <td>
                        <span class="badge" :class="course.estado ? 'bg-success' : 'bg-secondary'">
                          {{ course.estado ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td>${{ course.precio?.toLocaleString() }}</td>
                      <td>{{ course.duracion }}</td>
                      <td>{{ course.cupos }}</td>
                      <td>{{ course.inscritos }}</td>
                      <td class="text-center">
                        <div class="btn-group" role="group">
                          <button
                            class="btn btn-sm btn-outline-primary"
                            @click="editCourse(course)"
                            title="Editar curso"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="confirmDeleteCourse(course)"
                            title="Eliminar curso"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mensaje cuando no hay cursos -->
              <div v-if="courses.length === 0" class="text-center py-4">
                <i class="bi bi-info-circle text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-2">No hay cursos registrados</p>
                <button
                  class="btn btn-primary"
                  @click="showAddModal = true"
                >
                  <i class="bi bi-plus-circle me-2"></i>
                  Agregar Primer Curso
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar curso -->
    <div
      v-if="showAddModal || showEditModal"
      class="modal fade show d-block"
      style="background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>
              {{ editingCourse ? 'Editar Curso' : 'Agregar Nuevo Curso' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <form @submit.prevent="saveCourse">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="codigo" class="form-label">Código *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="codigo"
                    v-model="courseForm.codigo"
                    required
                    :disabled="editingCourse"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="nombre" class="form-label">Nombre *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="nombre"
                    v-model="courseForm.nombre"
                    required
                  >
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="precio" class="form-label">Precio *</label>
                  <input
                    type="number"
                    class="form-control"
                    id="precio"
                    v-model.number="courseForm.precio"
                    required
                    min="0"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="duracion" class="form-label">Duración *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="duracion"
                    v-model="courseForm.duracion"
                    required
                    placeholder="ej: 2 meses"
                  >
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="cupos" class="form-label">Cupos *</label>
                  <input
                    type="number"
                    class="form-control"
                    id="cupos"
                    v-model.number="courseForm.cupos"
                    required
                    min="0"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="inscritos" class="form-label">Inscritos</label>
                  <input
                    type="number"
                    class="form-control"
                    id="inscritos"
                    v-model.number="courseForm.inscritos"
                    min="0"
                    :max="courseForm.cupos"
                  >
                </div>
              </div>

              <div class="mb-3">
                <label for="estado" class="form-label">Estado</label>
                <select class="form-select" id="estado" v-model="courseForm.estado">
                  <option :value="true">Activo</option>
                  <option :value="false">Inactivo</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <textarea
                  class="form-control"
                  id="descripcion"
                  v-model="courseForm.descripcion"
                  rows="3"
                  placeholder="Descripción del curso..."
                ></textarea>
              </div>

              <div class="mb-3">
                <label for="img" class="form-label">URL de Imagen</label>
                <input
                  type="url"
                  class="form-control"
                  id="img"
                  v-model="courseForm.img"
                  placeholder="https://ejemplo.com/imagen.jpg"
                >
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ editingCourse ? 'Actualizar Curso' : 'Agregar Curso' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div
      v-if="showDeleteModal"
      class="modal fade show d-block"
      style="background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Confirmar Eliminación
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showDeleteModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar el curso <strong>{{ courseToDelete?.nombre }}</strong>?</p>
            <p class="text-muted">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showDeleteModal = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteCourse"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Sí, borrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useCoursesStore } from '../stores/courses'
import Navbar from './Navbar.vue'

const coursesStore = useCoursesStore()

const courses = computed(() => coursesStore.courses)
const loading = computed(() => coursesStore.loading)
const error = computed(() => coursesStore.error)

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingCourse = ref(null)
const courseToDelete = ref(null)

// Formulario reactivo para cursos
const courseForm = reactive({
  id: '',
  codigo: '',
  nombre: '',
  estado: true,
  precio: 0,
  duracion: '',
  descripcion: '',
  cupos: 0,
  inscritos: 0,
  img: ''
})

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCourse.value = null
  resetForm()
}

const resetForm = () => {
  courseForm.id = ''
  courseForm.codigo = ''
  courseForm.nombre = ''
  courseForm.estado = true
  courseForm.precio = 0
  courseForm.duracion = ''
  courseForm.descripcion = ''
  courseForm.cupos = 0
  courseForm.inscritos = 0
  courseForm.img = ''
}

const editCourse = (course) => {
  editingCourse.value = course
  Object.assign(courseForm, course)
  showEditModal.value = true
}

const confirmDeleteCourse = (course) => {
  courseToDelete.value = course
  showDeleteModal.value = true
}

const saveCourse = async () => {
  try {
    if (editingCourse.value) {
      await coursesStore.updateCourse({
        id: courseForm.id,
        ...courseForm
      })
    } else {
      await coursesStore.addCourse(courseForm)
    }
    closeModal()
  } catch (err) {
    console.error('Error al guardar el curso:', err)
  }
}

const deleteCourse = async () => {
  try {
    await coursesStore.deleteCourse(courseToDelete.value.id)
    showDeleteModal.value = false
    courseToDelete.value = null
  } catch (err) {
    console.error('Error al eliminar el curso:', err)
  }
}

onMounted(() => {
  // Suscribirse a los cambios en la colección de cursos
  coursesStore.subscribeToCourses()
})
</script>

<style scoped>
.table th {
  border-top: none;
  font-weight: 600;
}

.table td {
  vertical-align: middle;
}

.btn-group .btn {
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.modal-content {
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.form-label {
  font-weight: 500;
}
</style>
