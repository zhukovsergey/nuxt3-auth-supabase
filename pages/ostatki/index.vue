<template>
  <div>
    <h1>Остатки филиалов</h1>
    <input type="file" @change="addfile" />

    <div v-for="(item, index) in tablexls">
      {{ item }}
    </div>
  </div>
</template>

<script setup>
import * as XLSX from "xlsx";
const supabase = useSupabaseClient();
let file = ref(null);
let arrayBuffer = ref("");
let filelist = ref(null);
let tablexls = ref(null);

getTable();
async function getTable() {
  let { data, error } = await supabase.from("xls").select("*");
  if (data) {
    tablexls.value = data;
  }

  if (error) {
    console.log(error);
    throw error;
  }
}

async function addfile(event) {
  console.log(event.target.files[0]);
  file.value = event.target.files[0];
  let fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file.value);
  fileReader.onload = async (e) => {
    arrayBuffer.value = fileReader.result;
    var data = new Uint8Array(arrayBuffer.value);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i)
      arr[i] = String.fromCharCode(data[i]);
    // console.log("arr" + arr);
    var bstr = arr.join("");
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    filelist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    let index;
    for (index = 0; index < filelist.length; ++index) {
      const { data, error } = await supabase.from("xls").insert([
        {
          table: [filelist[index]],
        },
      ]);

      if (error) console.log(error);
    }
  };
  getTable();
}
</script>
