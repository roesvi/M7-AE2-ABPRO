import { createStore } from 'vuex'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'
import { auth, db } from '../firebase'

export default createStore({
  state: {
    user: null,
    courses: [],
    loading: false,
    error: null,
    showLoginMessage: false
  },

  getters: {
    user: (state) => state.user,
    courses: (state) => state.courses,
    loading: (state) => state.loading,
    error: (state) => state.error,
    showLoginMessage: (state) => state.showLoginMessage,
    isAuthenticated: (state) => !!state.user
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
    },

    SET_COURSES(state, courses) {
      state.courses = courses
    },

    ADD_COURSE(state, course) {
      state.courses.push(course)
    },

    UPDATE_COURSE(state, updatedCourse) {
      const index = state.courses.findIndex(course => course.id === updatedCourse.id)
      if (index !== -1) {
        state.courses.splice(index, 1, updatedCourse)
      }
    },

    DELETE_COURSE(state, courseId) {
      state.courses = state.courses.filter(course => course.id !== courseId)
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    SET_LOGIN_MESSAGE(state, show) {
      state.showLoginMessage = show
    }
  },

  actions: {
    // Autenticación
    async register({ commit }, { email, password }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        commit('SET_USER', userCredential.user)
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async login({ commit }, { email, password }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        commit('SET_USER', userCredential.user)
        commit('SET_LOGIN_MESSAGE', true)
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async logout({ commit }) {
      try {
        await signOut(auth)
        commit('SET_USER', null)
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      }
    },

    // Observar cambios de autenticación
    observeAuthState({ commit }) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          commit('SET_USER', user)
          commit('SET_LOGIN_MESSAGE', true)
        } else {
          commit('SET_USER', null)
          commit('SET_LOGIN_MESSAGE', false)
        }
      })
    },

    // Gestión de cursos
    subscribeToCourses({ commit }) {
      const q = query(collection(db, 'courses'), orderBy('codigo'))
      return onSnapshot(q, (querySnapshot) => {
        const courses = []
        querySnapshot.forEach((doc) => {
          courses.push({
            id: doc.id,
            ...doc.data()
          })
        })
        commit('SET_COURSES', courses)
      })
    },

    async addCourse({ commit }, courseData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const docRef = await addDoc(collection(db, 'courses'), courseData)
        // No hacer commit de ADD_COURSE porque onSnapshot lo manejará automáticamente
        return { success: true, course: { id: docRef.id, ...courseData } }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateCourse({ commit }, { id, ...courseData }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const courseRef = doc(db, 'courses', id)
        await updateDoc(courseRef, courseData)
        // No hacer commit de UPDATE_COURSE porque onSnapshot lo manejará automáticamente
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteCourse({ commit }, courseId) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        await deleteDoc(doc(db, 'courses', courseId))
        // No hacer commit de DELETE_COURSE porque onSnapshot lo manejará automáticamente
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Ocultar mensaje de login
    hideLoginMessage({ commit }) {
      commit('SET_LOGIN_MESSAGE', false)
    }
  }
})
