<template>
  <div class="filter-input-wrapper">
    <!-- 输入部分 -->
    <div class="input-panel">
      <PinyinInputWithTone @update="onInputChange" />
    </div>

    <!-- 过滤器部分 -->
    <div class="filter-panel">
      <ToneFilter :globalConfig="globalFilter.tone" @update="val => updateFilter('tone', val)" />
      <ShengmuFilter :globalConfig="globalFilter.shengmu" @update="val => updateFilter('shengmu', val)" />
      <YunmuFilter :globalConfig="globalFilter.yunmu" @update="val => updateFilter('yunmu', val)" />
    </div>
    <div class="filter-panel">
      <ToneFilter :is-exist="true" :globalConfig="globalFilter.tone" @update="val => updateFilter('tone', val)" />
      <ShengmuFilter :is-exist="true" :globalConfig="globalFilter.shengmu" @update="val => updateFilter('shengmu', val)" />
      <YunmuFilter :is-exist="true" :globalConfig="globalFilter.yunmu" @update="val => updateFilter('yunmu', val)" />
    </div>
  </div>
</template>

<script setup>
import {reactive, ref, watch} from 'vue'
import PinyinInputWithTone from './components/SingleInput.vue'
import ToneFilter from './components/SdFilter.vue'
import ShengmuFilter from './components/SmFilter.vue'
import YunmuFilter from './components/YmFilter.vue'

const props = defineProps({
  globalFilterConfig: {
    type: Object,
    default: () => ({
      tone: [],
      shengmu: {},
      yunmu: {}
    })
  },
})

const emit = defineEmits(['update'])
const globalFilter = ref({
  tone: [],
  shengmu: {},
  yunmu: {}
})
watch(()=>props.globalFilterConfig,
    (val)=>{
      globalFilter.value = {
        tone: val.tone,
        shengmu: val.shengmu,
        yunmu: val.yunmu,
      }
    },
    {deep: true, immediate:true}
)
const state = reactive({
  inputs: {
    character: '',
    pinyin: '',
    tone: null
  },
  filters: {
    tone: [],
    shengmu: {},
    yunmu: {}
  }
})

const onInputChange = (val) => {
  state.inputs = { ...val }
  emitCombined()
}

const updateFilter = (type, val) => {
  state.filters[type] = val
  emitCombined()
}

const emitCombined = () => {
  emit('update', {
    inputs: state.inputs,
    filters: state.filters,
  })
}
</script>

<style scoped>
.filter-input-wrapper {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.input-panel {
  flex-shrink: 0;
}

.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
