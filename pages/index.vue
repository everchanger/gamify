<template>
  <div>
    <div class="flex flex-col items-center space-y-4">
      <template v-if="!user">
        <input class="px-2 py-1 border roundend" v-model="email" type="email" placeholder="email" />
        <input class="px-2 py-1 border roundend" v-model="password" type="password" placeholder="password" />
        <button class="px-6 py-2 font-semibold text-white bg-green-700 border rounded shadow" @click="login">Log
          in</button>
      </template>
      <template v-else>
        <p>Logged in!</p>
        <button @click="logout">Logout</button>
        <div>
          <div>
            <h2 class="mb-1">Goals</h2>
            <Goal class="mb-2" v-for="(goal, index) in user.goals" :goal="goal" :key="goal.name"
              @click="editingGoalIndex = index" />
            <p class="italic" v-if="!user.goals?.length">No goals creeated</p>
            <button class="p-2 font-semibold text-white uppercase bg-purple-600 rounded"
              v-if="editingGoalIndex === false" @click="editingGoalIndex = true">Create goal</button>

            <GoalForm v-if="editingGoalIndex !== false"
              :goal="editingGoalIndex === true ? undefined : user.goals[editingGoalIndex]" @submit="handleSubmit" />
          </div>
        </div>
      </template>
    </div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
  </div>
</template>

<script setup>
const user = useState('user')

const email = ref('test@test.com')
const password = ref('hej123')
const error = ref('')
const editingGoalIndex = ref(false)

const login = async () => {
  try {
    await $fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const response = await $fetch('/api/user')
    user.value = JSON.parse(response)
  } catch (error) {
    error.value = error
    console.log(error)
  }
}

const logout = async () => {
  await $fetch('/api/user', {
    method: 'delete',
  })
  user.value = ''
}

const handleSubmit = async (goal) => {
  try {
    const index = editingGoalIndex.value

    // Editing a goal, replace content in model
    if (index === true) {
      if (!user.value.goals) {
        user.value.goals = []
      }
      // Creating a new goal
      user.value.goals.push(goal)
    } else {
      // Editing a goal, replace content in model
      user.value.goals[index] = goal

      console.log(user.value)
    }

    const response = await $fetch('/api/user', {
      method: 'PUT',
      body: JSON.stringify(user.value),
    })

    console.log(response)


    editingGoalIndex.value = false
  } catch (error) {
    console.log(error)
  }
}

</script>