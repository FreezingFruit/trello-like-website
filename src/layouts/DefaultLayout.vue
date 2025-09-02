<script lang="ts" setup>
import NavBar from '@/components/Nav-bar.vue'
</script>

<template>
  <header><NavBar /></header>
  <main><slot /></main>
  <footer></footer>
</template>

<style scoped>
/* main {
  width: 1440px;
  margin: auto;
} */
</style>
