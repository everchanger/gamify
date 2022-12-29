<template>
  <div>
    <div class="bg-red-500" v-if="error">{{ error }}</div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>

const user = useState('user')
const error = ref('')

onMounted(async () => {
  try {
    const response = await $fetch('/api/user')
    user.value = JSON.parse(response)
  } catch (e) {
    console.log('not logged in')
  }
})

</script>