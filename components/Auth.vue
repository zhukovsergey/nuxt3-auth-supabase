<script setup>
const supabase = useSupabaseClient();

const loading = ref(false);
const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
  } catch (error) {
    alert(error.error_description || error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form class="row flex-center flex" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <h1 class="header">Авторизация</h1>
      <p class="description">Введите логин и пароль в поля ниже</p>
      <div>
        <input
          class="inputField"
          type="email"
          placeholder="Ваш E-Mailaaa"
          v-model="email"
        />
      </div>
      <div>
        <input
          class="inputField"
          type="password"
          placeholder="Пароль"
          v-model="password"
        />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Загрузка' : 'Авторизоваться'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
</template>
