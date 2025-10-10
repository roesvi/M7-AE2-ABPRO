<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8">
        <div class="card">
          <div class="card-header bg-info text-white">
            <h4>Cargar Cursos Iniciales a Firebase</h4>
          </div>
          <div class="card-body">
            <p>Haz clic en el botón para cargar los cursos iniciales en Firestore.</p>
            
            <button 
              class="btn btn-primary btn-lg"
              @click="loadCourses"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Cargando...' : 'Cargar Cursos' }}
            </button>

            <div v-if="message" class="alert mt-3" :class="messageClass" role="alert">
              {{ message }}
            </div>

            <div v-if="coursesLoaded.length > 0" class="mt-3">
              <h5>Cursos cargados:</h5>
              <ul class="list-group">
                <li v-for="course in coursesLoaded" :key="course" class="list-group-item">
                  ✓ {{ course }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

const loading = ref(false)
const message = ref('')
const messageClass = ref('')
const coursesLoaded = ref([])

const initialCourses = [
  {
    codigo: "0001",
    nombre: "HTML",
    estado: true,
    precio: 30000,
    duracion: "1 mes",
    descripcion: "curso html",
    cupos: 10,
    inscritos: 0,
    img: "https://www.w3.org/html/logo/downloads/HTML5_Logo_512.png"
  },
  {
    codigo: "0002",
    nombre: "CSS",
    estado: false,
    precio: 20000,
    duracion: "1 mes",
    descripcion: "curso css",
    cupos: 20,
    inscritos: 0,
    img: "https://lineadecodigo.com/wp-content/uploads/2014/04/css.png"
  },
  {
    codigo: "0003",
    nombre: "SASS",
    estado: true,
    precio: 40000,
    duracion: "2 mes",
    descripcion: "curso sass",
    cupos: 30,
    inscritos: 0,
    img: "https://miro.medium.com/max/512/1*9U1toerFxB8aiFRreLxEUQ.png"
  },
  {
    codigo: "0004",
    nombre: "VUE",
    estado: false,
    precio: 50000,
    duracion: "3 mes",
    descripcion: "curso vue",
    cupos: 15,
    inscritos: 0,
    img: "https://thumbs.gfycat.com/PinkPiercingBull-size_restricted.gif"
  }
]

const loadCourses = async () => {
  loading.value = true
  message.value = ''
  coursesLoaded.value = []
  
  try {
    for (const course of initialCourses) {
      await addDoc(collection(db, 'courses'), course)
      coursesLoaded.value.push(course.nombre)
      console.log(`✓ Curso agregado: ${course.nombre}`)
    }
    
    message.value = '¡Todos los cursos se cargaron exitosamente en Firebase!'
    messageClass.value = 'alert-success'
  } catch (error) {
    console.error('Error al cargar cursos:', error)
    message.value = `Error: ${error.message}`
    messageClass.value = 'alert-danger'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.2rem;
}
</style>
