<template>
  <div class="global-filter-config">
    <h4>全局过滤设置</h4>
    <ToneFilter
        mode="config"
        @update="val => updateConfig('tone', val)"
    />
    <ShengmuFilter
        mode="config"
        @update="val => updateConfig('shengmu', val)"
    />
    <YunmuFilter
        mode="config"
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
  }
})

const emit = defineEmits(['update'])

const config = reactive({
  tone: [...props.initialConfig.tone],
  shengmu: {...props.initialConfig.shengmu},
  yunmu: {...props.initialConfig.yunmu}
})

const updateConfig = (type, val) => {
  config[type] = val
  emit('update', { ...config })
}
</script>

<style scoped>
.global-filter-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
