<template>
  <el-select v-model="selectedValue" placeholder="请选择版本" @change="onVersionChange" style="width: 200px">
    <el-option
        v-for="item in options"
        :key="item.value + '-' + item.label"
        :label="item.label"
        :value="item.value + '-' + item.label"
    />
  </el-select>
</template>

<script setup>
import { versions } from "@/data/versions.js";
import { ref, onMounted } from "vue";
import { ElSelect, ElOption } from 'element-plus'
const emit = defineEmits(['update:version'])

const selectedValue = ref(null);
const options = ref([]);

onMounted(() => {
  options.value = versions.map((item, index) => ({
    value: `${item.value}-${item.name}`, // 避免重复 value
    label: item.name
  }));
});

function onVersionChange(val) {
  const [valueStr, name] = val.split("-");
  const version = versions.find(v => v.value === Number(valueStr) && v.name === name);
  if (version) {
    emit('update:version', version); // 发出完整版本配置
  }
}
</script>
