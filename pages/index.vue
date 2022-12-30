<template>
  <div>
    <div class="max-w-md">
      <template v-if="!user">
        <div class="flex flex-col items-center mt-8 space-y-4">
          <input class="px-2 py-1 border roundend" v-model="email" type="email" placeholder="email" />
          <input class="px-2 py-1 border roundend" v-model="password" type="password" placeholder="password" />
          <button class="btn btn-filled " @click="login">
            Log in
          </button>
        </div>
      </template>
      <template v-else>
        <header class="flex items-center justify-between mt-4 mb-16">
          <p class="mr-8">Signed in as {{ user.email }}</p>
          <button class="btn btn-outline" @click="logout">Logout</button>
        </header>
        <p class="mb-4 text-2xl" v-if="user.score"><span class="font-bold text-blue-800 animate-pulse">{{ user.score
}}</span> points
          available!
        </p>
        <div class="space-y-8">
          <div class="space-y-6">
            <h2 class="mb-4 text-2xl">Goals</h2>
            <Goal v-for="(goal, index) in user.goals" :goal="goal" :key="goal.name" @edit="editingGoalIndex = index"
              @delete="remove('goals', index)" @invest="invest" :score="user.score" />
            <p class="italic" v-if="!user.goals?.length">No goals created</p>
            <button class=" btn btn-filled" v-if="editingGoalIndex === false" @click="editingGoalIndex = true">
              Create goal
            </button>

            <GoalForm v-if="editingGoalIndex !== false" :goal="
  editingGoalIndex === true
    ? undefined
    : user.goals[editingGoalIndex]
" @submit="handleSubmit" @close="editingGoalIndex = false" />
          </div>
          <div class="space-y-6">
            <h2 class="mb-4 text-2xl">Tasks</h2>
            <Task class="mb-2" v-for="(task, index) in user.tasks" :task="task" :key="task.name"
              @edit="editingTaskIndex = index" @delete="remove('tasks', index)" @complete="completeTask" />
            <p class="italic" v-if="!user.tasks?.length">No tasks created</p>
            <div class="flex flex-col items-start space-y-3">
              <button class="btn btn-filled" v-if="editingTaskIndex === false" @click="editingTaskIndex = true">
                Create task
              </button>
              <button class="btn btn-outline" v-if="editingTaskIndex === false" :disabled="!compltetedTasks?.length"
                @click="removeCompletedTasks">
                Delete all completed tasks
              </button>
            </div>
            <TaskForm v-if="editingTaskIndex !== false" :task="
  editingTaskIndex === true
    ? undefined
    : user.tasks[editingTaskIndex]
" @submit="handleSubmit" @close="editingTaskIndex = false" />
          </div>
        </div>
      </template>
    </div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
  </div>
</template>

<script setup>
const user = useState("user");

const email = ref("test@test.com");
const password = ref("hej123");
const error = ref("");
const editingGoalIndex = ref(false);
const editingTaskIndex = ref(false);

const compltetedTasks = computed(() => {
  return user.value?.tasks?.filter((task) => task.complete);
});

const login = async () => {
  try {
    await $fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const response = await $fetch("/api/user")
    user.value = JSON.parse(response)
  } catch (error) {
    error.value = error
    console.log(error)
  }
};

const logout = async () => {
  await $fetch("/api/user", {
    method: "delete",
  });
  user.value = "";
};

const updateUser = async () => {
  try {
    const response = await $fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify(user.value),
    });
    user.value = response
  } catch (error) {
    console.log(error)
    return false
  }
  return true
};

const invest = ({ goal, amount }) => {
  const index = user.value.goals.findIndex((g) => g.name === goal.name)

  const score = parseInt(user.value.score)
  amount = amount === 'all' ? parseInt(user.value.score) : parseInt(amount)

  if (score === 0 || amount > score) {
    alert("You don't have enough score to invest")
    return
  }

  user.value.goals[index].progress += amount
  if (!updateUser()) {
    user.value.goals[index].progress -= amount
  }
};

const completeTask = (task) => {
  const index = user.value.tasks.findIndex((t) => t.name === task.name)
  user.value.tasks[index].complete = true
  if (!updateUser()) {
    user.value.tasks[index].complete = false
  }
};

const remove = (prop, index) => {
  const res = confirm("Are you sure you want to delete this?")
  if (!res) return
  const removed = user.value[prop].splice(index, 1)
  if (!updateUser()) {
    user.value[prop].splice(index, 0, removed)
  }
};

const removeCompletedTasks = () => {
  const res = confirm("Are you sure you want to delete all completed tasks?")
  if (!res) return
  const originalTasks = [...user.value.tasks]
  user.value.tasks = user.value.tasks.filter((task) => !task.complete)
  if (!updateUser()) {
    user.value.tasks = originalTasks
  }
};

const handleSubmit = (goal) => {
  // What are we editing/creating, a goal or a task?
  const isTask = editingTaskIndex.value !== false
  const prop = isTask ? "tasks" : "goals"

  const index = isTask ? editingTaskIndex.value : editingGoalIndex.value

  if (user.value[prop]) {
    // Make sure we dont have a duplicate name
    const duplicateIndex = user.value[prop].findIndex((g) => g.name === goal.name)
    if (duplicateIndex !== -1 && (index === true || duplicateIndex !== index)) {
      alert("You already have an entry with that name")
      return
    }
  }


  if (index === true) {
    if (!user.value[prop]) {
      user.value[prop] = []
    }
    // Creating a new entry, push to model
    user.value[prop].push(goal)
  } else {
    // Editing, replace content in model
    user.value[prop][index] = goal
  }

  if (!updateUser()) {
    console.log('whoops, something went wrong')
  }



  editingGoalIndex.value = false
  editingTaskIndex.value = false
};
</script>