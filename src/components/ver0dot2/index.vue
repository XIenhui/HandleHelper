<template>
  <div>
    <el-scrollbar height="800px">
      <div class="pinyin-batch-input">
        <div class="input-column">
          <PinyinInputWithTone
              v-for="(_item, index) in inputs"
              :key="index"
              :globalFilterConfig="globalFilters"
              @update="val => updateInput(index, val)"
          />
        </div>
        <div class="filter-area">
          <GlobalFilterConfig @update="val => updateFilters(val)"/>
        </div>
      </div>
    </el-scrollbar>
    <div class="buttonArea">
      <div>
        <el-button type="danger">{{`重置全部`}}</el-button>
        <el-button type="primary" plain>{{`查询`}}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import PinyinInputWithTone from './SingleQuery.vue'
import GlobalFilterConfig from './GlobleQuery.vue'

const emit = defineEmits(['update'])

const inputs = reactive([
  { character: '', pinyin: '', tone: null },
  { character: '', pinyin: '', tone: null },
  { character: '', pinyin: '', tone: null },
  { character: '', pinyin: '', tone: null }
])

const globalFilters = reactive({
  tone: [],
  shengmu: {},
  yunmu: {}
})

const updateInput = (index, val) => {
  inputs[index] = val
  emitCombined()
}

const updateFilters = (val) => {
  Object.assign(globalFilters, val)
  emitCombined()
}

const emitCombined = () => {
  emit('update', {
    inputs: [...inputs],
    globalFilters: { ...globalFilters },
    result: [],
  })
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
