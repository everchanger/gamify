<template>
  <div class="bg-red-500" v-if="error">{{ error }}</div>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const error = ref('')

onMounted(async () => {
  useAuth()
})

</script>