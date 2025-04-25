<template>
  <div class="global-filter-config">
    <ToneFilter
        mode="config"
        :is-exist="props.isExist"
        @update="val => updateConfig('tone', val)"
    />
    <ShengmuFilter
        mode="config"
        :is-exist="props.isExist"
        @update="val => updateConfig('shengmu', val)"
    />
    <YunmuFilter
        mode="config"
        :is-exist="props.isExist"
        @update="val => updateConfig('yunmu', val)"
    />
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import ToneFilter from './components/SdFilter.vue'
import ShengmuFilter from './components/SmFilter.vue'
import YunmuFilter from './components/YmFilter.vue'

const props = defineProps({
  initialConfig: {
    type: Object,
    default: () => ({
      tone: [],
      shengmu: {},
      yunmu: {}
    })
  },
  isExist: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['update'])

const config = reactive({
  tone: [...props.initialConfig.tone],
  shengmu: {...props.initialConfig.shengmu},
  yunmu: {...props.initialConfig.yunmu}
})

const updateConfig = (type, val) => {
  config[type] = val;
  if (props.isExist) {
    if (type === 'tone'){
      const data = [];
      config.tone.forEach((item, index) => {
        if (item) data.push(index);
      })
      emit('update', [...data], type)
    }
    else {
      const data = [];
      Object.keys(config[type]).forEach((key) => {
        if (config[type][key]) data.push(key)
      })
      emit('update', [...data], type)
    }
  }
  else emit('update', { ...config }, type)
}
</script>

<style scoped>
.global-filter-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
