<template>
  <div class="flex flex-col"><label v-if="label" class="input-label" :for="id">{{ label }}</label><input v-bind="$attrs"
      class="input-text" :value="modelValue" @input="emits('update:modelValue', $event.target.value)" />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:modelValue'])
</script>