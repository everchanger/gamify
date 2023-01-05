<template>
  <div class="container max-w-md min-h-full px-4 pb-4 mx-auto font-mono">
    <header class="flex items-center justify-between px-4 py-2 my-2 mb-8 bg-white shadow">
      <nuxt-link to="/app" class="flex items-center space-x-1 ">
        <h1 class="p-2 text-xl font-semibold text-teal-700 uppercase bg-teal-100 cursor-pointer rounded-xl">Goalify
        </h1><span class="font-semibold text-teal-700">- get things done</span>
      </nuxt-link>
      <button v-if="token" class=" btn btn-outline btn-icon" title="Sign out" @click="logout">
        <Icon name="fa6-solid:arrow-right-to-bracket" />
      </button>
    </header>
    <slot />
  </div>
</template>


<script setup>
const token = useState("token");
const logout = useLogout()
</script>