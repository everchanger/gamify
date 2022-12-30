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
const token = useState("token");
const error = ref('')

onMounted(async () => {
  try {
    // Check if token is in local storage
    token.value = localStorage.getItem('token')
    if (token.value) {
      const response = await $fetch('/api/user', {
        method: 'GET',
        headers: {
          Authorization: token.value,
        },
      })
      user.value = JSON.parse(response)
    }

  } catch (e) {
    console.log('not logged in')
  }
})

</script>