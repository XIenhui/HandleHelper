<template>
  <div>
    <el-scrollbar height="800px">
      <div class="pinyin-batch-input">
        <div class="input-column">
          <PinyinInputWithTone
              v-for="(_item, index) in inputs"
              :key="index"
              :globalFilterConfig="globalFilters"
              @update="(data) => update(index, data)"
          />
        </div>
        <div class="filter-area">
          <h4>全局过滤设置</h4>
          <GlobalFilterConfig @update="val => updateGlobal(val)"/>
        </div>
        <div class="contain-area">
          <h4>全局存在设置</h4>
          <GlobalFilterConfig :isExist="true" @update="val => updateGlobalExist(val)"/>
        </div>
      </div>
    </el-scrollbar>
    <div class="buttonArea">
      <div>
        <el-button type="danger" @click="reset">{{`重置全部`}}</el-button>
        <el-button type="primary" plain @click="search">{{`查询`}}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import PinyinInputWithTone from './SingleQuery.vue'
import GlobalFilterConfig from './GlobleQuery.vue'
import {DataFilter, parsePy, searchModal} from "@/data/dataHelper.js";

const emit = defineEmits(['update','reset'])
const trigger = ref(true);
const filter1 = (data) => {
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    const {
      character: hzInput,
      pinyin: pyInput,
      tone: sdInput
    } = inputs[index]
    if (hzInput && item[3] !== hzInput) return false;

    if (pyInput) {
      const pys = parsePy(pyInput).slice(0, 2)
      if (pys[0] && pys[0] !== item[0]) return false;
      if (pys[1] && pys[1] !== item[1]) return false;
    }
    else if (filters[index]) {
      const sm = filters[index].shengmu;
      const ym = filters[index].yunmu;
      if (sm[item[0]] === false) return false;
      if (ym[item[1]] === false) return false;
    }

    if (sdInput && item[2] !== sdInput) return false;
    else if (filters[index]) {
      const sd = filters[index].tone;
      if (sd && !sd[item[2]]) return false;
    }
  }
  return true
}
const filter2 = (data) => {
  for (let index = 0; index < data.length; index++) {
    const items = data[index];
    const {
      character: hzInput,
      pinyin: pyInput,
      tone: sdInput
    } = inputs[index]
    if (hzInput && items[0][3] !== hzInput) return false;

    if (pyInput) {
      const pys = parsePy(pyInput).slice(0, 2)
      if (items.every((item) => {
        if (pys[0] && pys[0] !== item[0]) return true;
        if (pys[1] && pys[1] !== item[1]) return true;
      })) return false
    }
    else if (filters[index]) {
      const sm = filters[index].shengmu;
      const ym = filters[index].yunmu;
      if (items.every((item) => {
        if (sm[item[0]] === false) return true;
        if (ym[item[1]] === false) return true;
      })) return false
    }

    if (sdInput && items.every((item) => item[2] !== sdInput)) return false;
    else if (filters[index]) {
      const sd = filters[index].tone;
      if (items.every((item) => {
        if (sd && !sd[item[2]]) return true;
      })) return false
    }
  }
  return true;
}
const actions: DataFilter = {
  filter1: {
    type: 2,
    handle: filter1
  },
  filter2: {
    type: 2,
    handle: filter2
  },
}
const search = () => {
  const { result, chunks } = searchModal(actions)
  emitCombined({ data: chunks, num: result.length })
}
const reset = () => {
  emit('reset');
}
const inputs = reactive([
  { character: '', pinyin: '', tone: null },
  { character: '', pinyin: '', tone: null },
  { character: '', pinyin: '', tone: null },
  { character: '', pinyin: '', tone: null }
])
const filters = reactive([
  { tone: [], shengmu: {}, yunmu: {} },
  { tone: [], shengmu: {}, yunmu: {} },
  { tone: [], shengmu: {}, yunmu: {} },
  { tone: [], shengmu: {}, yunmu: {} }
])
const globalFilters = reactive({
  tone: [],
  shengmu: {},
  yunmu: {}
})
const globalExists = reactive({
  tone: [],
  shengmu: {},
  yunmu: {}
})
const update = (index, data) => {
  inputs[index] = data.inputs;
  filters[index] = data.filters;
}
const updateGlobal = (val) => {
  Object.assign(globalFilters, val)
}
const updateGlobalExist = (val) => {
  Object.assign(globalExists, val)
}
const emitCombined = (data) => {
  emit('update', data)
}
</script>

<style scoped>
.pinyin-batch-input {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-column {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.filter-area {
  border-top: 1px dashed #ccc;
  padding-top: 16px;
}
.buttonArea {
  margin-top: 12px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
}
</style>
