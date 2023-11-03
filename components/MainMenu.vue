<template>
  <div
    class="mainmenu flex flex-wrap gap-4 items-center justify-between mx-4 mt-4"
  >
    <div>logo</div>
    <div class="flex gap-4 basis-1/2">
      <NuxtLink to="/user" class="mx-2 text-xl">{{
        userprofile.username ? userprofile.username : "Пользователь"
      }}</NuxtLink>
      <NuxtLink to="/beznal" class="mx-2 text-xl">Безнал</NuxtLink>
      <NuxtLink v-if="userprofile.isadmin" to="/user/users" class="mx-2 text-xl"
        >Пользователи</NuxtLink
      >
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
const main = useUserprofile();
const { userprofile } = storeToRefs(main);
</script>

<style lang="scss" scoped></style>
