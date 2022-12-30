<template>
    <div class="space-y-4">
        <div class="flex flex-col"><label class="input-label" for="name">Name</label><input class="input-text" id="name"
                v-model="name" placeholder="Workout for 30 minutes" /></div>
        <div class="flex flex-col"><label class="input-label" for="descriptio">Description</label><input
                class="input-text" id="description" v-model="description" placeholder="Getting in shape is nice!" />
        </div>
        <div class="flex flex-col"><label class="input-label" for="score">Points</label><input class="input-text"
                id="score" v-model="score" /></div>
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