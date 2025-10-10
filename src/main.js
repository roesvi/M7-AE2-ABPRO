import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import App from './App.vue'
import './style.css'

// Importar Bootstrap CSS (sin BootstrapVue por ahora)
import 'bootstrap/dist/css/bootstrap.css'

// Importar store
import store from './store'

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

// Guard de navegación
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated

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

// Usar store y router
app.use(store)
app.use(router)

// Inicializar observador de autenticación
store.dispatch('observeAuthState')

// Montar aplicación
app.mount('#app')
