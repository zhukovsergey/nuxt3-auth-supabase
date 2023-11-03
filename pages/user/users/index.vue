<template>
  <div class="container mt-[50px]">
    <div class="w-full">
      <div
        class="flex w-full gap-4 mt-2 border-solid border-[1px] border-indigo-400 py-2"
        v-for="(item, index) in users"
      >
        <div class="ml-[8px]">{{ index + 1 }}</div>
        <div @click="pickUser(item)" class="cursor-pointer">
          {{ item.username ? item.username : "Не назначено имя пользователя" }}
        </div>

        <div
          v-for="(task, index) in item.tasks"
          class="relative cursor pointer flex flex-wrap"
        >
          <Icon
            @click="pickTask(item, task)"
            class="absolute top-[-5px] right-[-4px] cursor-pointer"
            name="typcn:delete"
          />

          <span
            class="inline-flex items-center rounded-md bg-indigo-800 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-indigo-700/10 hover:bg-indigo-600"
            >№{{ index + 1 }}&nbsp;&nbsp;{{ task }}</span
          >
        </div>
      </div>
    </div>
    <div v-if="picked" class="flex flex-col mt-4">
      <span> Задание для пользователя {{ picked.username }}:</span>
      <input
        v-model="task"
        type="text"
        class="w-[350px] mt-4 rounded-md border-0 py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      <button
        @click="updateProfile"
        class="bg-indigo-500 rounded-md w-[200px] mt-2"
      >
        Добавить задание
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "user",
  middleware: ["auth"],
});

const task = ref([]);
const picked = ref();
const users = ref(null);
const supabase = useSupabaseClient();

async function pickTask(pickeditem, pickedtask) {
  console.log(pickeditem.tasks);
  const myArray = toRaw(pickeditem.tasks).filter(function (obj) {
    return obj !== pickedtask;
  });
  console.log(myArray);
  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: pickeditem.id, tasks: myArray })

      .select();
    if (error) throw error;
    getAllUsers();
  } catch (error) {
    console.log(error);
  }
}

function pickUser(user) {
  picked.value = user;
  // task.value.push(user.tasks);
  console.log(picked.value);
}

async function updateProfile() {
  for (let i = 0; i < users.value.length; i++) {
    if (picked.value.id == users.value[i].id) {
      if (users.value[i].tasks == null) {
        users.value[i].tasks = [task.value];
        //toRaw(users.value[i].tasks).push(toRaw(task.value));
        try {
          const { data, error } = await supabase
            .from("profiles")
            .upsert({ id: users.value[i].id, tasks: users.value[i].tasks })

            .select();
          if (error) {
            throw error;
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        toRaw(users.value[i].tasks)?.push(toRaw(task.value));
        //task.value = users.value[i].tasks;
        console.log(users.value[i].tasks);
        const { data, error } = await supabase
          .from("profiles")
          .upsert({ id: users.value[i].id, tasks: toRaw(users.value[i].tasks) })

          .select();
      }
    }
  }
  getAllUsers();
  // try {
  //   const idoftask = new Date();
  // const { data, error } = await supabase
  //   .from("profiles")
  //   .upsert({ id: picked.value.id, tasks: [task.value] })

  //   .select();

  // if (error) throw error;
  // } catch (error) {
  // alert(error.message);
  // }
}

async function getAllUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .order("id", { ascending: false });

  users.value = data;

  if (error) {
    throw error;
  }
}
getAllUsers();
</script>

<style lang="scss" scoped></style>
