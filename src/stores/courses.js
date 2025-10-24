import { defineStore } from 'pinia'
import { ref } from 'vue'
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
import { db } from '../firebase'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Subscribe to courses updates
  function subscribeToCourses() {
    loading.value = true
    const q = query(collection(db, 'cursos'), orderBy('fecha', 'desc'))
    
    return onSnapshot(q, (querySnapshot) => {
      courses.value = []
      querySnapshot.forEach((doc) => {
        courses.value.push({
          id: doc.id,
          ...doc.data()
        })
      })
      loading.value = false
    }, (err) => {
      error.value = 'Error al cargar los cursos'
      loading.value = false
    })
  }

  // Add a new course
  async function addCourse(courseData) {
    try {
      loading.value = true
      await addDoc(collection(db, 'cursos'), {
        ...courseData,
        fecha: new Date().toISOString()
      })
      return { success: true }
    } catch (err) {
      error.value = 'Error al agregar el curso'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Update a course
  async function updateCourse({ id, ...courseData }) {
    try {
      loading.value = true
      await updateDoc(doc(db, 'cursos', id), {
        ...courseData,
        fecha: new Date().toISOString()
      })
      return { success: true }
    } catch (err) {
      error.value = 'Error al actualizar el curso'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Delete a course
  async function deleteCourse(courseId) {
    try {
      loading.value = true
      await deleteDoc(doc(db, 'cursos', courseId))
      return { success: true }
    } catch (err) {
      error.value = 'Error al eliminar el curso'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    courses,
    loading,
    error,
    
    // Actions
    subscribeToCourses,
    addCourse,
    updateCourse,
    deleteCourse
  }
})
