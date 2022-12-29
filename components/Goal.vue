<template>
  <div>
    <div>{{ goal.name }}</div>
    <div>{{ goal.description }}</div>
    <div>{{ goal.score }}</div>
  </div>  
</template>

<script setup>
const props = defineProps({
  goal: {
    type: Object,
    required: true
  }
})

const goal = toRefs(props).goal

</script>