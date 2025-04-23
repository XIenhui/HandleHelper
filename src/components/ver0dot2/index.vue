<template>
  <div class="pinyin-batch-input">
    <!-- 四个拼音输入区域：纵向排列 -->
    <div class="input-column">
      <PinyinInputWithTone
          v-for="(item, index) in inputs"
          :key="index"
          :globalFilterConfig="globalFilters"
          @update="val => updateInput(index, val)"
      />
    </div>

    <!-- 全局过滤配置：在底部 -->
    <div class="filter-area">
      <GlobalFilterConfig @update="val => updateFilters(val)"/>
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
</style>
