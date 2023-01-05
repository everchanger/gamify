<template>
  <client-only>
    <Suspense>
      <div>
        <p class="mb-4 text-2xl" v-if="user.score"><span class="font-bold text-blue-800 animate-pulse">{{
          user.score
        }}</span> points
          available!
        </p>
        <div class="space-y-8">
          <div class="space-y-6">
            <h2 class="mb-4 text-2xl">Goals</h2>
            <Goal v-for="(goal, index) in user.goals" :goal="goal" :key="goal.name" @edit="openDialog('goal', index)"
              @delete="remove('goals', index)" @invest="invest" :score="user.score" />
            <p class="italic" v-if="!user.goals?.length">No goals created</p>
            <button class=" btn btn-filled" @click="openDialog('goal', true)">
              Create goal
            </button>

          </div>
          <div class="space-y-6">
            <h2 class="mb-4 text-2xl">Tasks</h2>
            <Task class="mb-2" v-for="(task, index) in user.tasks" :task="task" :key="task.name"
              @edit="editingTaskIndex = index" @delete="remove('tasks', index)" @complete="completeTask" />
            <p class="italic" v-if="!user.tasks?.length">No tasks created</p>
            <div class="flex flex-col items-start space-y-3">
              <button class="btn btn-filled" @click="openDialog('task', true)">
                Create task
              </button>
              <button class="btn btn-outline" v-if="editingTaskIndex === false" :disabled="!compltetedTasks?.length"
                @click="removeCompletedTasks">
                Delete all completed tasks
              </button>
            </div>
          </div>
        </div>

        <dialog ref="dialog" class="dialog">
          <GoalForm v-if="editingGoalIndex !== false" :goal="
            editingGoalIndex === true
              ? undefined
              : user.goals[editingGoalIndex]
          " @submit="handleSubmit" @close="closeDialog" />
          <TaskForm v-if="editingTaskIndex !== false" :task="
            editingTaskIndex === true
              ? undefined
              : user.tasks[editingTaskIndex]
          " @submit="handleSubmit" @close="closeDialog" />
        </dialog>
      </div>
    </Suspense>
    <template #placeholder>
      <div class="my-24">
        <Loader />
      </div>
    </template>
  </client-only>
</template>

<script setup>
const user = useState("user");
const token = useState("token");

const editingGoalIndex = ref(false);
const editingTaskIndex = ref(false);

const dialog = ref(null);

const { promise } = useAuth()
await promise;

const compltetedTasks = computed(() => {
  return user.value?.tasks?.filter((task) => task.complete);
});

const openDialog = (type, index) => {
  if (type === 'goal') {
    editingGoalIndex.value = index;
  } else {
    editingTaskIndex.value = index;
  }
  dialog.value.showModal();
};

const closeDialog = () => {
  dialog.value.classList.add('hide');
  dialog.value.addEventListener('animationend', () => {
    console.log('animation end')
    dialog.value.classList.remove('hide');
    dialog.value.close();
    editingGoalIndex.value = false;
    editingTaskIndex.value = false;
  }, { once: true });
};

const updateUser = async () => {
  try {
    const response = await $fetch("/api/user", {
      method: "PUT",
      headers: {
        Authorization: token.value,
      },
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

  closeDialog()
};
</script>

<style>
.dialog {}



.dialog[open] {
  @apply border rounded-lg shadow-sm p-6;
  animation: show-dialog 0.35s ease normal;
}

.dialog.hide {
  animation: hide-dialog 0.35s ease normal;
}

.dialog::backdrop {
  @apply fixed top-0 left-0 right-0 bottom-0 animate-none;
  background-color: rgba(0, 0, 0, .5);
}

.dialog[open]::backdrop {
  animation: show-backdrop 0.25s ease;
}

.dialog.hide::backdrop {
  animation: hide-backdrop 0.25s ease;
}

@keyframes show-dialog {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }

  to {
    opacity: 1;
    transform: translateY(0%);
  }
}

@keyframes hide-dialog {
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

@keyframes show-backdrop {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes hide-backdrop {
  to {
    opacity: 0;
  }
}
</style>