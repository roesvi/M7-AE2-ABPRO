import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const showLoginMessage = ref(false)

  // Getters
  const isAuthenticated = () => !!user.value

  // Actions
  async function register(email, password) {
    try {
      loading.value = true
      error.value = null
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    try {
      loading.value = true
      error.value = null
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return { success: true }
    } catch (err) {
      error.value = 'Credenciales inválidas'
      return { success: false, error: 'Credenciales inválidas' }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Initialize auth state listener
  function init() {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
    })
  }

  return {
    // State
    user,
    loading,
    error,
    showLoginMessage,
    
    // Getters
    isAuthenticated,
    
    // Actions
    register,
    login,
    logout,
    init
  }
})
