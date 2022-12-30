<template>
  <div class="space-y-4">
    <div class="flex flex-col"><label class="input-label" for="name">Name</label><input class="input-text" id="name"
        v-model="name" placeholder="A trip to Paris" /></div>
    <div class="flex flex-col"><label class="input-label" for="descriptio">Description</label><input class="input-text"
        id="description" v-model="description" placeholder="A trip is a real motivator!" /></div>
    <div class="flex flex-col"><label class="input-label" for="score">Points needed</label><input class="input-text"
        id="score" v-model="score" /></div>
    <div class="flex flex-col"><label class="input-label" for="progress">Progress</label><input class="input-text"
        id="progress" v-model="progress" /></div>
    <button class="mr-3 btn btn-filled" @click="submit">Save</button>
    <button class="btn btn-outline" @click="emits('close')">Close</button>
  </div>
</template>
  
<script setup>
const props = defineProps({
  goal: {
    type: Object,
    default: () => ({ name: '', description: '', score: 100, progress: 0 }),
  }
})

const emits = defineEmits(['close', 'submit'])

const { goal } = props

const name = ref(goal.name)
const description = ref(goal.description)
const score = ref(goal.score)
const progress = ref(goal.progress)

const submit = () => {
  emits('submit', {
    name: name.value,
    description: description.value,
    score: score.value,
    progress: progress.value,
  })
}
</script>