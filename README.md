# 📚 Sistema de Gestión de Cursos

Sistema web completo para la gestión y visualización de cursos en línea, desarrollado con Vue.js 3 y Firebase. Incluye autenticación de usuarios, panel de administración y visualización en tiempo real de cursos disponibles.

## 🚀 Características

### Funcionalidades Principales

- **🔐 Autenticación de Usuarios**
  - Registro de nuevos usuarios
  - Inicio de sesión con email y contraseña
  - Protección de rutas con guards de navegación
  - Observador de estado de autenticación en tiempo real

- **👥 Vista de Usuario (Home)**
  - Visualización de cursos disponibles en tarjetas responsivas
  - Filtrado de cursos activos/inactivos
  - Información detallada de cada curso (precio, duración, cupos, inscritos)
  - Diseño moderno con Bootstrap 5 y Bootstrap Icons
  - Actualización en tiempo real de cambios en cursos

- **⚙️ Panel de Administración**
  - CRUD completo de cursos (Crear, Leer, Actualizar, Eliminar)
  - Tabla interactiva con todos los cursos
  - Modales para agregar y editar cursos
  - Confirmación antes de eliminar cursos
  - Validación de formularios

- **🔥 Integración con Firebase**
  - Firestore Database para almacenamiento de cursos
  - Firebase Authentication para gestión de usuarios
  - Sincronización en tiempo real con `onSnapshot`
  - Operaciones CRUD optimizadas

## 🛠️ Tecnologías Utilizadas

- **Frontend Framework:** Vue.js 3 (Composition API con `<script setup>`)
- **Build Tool:** Vite 7
- **Gestión de Estado:** Vuex 4
- **Enrutamiento:** Vue Router 4
- **UI Framework:** Bootstrap 5
- **Iconos:** Bootstrap Icons
- **Backend/Database:** Firebase (Firestore + Authentication)
- **HTTP Client:** Axios

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- Una cuenta de **Firebase** con un proyecto configurado

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd consumo_api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** (Email/Password)
3. Crea una base de datos **Firestore**
4. Copia las credenciales de configuración de Firebase
5. Crea un archivo `src/firebase.js` con el siguiente contenido:

```javascript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

### 4. Cargar datos iniciales (Opcional)

Para cargar cursos de ejemplo en Firestore:

1. Abre el archivo `loadInitialCourses.js`
2. Descomenta la última línea: `loadInitialCourses()`
3. Ejecuta el script:

```bash
node loadInitialCourses.js
```

## 🚀 Uso

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
consumo_api/
├── public/                  # Archivos estáticos
├── src/
│   ├── assets/             # Recursos (imágenes, logos)
│   ├── components/         # Componentes Vue
│   │   ├── Admin.vue       # Panel de administración
│   │   ├── Home.vue        # Vista principal de cursos
│   │   ├── Login.vue       # Formulario de inicio de sesión
│   │   ├── Register.vue    # Formulario de registro
│   │   ├── Navbar.vue      # Barra de navegación
│   │   └── LoadCourses.vue # Utilidad para cargar cursos
│   ├── store/              # Vuex store
│   │   └── index.js        # Configuración del store
│   ├── App.vue             # Componente raíz
│   ├── main.js             # Punto de entrada
│   ├── firebase.js         # Configuración de Firebase
│   └── style.css           # Estilos globales
├── loadInitialCourses.js   # Script para cargar datos iniciales
├── package.json            # Dependencias del proyecto
├── vite.config.js          # Configuración de Vite
└── README.md               # Este archivo
```

## 🎯 Flujo de la Aplicación

1. **Inicio:** El usuario es redirigido a `/login`
2. **Registro/Login:** El usuario puede registrarse o iniciar sesión
3. **Home:** Después de autenticarse, ve todos los cursos disponibles
4. **Admin:** Los usuarios autenticados pueden acceder al panel de administración para gestionar cursos
5. **Logout:** El usuario puede cerrar sesión desde la barra de navegación

## 🔐 Rutas Protegidas

Las siguientes rutas requieren autenticación:
- `/home` - Vista de cursos
- `/admin` - Panel de administración

Las siguientes rutas son públicas:
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/load-courses` - Cargar cursos iniciales

## 📊 Estructura de Datos (Firestore)

### Colección: `courses`

```javascript
{
  codigo: "0001",           // String - Código único del curso
  nombre: "HTML",           // String - Nombre del curso
  estado: true,             // Boolean - Activo/Inactivo
  precio: 30000,            // Number - Precio en pesos
  duracion: "1 mes",        // String - Duración del curso
  descripcion: "curso html", // String - Descripción
  cupos: 10,                // Number - Cupos disponibles
  inscritos: 0,             // Number - Estudiantes inscritos
  img: "https://..."        // String - URL de la imagen
}
```

## 🎨 Características de UI/UX

- **Diseño Responsivo:** Adaptable a móviles, tablets y escritorio
- **Tarjetas de Curso:** Información visual y organizada
- **Badges de Estado:** Indicadores visuales para cursos activos/inactivos
- **Animaciones:** Efectos hover y transiciones suaves
- **Modales:** Formularios en modales para mejor experiencia
- **Feedback Visual:** Spinners de carga y mensajes de confirmación

## 🔄 Gestión de Estado (Vuex)

El store de Vuex maneja:
- Estado de autenticación del usuario
- Lista de cursos en tiempo real
- Estados de carga
- Mensajes de error
- Operaciones CRUD de cursos

## 🐛 Solución de Problemas

### Error: Firebase no está configurado
- Verifica que el archivo `src/firebase.js` existe y tiene las credenciales correctas

### Error: No se muestran los cursos
- Asegúrate de que Firestore tiene la colección `courses` con datos
- Verifica las reglas de seguridad de Firestore

### Error de autenticación
- Confirma que Firebase Authentication está habilitado
- Verifica que el método Email/Password está activado

## 📝 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Compila para producción
npm run preview  # Vista previa de la build de producción
```

## 👨‍💻 Desarrollo

### Agregar un nuevo curso manualmente

Puedes usar el panel de administración o agregar directamente en Firestore Console.

### Modificar estilos

Los estilos están en:
- Estilos globales: `src/style.css`
- Estilos de componentes: Dentro de cada archivo `.vue` en la sección `<style scoped>`

## 📄 Licencia

Este proyecto es parte de un ejercicio académico para el Módulo 7 - Desarrollo de Aplicaciones Front End.

---

**Desarrollado con ❤️ usando Vue.js y Firebase**
