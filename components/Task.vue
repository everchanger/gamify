<template>
  <div class="p-4 bg-white border border-l-8 shadow-md"
    :class="task.complete ? 'border-l-green-500' : 'border-l-blue-500'">
    <div class="flex justify-between">
      <h4 class="font-semibold">{{ task.name }}</h4>
      <div class="space-x-3 text-gray-800">
        <Icon v-if="!task.complete" class="cursor-pointer hover:text-blue-800" icon="fa6-solid:wrench"
          @click="emits('edit', task)" title="Edit" />
        <Icon class="cursor-pointer hover:text-blue-800" name="fa6-solid:circle-xmark" @click="emits('delete', task)"
          title="Delete" />
      </div>
    </div>
    <div class="text-sm">{{ task.score }} points</div>
    <div class="text-sm">{{ task.complete ? 'Completed!' : 'Not yet completed' }}</div>

    <div class="mt-4 space-x-4">
      <button v-if="!task.complete" class="btn btn-outline" @click="emits('complete', task)">Complete!</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['delete', 'edit', 'complete'])

const task = toRefs(props).task

</script>