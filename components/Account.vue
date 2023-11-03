<script setup>
const supabase = useSupabaseClient();
import { storeToRefs } from "pinia";
const loading = ref(true);
const username = ref("");

const website = ref("");
const avatar_path = ref("");
const messageUpdate = ref("");
const isadmin = ref(false);
const main = useUserprofile();
const userprofile = computed(() => main.userprofile);
const { addToStore } = main;
const { clearProfile } = main;
const tasks = ref();

loading.value = true;
const user = useSupabaseUser();

const { data } = await supabase
  .from("profiles")
  .select(`username, website, avatar_url,isadmin, tasks`)
  .eq("id", user.value.id)
  .single();

onMounted(() => {
  if (data) {
    try {
      username.value = data.username;
      website.value = data.website;
      isadmin.value = data.isadmin;
      tasks.value = data.tasks;
      loading.value = false;
    } catch (e) {
      console.log(e);
    }
  }
});

async function updateProfile() {
  try {
    loading.value = true;

    const updates = {
      id: user.value.id,
      username: username.value,
      website: website.value,
      avatar_url: avatar_path.value,
      tasks: [tasks.value],
      isadmin: isadmin.value,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates, {
      returning: "minimal", // Don't return the value after inserting
    });
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
    messageUpdate.value = "Успешно обновлено";
    setInterval(() => {
      messageUpdate.value = "";
    }, 2500);
  }
}

async function signOut() {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
    clearProfile();
    navigateTo("/");
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="user?.email" disabled />
    </div>
    <div>
      <label for="username">Имя пользователя</label>
      <input id="username" type="text" v-model="username" />
    </div>
    <div>
      <label for="website">Сайт</label>
      <input id="website" type="url" v-model="website" />
    </div>
    <div>
      <label for="website">Задачи</label>
      <input id="website" type="text" v-model="tasks" />
    </div>
    <div v-if="isadmin">
      <label for="isadmin">Администратор</label>
      <input
        type="checkbox"
        class="bg-gray-600 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        v-model="isadmin"
      />
    </div>

    <div>
      <span class="flex flex-center label mt-2 mb-2" v-if="messageUpdate">{{
        messageUpdate
      }}</span>
      <input
        type="submit"
        class="button primary block"
        :value="loading ? 'Загрузка ...' : 'Обновить'"
        :disabled="loading"
      />
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">
        Выйти
      </button>
    </div>
  </form>
</template>
