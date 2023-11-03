<template>
  <div class="container mt-[50px]">
    <h1>Страница пользователя</h1>
    <Account />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "user",
  middleware: ["auth"],
});
</script>

<style lang="scss" scoped></style>
