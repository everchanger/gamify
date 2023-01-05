<template>
  <div class="space-y-4">
    <CInput v-model="name" id="name" label="Name" placeholder="A trip to Paris" />
    <CInput v-model="description" id="description" label="Description" placeholder="A trip is a real motivator!" />
    <CInput v-model="score" id="score" label="Points needed" type="number" />
    <CInput v-model="progress" id="progress" label="Progress" type="number" />
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