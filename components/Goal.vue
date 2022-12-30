<template>
  <div class="p-4 bg-white border border-l-8 shadow-md" :class="isDone ? 'border-l-green-500' : 'border-l-blue-500'">
    <div class="flex justify-between">
      <h4 class="font-semibold">{{ goal.name }}</h4>
      <div class="space-x-3 text-gray-800">
        <font-awesome-icon v-if="canInvest" class="cursor-pointer hover:text-blue-800" icon="fa-solid fa-dollar"
          size="xl" @click="isInvesting = !isInvesting" title="Invest" />
        <font-awesome-icon v-if="!isDone" class="cursor-pointer hover:text-blue-800" icon="fa-solid fa-cog" size="xl"
          @click="emits('edit', goal)" title="Edit" />
        <font-awesome-icon class="cursor-pointer hover:text-blue-800" icon="fa-solid fa-circle-xmark" size="xl"
          @click="emits('delete', goal)" title="Delete" />

      </div>
    </div>
    <div class="hidden">{{ goal.description }}</div>
    <div class="text-sm">{{ goal.progress }}/{{ goal.score }} points</div>


    <div v-if="canInvest" class="mt-4 space-x-2">
      <input type="number" v-if="isInvesting" v-model="amount" class="input-text max-w-[4rem]"
        placeholder="Points to invest" />
      <button class="btn btn-filled" v-if="isInvesting" @click="handleInvest(amount)">Some!</button>
      <button class="btn btn-outline" v-if="isInvesting" @click="handleInvest('all')">All!</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  goal: {
    type: Object,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['delete', 'edit', 'invest'])

const goal = toRefs(props).goal
const score = toRefs(props).score

const amount = ref(0)
const isInvesting = ref(false)

const handleInvest = (investAmount) => {
  emits('invest', { goal: goal.value, amount: investAmount })
  isInvesting.value = false
  amount.value = 0
}

const isDone = computed(() => {
  return goal.value.progress >= goal.value.score
})

const canInvest = computed(() => {
  return !!score && !isDone.value
})

</script>