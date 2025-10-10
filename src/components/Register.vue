<template>
  <div class="container-fluid px-5 mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7 col-xxl-6 d-flex justify-content-center">
        <div class="card">
          <div class="card-header bg-success text-white text-center">
            <h4 class="mb-2">Crear Cuenta</h4>
            <span class="mb-0 fw-bold fs-6 d-block">AdWeb Online</span>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                  placeholder="correo@ejemplo.com"
                >
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  placeholder="••••••••"
                  minlength="6"
                >
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  required
                  placeholder="••••••••"
                >
              </div>
              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-success"
                  :disabled="loading || password !== confirmPassword"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
                </button>
              </div>
            </form>
            <div class="text-center mt-3">
              <span class="d-inline fw-normal">¿Ya tienes cuenta?</span>
              <router-link to="/login" class="text-decoration-none ms-1 d-inline">
                Inicia sesión aquí
              </router-link>
            </div>
            <div v-if="error" class="alert alert-danger mt-3" role="alert">
              {{ error }}
            </div>
            <div v-if="password && confirmPassword && password !== confirmPassword"
                 class="alert alert-warning mt-3" role="alert">
              Las contraseñas no coinciden
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await store.dispatch('register', {
      email: email.value,
      password: password.value
    })

    if (result.success) {
      router.push('/home')
    } else {
      error.value = result.error || 'Error al crear la cuenta'
    }
  } catch (err) {
    error.value = 'Error inesperado al crear la cuenta'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Estilos mejorados para tarjetas */
.card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  max-width: 900px;
  min-width: 500px;
  margin: 0 auto;
}

.card-header {
  border-bottom: none;
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  color: white;
  padding: 3rem 2rem;
}

.card-body {
  padding: 3rem 2.5rem;
}

/* Estilos mejorados para formularios */
.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-control {
  border-radius: 8px;
  border: 2px solid #e1e5e9;
  padding: 0.75rem 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

/* Estilos mejorados para botones */
.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background: linear-gradient(135deg, #1e7e34 0%, #155724 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

/* Estilos para enlaces */
.text-decoration-none {
  color: #28a745;
  transition: color 0.3s ease;
}

.text-decoration-none:hover {
  color: #1e7e34;
  text-decoration: underline;
}
</style>
