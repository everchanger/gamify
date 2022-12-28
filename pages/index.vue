<template>
  <div>
    <h1>Home</h1>
    <p>{{ title }}</p>
    <div>{{ apiResult }}</div>
  </div>
</template>

<script setup>
const apiResult = await $fetch('/api/goals')
const title = ref('Hej')
</script>