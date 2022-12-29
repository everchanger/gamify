<template>
  <div class="space-y-4">
    <div class="flex flex-col"><label class="mr-4" for="name">Name</label><input class="px-2 py-1 border rounded" id="name" v-model="name" /></div>
    <div class="flex flex-col"><label class="mr-4" for="descriptio">Description</label><input class="px-2 py-1 border rounded" id="description" v-model="description" /></div>
    <div class="flex flex-col"><label class="mr-4" for="score">Score</label><input class="px-2 py-1 border rounded" id="score" v-model="score" /></div>
    <button class="p-2 font-semibold bg-yellow-500 rounded" @click="submit">Save</button>
  </div>
</template>
  
<script setup>
const props = defineProps({
  goal: {
    type: Object,
    default: () => ({ name: '', description: '', score: 0}),
  }
})

const emits = defineEmits(['submit'])

const { goal } = props

const name = ref(goal.name)
const description = ref(goal.description)
const score = ref(goal.score)

const submit = () => {
  emits('submit', {
    name: name.value,
    description: description.value,
    score: score.value,
  })
}
</script>