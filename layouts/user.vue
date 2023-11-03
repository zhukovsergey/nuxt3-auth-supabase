<template>
  <div>
    <MainMenu></MainMenu>
    <nav class="flex flex-col w-[200px] absolute mt-[50px] ml-4 text-xl gap-4">
      <NuxtLink to="/user/users">Задания</NuxtLink>
      <NuxtLink to="/opros">Экзамен</NuxtLink>
    </nav>
    <slot></slot>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
