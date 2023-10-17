<script setup>
const supabase = useSupabaseClient();

const loading = ref(true);
const username = ref("");
const website = ref("");
const avatar_path = ref("");
const messageUpdate = ref("");

loading.value = true;
const user = useSupabaseUser();

const { data } = await supabase
  .from("profiles")
  .select(`username, website, avatar_url`)
  .eq("id", user.value.id)
  .single();

if (data) {
  username.value = data.username;
  website.value = data.website;
  avatar_path.value = data.avatar_url;
}

loading.value = false;

async function updateProfile() {
  try {
    loading.value = true;
    const user = useSupabaseUser();

    const updates = {
      id: user.value.id,
      username: username.value,
      website: website.value,
      avatar_url: avatar_path.value,
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
      <input id="email" type="text" :value="user.email" disabled />
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
