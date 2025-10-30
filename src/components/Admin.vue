<template>
  <div>
    <Navbar />

    <div class="container mt-4">
      <!-- Toast Notifications -->
      <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
        <div 
          v-for="(notification, index) in notifications" 
          :key="index" 
          class="toast show mb-2" 
          :class="`bg-${notification.type}`" 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
        >
          <div class="d-flex">
            <div class="toast-body text-white">
              <i :class="notification.icon + ' me-2'"></i>
              {{ notification.message }}
            </div>
            <button 
              type="button" 
              class="btn-close me-2 m-auto" 
              data-bs-dismiss="toast" 
              aria-label="Close" 
              @click="removeNotification(index)"
            ></button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2><i class="bi bi-gear me-2"></i>Administración de Cursos</h2>
            <button
              class="btn btn-primary"
              @click="openAddModal"
              :disabled="loading"
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
                      <td>{{ course.inscritos || 0 }}</td>
                      <td class="text-center">
                        <div class="btn-group" role="group">
                          <button 
                            class="btn btn-sm btn-outline-primary"
                            @click="editCourse(course)"
                            title="Editar"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-outline-danger"
                            @click="confirmDeleteCourse(course)"
                            title="Eliminar"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="courses.length === 0">
                      <td colspan="8" class="text-center">No hay cursos registrados</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Course Modal -->
    <div
      v-if="showAddModal"
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
              aria-label="Cerrar"
            ></button>
          </div>
          <form @submit.prevent="saveCourse" @keydown.enter.prevent>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="codigo" class="form-label">Código *</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.codigo }"
                    id="codigo"
                    v-model="courseForm.codigo"
                    @input="validateField('codigo')"
                    :disabled="!!editingCourse"
                    required
                  >
                  <div v-if="formErrors.codigo" class="invalid-feedback">
                    {{ formErrors.codigo }}
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="nombre" class="form-label">Nombre *</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.nombre }"
                    id="nombre"
                    v-model="courseForm.nombre"
                    @input="validateField('nombre')"
                    required
                  >
                  <div v-if="formErrors.nombre" class="invalid-feedback">
                    {{ formErrors.nombre }}
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="precio" class="form-label">Precio *</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      type="number"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.precio }"
                      id="precio"
                      v-model.number="courseForm.precio"
                      @input="validateField('precio')"
                      min="0"
                      step="1000"
                      required
                    >
                  </div>
                  <div v-if="formErrors.precio" class="invalid-feedback d-block">
                    {{ formErrors.precio }}
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="duracion" class="form-label">Duración *</label>
                  <select
                    class="form-select"
                    :class="{ 'is-invalid': formErrors.duracion }"
                    id="duracion"
                    v-model="courseForm.duracion"
                    @change="validateField('duracion')"
                    required
                  >
                    <option value="" disabled>Seleccione una duración</option>
                    <option value="1 mes">1 mes</option>
                    <option value="2 meses">2 meses</option>
                    <option value="3 meses">3 meses</option>
                    <option value="4 meses">4 meses</option>
                    <option value="5 meses">5 meses</option>
                    <option value="6 meses">6 meses</option>
                  </select>
                  <div v-if="formErrors.duracion" class="invalid-feedback">
                    {{ formErrors.duracion }}
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="cupos" class="form-label">Cupos *</label>
                  <input
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.cupos }"
                    id="cupos"
                    v-model.number="courseForm.cupos"
                    @input="validateField('cupos')"
                    min="0"
                    required
                  >
                  <div v-if="formErrors.cupos" class="invalid-feedback">
                    {{ formErrors.cupos }}
                  </div>
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
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="estado"
                    v-model="courseForm.estado"
                  >
                  <label class="form-check-label" for="estado">
                    {{ courseForm.estado ? 'Activo' : 'Inactivo' }}
                  </label>
                </div>
              </div>

              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción *</label>
                <textarea
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.descripcion }"
                  id="descripcion"
                  v-model="courseForm.descripcion"
                  @input="validateField('descripcion')"
                  rows="3"
                  maxlength="500"
                  required
                ></textarea>
                <div v-if="formErrors.descripcion" class="invalid-feedback">
                  {{ formErrors.descripcion }}
                </div>
                <div class="form-text">{{ courseForm.descripcion?.length || 0 }}/500</div>
              </div>

              <div class="mb-3">
                <label for="img" class="form-label">URL de la Imagen *</label>
                <input
                  type="url"
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.img }"
                  id="img"
                  v-model="courseForm.img"
                  @input="validateField('img')"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                >
                <div v-if="formErrors.img" class="invalid-feedback">
                  {{ formErrors.img }}
                </div>
                <div class="mt-2">
                  <img 
                    v-if="courseForm.img" 
                    :src="courseForm.img" 
                    class="img-thumbnail" 
                    style="max-height: 150px;"
                    @error="handleImageError"
                    alt="Vista previa de la imagen"
                  >
                  <div v-else class="text-muted">
                    Vista previa de la imagen
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
                :disabled="loading"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="loading || Object.keys(formErrors).length > 0"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ editingCourse ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="modal fade show d-block"
      style="background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle-fill text-danger me-2"></i>
              Confirmar eliminación
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <p>¿Está seguro que desea eliminar el curso <strong>{{ courseToDelete?.nombre }}</strong>?</p>
            <p class="text-danger">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal"
              :disabled="loading"
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
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useCoursesStore } from '../stores/courses';
import { collection, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from './Navbar.vue';

// Component registration is automatic with <script setup>
// The Navbar component is now properly registered for use in the template

// Initialize stores
const authStore = useAuthStore();
const coursesStore = useCoursesStore();

// State
const loading = ref(false);
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const editingCourse = ref(null);
const courseToDelete = ref(null);
const notifications = ref([]);
const searchQuery = ref('');

// Form state
const courseForm = ref({
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: 0,
  duracion: '',
  cupos: 0,
  inscritos: 0,
  estado: true,
  img: ''
});

// Form errors
const formErrors = ref({});

// Computed properties
const courses = computed(() => {
  return coursesStore.courses || [];
});

const filteredCourses = computed(() => {
  const searchTerm = searchQuery.value?.toLowerCase() || '';
  if (!searchTerm) return courses.value;
  
  return courses.value.filter(course => 
    course.nombre?.toLowerCase().includes(searchTerm) ||
    course.codigo?.toLowerCase().includes(searchTerm)
  );
});

// Methods
const openAddModal = () => {
  resetForm();
  editingCourse.value = null;
  showAddModal.value = true;
};

const editCourse = (course) => {
  editingCourse.value = course.id;
  courseForm.value = { ...course };
  showAddModal.value = true;
};

const confirmDeleteCourse = (course) => {
  console.log('Raw course object received:', course);
  console.log('Course ID (direct access):', course.id);
  console.log('Course keys:', Object.keys(course));
  
  // Try different ways to access the ID
  const courseId = course.id || course._id || (course._value && course._value.id);
  console.log('Found course ID:', courseId);
  
  // Create a plain object with all properties
  const courseData = {
    id: courseId,
    ...course
  };
  
  // Remove any potential duplicate ID
  delete courseData._id;
  
  courseToDelete.value = courseData;
  console.log('Final course data to delete:', courseToDelete.value);
  showDeleteModal.value = true;
};

const closeModal = (isDeleteOperation = false) => {
  showAddModal.value = false;
  showDeleteModal.value = false;
  
  // Only reset form if we're not in a delete operation
  if (!isDeleteOperation) {
    resetForm();
    courseToDelete.value = null;
  }
};

const resetForm = () => {
  courseForm.value = {
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: '',
    cupos: 0,
    inscritos: 0,
    estado: true,
    img: ''
  };
  formErrors.value = {};
};

const validateField = (field) => {
  const value = courseForm.value[field];
  
  // Clear previous error
  delete formErrors.value[field];
  
  // Field validations
  switch (field) {
    case 'codigo':
      if (!value) {
        formErrors.value.codigo = 'El código es requerido';
      } else if (!/^[A-Za-z0-9-]+$/.test(value)) {
        formErrors.value.codigo = 'Solo se permiten letras, números y guiones';
      }
      break;
      
    case 'nombre':
      if (!value) {
        formErrors.value.nombre = 'El nombre es requerido';
      } else if (value.length < 3) {
        formErrors.value.nombre = 'El nombre debe tener al menos 3 caracteres';
      }
      break;
      
    case 'precio':
      if (value === '' || value === null || value === undefined) {
        formErrors.value.precio = 'El precio es requerido';
      } else if (isNaN(value) || value < 0) {
        formErrors.value.precio = 'El precio debe ser un número positivo';
      }
      break;
      
    case 'duracion':
      if (!value) {
        formErrors.value.duracion = 'La duración es requerida';
      }
      break;
      
    case 'cupos':
      if (value === '' || value === null || value === undefined) {
        formErrors.value.cupos = 'Los cupos son requeridos';
      } else if (isNaN(value) || value < 0) {
        formErrors.value.cupos = 'Debe ser un número positivo';
      }
      break;
      
    case 'descripcion':
      if (!value) {
        formErrors.value.descripcion = 'La descripción es requerida';
      } else if (value.length < 10) {
        formErrors.value.descripcion = 'La descripción debe tener al menos 10 caracteres';
      }
      break;
      
    case 'img':
      if (!value) {
        formErrors.value.img = 'La URL de la imagen es requerida';
      } else {
        try {
          new URL(value);
        } catch (e) {
          formErrors.value.img = 'URL inválida';
        }
      }
      break;
  }
};

const validateForm = () => {
  // Validate all fields
  Object.keys(courseForm.value).forEach(field => {
    validateField(field);
  });
  
  return Object.keys(formErrors.value).length === 0;
};

const showNotification = (message, type = 'success') => {
  const icons = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
    warning: 'bi-exclamation-circle-fill'
  };
  
  const notification = {
    id: Date.now(),
    message,
    type,
    icon: icons[type] || 'bi-info-circle-fill'
  };
  
  notifications.value.push(notification);
  
  // Auto-remove notification after 5 seconds
  setTimeout(() => {
    const index = notifications.value.findIndex(n => n.id === notification.id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }, 5000);
};

const removeNotification = (index) => {
  notifications.value.splice(index, 1);
};

const handleImageError = (e) => {
  e.target.src = '/src/assets/noDisponible.png';
};

const checkDuplicateCode = (code, currentId = null) => {
  return coursesStore.courses.some(course => 
    course.codigo === code && course.id !== currentId
  );
};

const saveCourse = async () => {
  if (!validateForm()) {
    showNotification('Por favor corrija los errores en el formulario', 'danger');
    return;
  }
  
  // Check for duplicate course code
  if (checkDuplicateCode(courseForm.value.codigo, editingCourse.value)) {
    showNotification('Ya existe un curso con este código', 'danger');
    return;
  }
  
  loading.value = true;
  
  try {
    const courseData = { ...courseForm.value };
    
    if (editingCourse.value) {
      // Include the ID in the course data for the update
      const updateData = {
        id: editingCourse.value,
        ...courseData
      };
      await coursesStore.updateCourse(updateData);
      showNotification('Curso actualizado correctamente');
    } else {
      // Double check for duplicates in case of race conditions
      if (checkDuplicateCode(courseData.codigo)) {
        throw new Error('Ya existe un curso con este código');
      }
      await coursesStore.addCourse(courseData);
      showNotification('Curso creado correctamente');
    }
    
    closeModal();
  } catch (error) {
    console.error('Error al guardar el curso:', error);
    showNotification(error.message || 'Error al guardar el curso', 'danger');
  } finally {
    loading.value = false;
  }
};

const deleteCourse = async () => {
  console.log('Iniciando deleteCourse, courseToDelete:', courseToDelete.value);
  
  // Get the course code directly from the course object
  const courseCode = courseToDelete.value?.codigo;
  
  if (!courseCode) {
    const errorMsg = 'No se pudo obtener el código del curso';
    console.error(errorMsg, { 
      courseToDelete: courseToDelete.value,
      rawCourse: JSON.parse(JSON.stringify(courseToDelete.value))
    });
    showNotification('No se pudo identificar el código del curso a eliminar', 'danger');
    return;
  }
  
  loading.value = true;
  
  try {
    console.log('Eliminando curso con código:', courseCode);
    const result = await coursesStore.deleteCourse(courseCode);
    
    if (result && result.success) {
      console.log('Curso eliminado exitosamente');
      showNotification('Curso eliminado correctamente', 'success');
      
      // Manually remove the deleted course from the local state
      if (courseCode) {
        const index = coursesStore.courses.findIndex(c => c.codigo === courseCode);
        if (index !== -1) {
          coursesStore.courses.splice(index, 1);
        }
      }
      
      closeModal(true); // Pass true to indicate this is a delete operation
    } else {
      const errorMessage = result?.error || 'Error desconocido al eliminar el curso';
      console.error('Error al eliminar el curso:', errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error en deleteCourse:', error);
    showNotification(error.message || 'Error al eliminar el curso', 'danger');
  } finally {
    loading.value = false;
  }
};

// Temporary function to delete course by code
const deleteCourseByCode = async (code) => {
  try {
    loading.value = true;
    const q = query(collection(db, 'cursos'), where('codigo', '==', code));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`No se encontró un curso con código ${code}`);
      return { success: false, error: 'Curso no encontrado' };
    }
    
    // Delete all matching documents (should be just one if codigo is unique)
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    console.log(`Curso con código ${code} eliminado exitosamente`);
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar el curso:', error);
    return { success: false, error: error.message };
  } finally {
    loading.value = false;
  }
};

// Make the function available in the browser console
window.deleteCourseByCode = deleteCourseByCode;

// Lifecycle hooks
onMounted(() => {
  // Subscribe to course changes
  const unsubscribe = coursesStore.subscribeToCourses();
  
  // Cleanup subscription when component is unmounted
  return () => {
    if (unsubscribe) unsubscribe();
  };
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
