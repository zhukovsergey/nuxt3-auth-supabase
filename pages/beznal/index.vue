<template>
  <div class="container">
    <h1>Безнал номера</h1>
    <div class="forma flex gap-4 flex-col">
      <div>Выбрано: {{ magazin }}</div>
      <div>
        <select v-model="magazin" class="bg-gray-800 w-[180px] h-[33px]">
          <option disabled value="">Выбор магазина</option>
          <option>Проспект</option>
          <option>Плеханова</option>
          <option>Космонавтов</option>
          <option>Московская</option>
          <option>Мира</option>
        </select>
        <span v-if="!nomer || !magazin || !imya" class="ml-4"
          >Кнопка отправить появится после заполнения формы</span
        >
      </div>
      <div class="nomer">
        <input
          required
          v-model="nomer"
          type="text"
          name="price"
          id="price"
          class="block rounded-md border-0 py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Введите номер документа"
        />
      </div>
      <div class="imya">
        <input
          required
          v-model="imya"
          type="text"
          name="imya"
          id="imya"
          class="block rounded-md border-0 py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Имя пользователя"
        />
      </div>
      <div class="date">
        <input
          required
          v-model="date"
          type="text"
          name="date"
          id="date"
          class="block w-[300px] rounded-md border-0 py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Дата"
        />
      </div>
      <span v-if="err == 42501" class="text-red-500 font-bold text-xl mx-4"
        >Вы не авторизованы</span
      >
      <span v-if="err == 23505" class="text-red-500 font-bold text-xl mx-4"
        >Документ с таким номером уже есть в базе</span
      >
      <button
        v-if="nomer > 0 && magazin && imya"
        @click="submitForm"
        class="w-[150px] bg-indigo-500 rounded-md"
      >
        Отправить
      </button>
    </div>
    <div class="beznaltable mt-4">
      <table class="table-auto border-solid border-white">
        <thead>
          <tr>
            <th class="border-solid border-white">Порядковый номер</th>
            <th class="border-solid border-white">Номер документа</th>
            <th>Магазин</th>
            <th>Имя пользователя</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in table">
            <td class="px-2">{{ index + 1 }}</td>
            <td class="px-2">{{ item.nomer }}</td>
            <td class="px-2">{{ item.magazin }}</td>
            <td class="px-2">{{ item.imya }}</td>
            <td class="px-2">{{ item.date }}</td>
          </tr>
        </tbody>
      </table>
      <button
        v-if="showBtn"
        @click="reloadTableElse"
        class="w-[180px] bg-indigo-500 rounded-md mt-4 mb-4"
      >
        Показать еще...
      </button>
      <span class="my-4" v-else>Все данные таблицы подгружены</span>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
let formatter = new Intl.DateTimeFormat("ru", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});
const nomer = ref();
const imya = ref("");
const date = ref(formatter.format(new Date()));
const magazin = ref("");
const table = ref([]);
const page = ref(1);
const showBtn = ref(true);
const err = ref("");

const submitForm = async () => {
  const { data, error } = await supabase.from("beznal").insert([
    {
      nomer: nomer.value,
      imya: imya.value,
      date: date.value,
      magazin: magazin.value,
    },
  ]);
  if (error) {
    err.value = error.code;
    console.log(error);
    throw error;
  }

  //reloadTable();
};

setInterval(() => {
  err.value = "";
}, 3000);

onMounted(() => {
  supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "beznal" },
      (payload) => {
        table.value = [payload.new, ...toRaw(table.value)];
        refreshNuxtData;
      }
    )
    .subscribe();
});

async function reloadTable() {
  const { data, error } = await supabase
    .from("beznal")
    .select()
    .range(0, 5)
    .order("created_at", { ascending: false });
  table.value = data;

  if (error) {
    throw error;
  }
}

async function reloadTableElse() {
  page.value = page.value + 1;
  const counter = toRaw(table.value).length;
  const { count } = await supabase
    .from("beznal")
    .select("*", { count: "exact", head: true });
  console.log(count);
  const { data, error } = await supabase
    .from("beznal")
    .select()
    .range(counter, counter * page.value)
    .order("created_at", { ascending: false });

  table.value = [...toRaw(table.value), ...toRaw(data)];
  if (count == counter) {
    showBtn.value = false;
  }
  if (error) {
    throw error;
  }
}

onBeforeMount(() => {
  reloadTable();
}),
  setInterval(() => {
    date.value = formatter.format(new Date());
    refreshNuxtData;
  }, 1000);
</script>

<style lang="scss" scoped></style>
