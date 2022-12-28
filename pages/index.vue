<template>
  <div>
    <div class="flex flex-col items-center space-y-4">
      <template v-if="!user">
        <input class="border px-2 py-1 roundend" v-model="email" type="email" placeholder="email" />
        <input class="border px-2 py-1 roundend" v-model="password" type="password" placeholder="password" />
        <button class="bg-green-700 border rounded px-6 py-2 shadow text-white font-semibold" @click="login">Log
          in</button>
      </template>
      <template v-else>
        <p>Logged in!</p>
        <button @click="logout">Logout</button>
      </template>
    </div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
  </div>
</template>

<script setup>
const user = useState('user')

const email = ref('test@test.com')
const password = ref('hej123')
const error = ref('')

const login = async () => {
  try {
    await $fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const response = await $fetch('/api/user')
    user.value = response
  } catch (error) {
    error.value = error
    console.log(error)
  }
}

const logout = async () => {
  await $fetch('/api/user', {
    method: 'delete',
  })
  user.value = ''
}

</script>