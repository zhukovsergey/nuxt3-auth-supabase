<template>
  <div class="text-white flex justify-center items-center mt-[50px]">
    <div v-if="!data.opros" class="flex mb-4 flex-col">
      <div v-if="fraze" class="bg-indigo-500 rounded-md w-[300px]">
        {{ fraze }} Ваши баллы: {{ points }} Процент {{ percent }} %
      </div>
      <div v-if="percent < 66">Нормально</div>
      <div v-for="(i, index) in opros.questions" :id="index">
        {{ i.question }}

        <div v-for="item in i.answers" class="flex items-center">
          <input
            @click="checkanswer(item, i.goodanswer, index)"
            v-model="radio"
            type="radio"
            :value="item"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />

          <label
            for="default-radio-1"
            class="ml-2 text-sm font-medium 0 text-white"
            :class="disbutton ? 'display:none' : 'display: block'"
            >{{ item }}</label
          >
        </div>
      </div>
    </div>
    <div v-else>"Вы уже проходили этот опрос"</div>
  </div>
</template>

<script setup>
import opros from "../../src/opros.json";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
let radio = ref("");
let points = ref(null);
let fraze = ref("");
let disbutton = ref(false);
let kolvo = ref(0);

const { data } = await supabase
  .from("profiles")
  .select(`username, website, avatar_url,isadmin, tasks, opros`)
  .eq("id", user.value.id)
  .single();

const percent = computed(() => {
  return Math.floor((points.value * 100) / opros.questions.length);
});

async function checkanswer(otvet, goodotvet, index) {
  var textarea = document.getElementById(index);
  textarea.style.display = "none";

  if (otvet == goodotvet) {
    kolvo.value = kolvo.value + 1;
    console.log(kolvo.value);
    points.value = points.value + 1;
    fraze.value = "Вы ответили правильно";
    disbutton.value = true;
  } else {
    kolvo.value = kolvo.value + 1;
    console.log(kolvo.value);
    fraze.value = "Вы ответили неправильно";
  }
  if (kolvo.value == opros.questions.length) {
    alert("Все");
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: user.value.id, opros: true })

      .select();
  }
}
</script>
