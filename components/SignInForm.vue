<template>
  <div class="p-8 space-y-4 bg-white">
    <CInput v-model="email" id="email" label="Email" type="email" />
    <CInput v-model="password" id="password" label="Password" type="password" />
    <button class="btn btn-filled" @click="submit">
      Log in
    </button>
  </div>
</template>

<script setup>

const email = ref("");
const password = ref("");

const emits = defineEmits(['submit'])

const submit = () => {
  emits('submit', {
    email: email.value,
    password: password.value,
  })
}
</script>