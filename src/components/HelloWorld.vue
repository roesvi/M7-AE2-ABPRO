<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Aplicación de Gestión de Cursos - AdWeb Online
    </p>
    <p>
      Esta aplicación permitirá gestionar cursos en línea con autenticación Firebase.
    </p>
  </div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    default: 'Aplicación de Gestión de Cursos'
  }
})
</script>

<style scoped>
.hello {
  text-align: center;
  margin-top: 2rem;
}

h1 {
  color: #42b883;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}
</style>
