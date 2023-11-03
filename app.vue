<script setup>
const user = useSupabaseUser();

import { storeToRefs } from "pinia";
const main = useUserprofile();
const { userprofile } = storeToRefs(main);
const { addToStore } = main;

addToStore();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
