<template>
  <div>
    <el-scrollbar height="800px">
      <div class="pinyin-batch-input">
        <div class="input-column">
          <PinyinInputWithTone
              v-for="(_item, index) in inputs"
              :key="index"
              :globalFilterConfig="globalFilters"
              @updateInput="(data) => updateInput(index, data)"
              @updateFilter="(data) => updateFilter(index, data)"
              @updateExist="(data, type) => updateExist(index, data, type)"
          />
        </div>
        <div class="filter-area">
          <h4>全局过滤设置</h4>
          <GlobalFilterConfig @update="updateGlobal"/>
        </div>
        <div class="contain-area">
          <h4>全局存在设置</h4>
          <GlobalFilterConfig :isExist="true" @update="updateGlobalExist"/>
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
const logDebounce = (data, time = 500) => {
  if (trigger.value) {
    console.log(data)
    trigger.value = false;
    const timer = setTimeout(() => {
      trigger.value = true;
      clearTimeout(timer);
    }, time)
  }
}
const filter1 = (data) => {
  const filterRes = filterFilter(data, 0);
  const existRes = existFilter(data, 0);
  return filterRes && existRes;
}
const filter2 = (data) => {
  const filterRes = filterFilter(data, 1);
  const existRes = existFilter(data, 1);
  return filterRes && existRes;
}
const filterFilter = (data, type = 0) => {
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    const items = data[index];
    const {
      character: hzInput,
      pinyin: pyInput,
      tone: sdInput
    } = inputs[index]
    if (hzInput){
      if (type) {
        if (items[0][3] !== hzInput) return false;
      }
      else if (item[3] !== hzInput) return false;
    }

    if (pyInput) {
      const pys = parsePy(pyInput).slice(0, 2)
      if (type) {
        if (items.every((item) => {
          if (pys[0] && pys[0] !== item[0]) return true;
          if (pys[1] && pys[1] !== item[1]) return true;
        })) return false
      }
      else {
        if (pys[0] && pys[0] !== item[0]) return false;
        if (pys[1] && pys[1] !== item[1]) return false;
      }
    }
    else if (filters[index]) {
      const sm = filters[index].shengmu;
      const ym = filters[index].yunmu;
      if (type) {
        if (items.every((item) => {
          if (sm[item[0]] === false) return true;
          if (ym[item[1]] === false) return true;
        })) return false
      }
      else {
        if (sm[item[0]] === false) return false;
        if (ym[item[1]] === false) return false;
      }
    }

    if (sdInput){
      if (type) {
        if (items.every((i) => i[2] !== sdInput)) {
          return false;
        }
      }
      else if (item[2] !== sdInput) return false;
    }
    else if (filters[index]) {
      const sd = filters[index].tone;
      if (type) {
        if (items.every((item) => {
          if (sd.length && !sd[item[2]]) return true;
        })) return false
      }
      else if (sd.length && !sd[item[2]]) return false;
    }
  }
  return true
}
const existFilter = (data, type = 0) => {
  if (!globalExistFilter(data, type)) return false;
  return singleExistFilter(data, type);
}
const globalExistFilter = (data, type = 0) => {
  const { sm, ym, sd } = setData(data, type + 1 )
  const { shengmu, yunmu, tone } = globalExists;
  if (tone.length && !tone.every((item) => sd.has(item))) return false;
  if (shengmu.length && !shengmu.every((item) => sm.has(item))) return false;
  return !(yunmu.length && !yunmu.every((item) => ym.has(item)));
}
const singleExistFilter = (data, type = 0) => {
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    const { sm, ym, sd } = setData(item, type)
    const { shengmu, yunmu, tone } = exists[index];
    if (tone.length && !tone.every((item) => sd.has(item))) return false;
    if (shengmu.length && !shengmu.every((item) => sm.has(item))) return false;
    if (yunmu.length && !yunmu.every((item) => ym.has(item))) return false;
  }
  return true;
}
const setData = (data, deep = 0) => {
  const dataSet = {
    // cy: data,
    sm: new Set(),
    ym: new Set(),
    sd: new Set(),
  }
  if (deep == 2) {
    data.forEach((item) => {
      item.forEach((i) => {
        dataSet.sm.add(i[0])
        dataSet.ym.add(i[1])
        dataSet.sd.add(i[2])
      })
    })
  }
  else if (deep == 1) {
    data.forEach((item) => {
      dataSet.sm.add(item[0])
      dataSet.ym.add(item[1])
      dataSet.sd.add(item[2])
    })
  }
  else {
    dataSet.sm.add(data[0])
    dataSet.ym.add(data[1])
    dataSet.sd.add(data[2])
  }
  return dataSet;
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
const exists = reactive([
  { tone: [], shengmu: [], yunmu: [] },
  { tone: [], shengmu: [], yunmu: [] },
  { tone: [], shengmu: [], yunmu: [] },
  { tone: [], shengmu: [], yunmu: [] },
])
const globalFilters = reactive({
  tone: [],
  shengmu: {},
  yunmu: {}
})
const globalExists = reactive({
  tone: [],
  shengmu: [],
  yunmu: [],
})
const updateInput = (index, data) => {
  inputs[index] = data;
}
const updateFilter = (index, data) => {
  filters[index] = data;
}
const updateExist = (index, data, type) => {
  if (data) exists[index][type] = [...data]
}
const updateGlobal = (val, type) => {
  Object.assign(globalFilters[type], val[type])
}
const updateGlobalExist = (val, type) => {
  if (val) globalExists[type] = [...val]
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
