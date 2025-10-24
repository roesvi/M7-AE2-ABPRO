// Utility script to load initial courses data into Firestore
// This script should be run after setting up Firebase configuration

import { collection, addDoc } from 'firebase/firestore'
import { db } from './src/firebase.js'

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
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/CSS3_logo.svg/800px-CSS3_logo.svg.png"
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

export const loadInitialCourses = async () => {
  try {
    console.log('Loading initial courses data...')

    for (const course of initialCourses) {
      await addDoc(collection(db, 'courses'), course)
      console.log(`Added course: ${course.nombre}`)
    }

    console.log('All initial courses loaded successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error loading initial courses:', error)
    return { success: false, error: error.message }
  }
}

// Uncomment the line below to run this script
// loadInitialCourses()
