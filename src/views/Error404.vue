<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="text-center">
    <h1>404</h1>

    <p>Oops. Page not found...</p>

    <div class="flex flex-row justify-center space-x-4">
      <button @click="router.go(-1)" class="btn btn-primary my-5">Back</button>
      <button @click="router.push('/')" class="btn btn-secondary my-5">Home</button>
    </div>
    
  </div>
</template>
