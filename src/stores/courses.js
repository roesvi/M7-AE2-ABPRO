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
  orderBy,
  where,
  getDocs
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

  // Delete a course by code (primary key)
  async function deleteCourse(code) {
    try {
      loading.value = true;
      console.log('Eliminando curso con código:', code);
      
      // First, find the course by code
      const q = query(collection(db, 'cursos'), where('codigo', '==', String(code)));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error(`No se encontró ningún curso con el código: ${code}`);
      }
      
      // Delete all matching documents (should be just one if codigo is unique)
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
        // Remove from local state using the document ID
        const index = courses.value.findIndex(c => c.id === doc.id);
        if (index !== -1) {
          courses.value.splice(index, 1);
        }
      });
      
      await Promise.all(deletePromises);
      return { success: true };
      
    } catch (err) {
      console.error('Error deleting course:', err);
      error.value = 'Error al eliminar el curso: ' + (err.message || 'Error desconocido');
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
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
