<template>
  <el-select v-model="selectedValue" placeholder="请选择版本" @change="onVersionChange" style="width: 200px">
    <el-option
        v-for="item in options"
        :key="item.value + '-' + item.label"
        :label="`ver-${item.label}`"
        :value="item.value + '-' + item.label"
    />
  </el-select>
</template>

<script setup>
import { versions } from "@/data/versions.js";
import { ref, onMounted } from "vue";
import { ElSelect, ElOption } from 'element-plus'
const emit = defineEmits(['update'])
const props = defineProps({
  version: {
    type: String
  }
})
const selectedValue = ref(null);
const options = ref([]);

onMounted(() => {
  selectedValue.value =  props.version ?? null
  options.value = versions.map((item, index) => ({
    value: `${item.value}-${item.name}`,
    label: item.name
  }));
});

function onVersionChange(val) {
  const [valueStr, name] = val.split("-");
  const version = versions.find(v => v.value === Number(valueStr) && v.name === name);
  if (version) {
    emit('update', version);
  }
}
</script>
