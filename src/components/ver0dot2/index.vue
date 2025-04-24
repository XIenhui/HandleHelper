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
          <GlobalFilterConfig @update="val => updateGlobal(val)"/>
        </div>
      </div>
    </el-scrollbar>
    <div class="buttonArea">
      <div>
        <el-button type="danger">{{`重置全部`}}</el-button>
        <el-button type="primary" plain @click="search">{{`查询`}}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import PinyinInputWithTone from './SingleQuery.vue'
import GlobalFilterConfig from './GlobleQuery.vue'
import { DataFilter, searchModal } from "@/data/dataHelper.js";

const emit = defineEmits(['update'])
const trigger = ref(true);
const filter = (data) => {
  if (trigger.value) {
    trigger.value = false;
  }
  return false
}
const actions: DataFilter = {
  filter1: {
    type: 2,
    handle: filter
  },
  filter2: {
    type: 2,
    handle: filter
  },
}
const search = () => {
  const { result, chunks } = searchModal(actions)
  emitCombined({ chunks, num: result.length })
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

const update = (index, data) => {
  inputs[index] = data.input;
  filters[index] = data.filter;
}

const updateGlobal = (val) => {
  Object.assign(globalFilters, val)
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
