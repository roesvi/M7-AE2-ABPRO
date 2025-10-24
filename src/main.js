import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Initialize Pinia
const pinia = createPinia()

// Importar Bootstrap CSS (sin BootstrapVue por ahora)
import 'bootstrap/dist/css/bootstrap.css'

// Importar el store de autenticación (se inicializará después de que Pinia esté listo)
let authStore = null

// Definir rutas
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./components/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./components/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/load-courses',
    name: 'LoadCourses',
    component: () => import('./components/LoadCourses.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('./components/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('./components/Admin.vue'),
    meta: { requiresAuth: true }
  }
]

// Crear router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Importar el store de autenticación para el guard
import { useAuthStore } from './stores/auth'

// Guard de navegación
router.beforeEach(async (to, from, next) => {
  // Obtener el store de autenticación
  const authStore = useAuthStore()
  
  // Esperar a que se resuelva el estado de autenticación
  await new Promise(resolve => setTimeout(resolve, 0))
  
  const isAuthenticated = authStore.isAuthenticated()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else if (to.path === '/login' && isAuthenticated) {
    next('/home')
  } else {
    next()
  }
})

// Crear aplicación
const app = createApp(App)

// Usar Pinia primero
app.use(pinia)

// Inicializar el store de autenticación después de que Pinia esté listo
authStore = useAuthStore()
authStore.init()

// Luego usar el router
app.use(router)

app.mount('#app')
