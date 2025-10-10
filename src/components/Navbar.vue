<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/home">
        <i class="bi bi-book me-2"></i>
        <span class="fw-bold">AdWeb Online</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/home">
              <i class="bi bi-house-door me-1"></i>
              Inicio
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin">
              <i class="bi bi-gear me-1"></i>
              Administración
            </router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center">
          <span class="navbar-text me-3 text-white">
            <i class="bi bi-person-circle me-1"></i>
            {{ user?.email }}
          </span>
          <button
            class="btn btn-outline-light btn-sm"
            @click="handleLogout"
            :disabled="loading"
          >
            <i class="bi bi-box-arrow-right me-1"></i>
            {{ loading ? 'Saliendo...' : 'Salir' }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const user = computed(() => store.getters.user)
const loading = computed(() => store.getters.loading)

const handleLogout = async () => {
  try {
    const result = await store.dispatch('logout')
    if (result.success) {
      router.push('/login')
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
  font-size: 1.25rem;
}

.navbar-text {
  font-size: 0.9rem;
}

.btn-outline-light {
  border-color: #fff;
  color: #fff;
}

.btn-outline-light:hover {
  background-color: #fff;
  color: #000;
}
</style>
