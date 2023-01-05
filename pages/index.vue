<template>
  <div class="flex flex-col items-center mt-8 space-y-4">
    <SignInForm @submit="login" />
  </div>
</template>

<script setup>
const { login } = useAuth()
</script>
