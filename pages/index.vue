<template>
  <div>
    <div class="container" style="padding: 50px 0 100px 0">
      <h1>Главная</h1>
      <Auth v-if="!user" />
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
</script>

<style lang="scss" scoped></style>
