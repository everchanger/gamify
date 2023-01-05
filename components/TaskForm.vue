<template>
  <div class="space-y-4">
    <CInput v-model="name" id="name" label="Name" placeholder="Workout for 30 minutes" />
    <CInput v-model="description" id="description" label="Description" placeholder="Getting in shape is nice!" />
    <CInput v-model="score" id="score" label="Points" type="number" />
    <button class="mr-3 btn btn-filled" @click="submit">Save</button>
    <button class="btn btn-outline" @click="emits('close')">Close</button>
  </div>
</template>
    
<script setup>
const props = defineProps({
  task: {
    type: Object,
    default: () => ({ name: '', description: '', score: 10, complete: false }),
  }
})

const emits = defineEmits(['close', 'submit'])

const { task } = props

const name = ref(task.name)
const description = ref(task.description)
const score = ref(task.score)
const complete = ref(task.complete)

const submit = () => {
  emits('submit', {
    name: name.value,
    description: description.value,
    score: score.value,
    complete: complete.value,
  })
}
</script>