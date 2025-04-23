<template>
  <div class="final-filter">
    <el-space wrap>
      <span
          v-for="item in finals"
          :key="item"
          :class="[
          'item',
          isDisabled(item) ? 'disabled' : activeMap[item] ? 'active' : 'inactive'
        ]"
          @click="toggle(item)"
      >
        {{ item }}
      </span>
      <el-button @click="reset">重置</el-button>
    </el-space>
  </div>
</template>

<script setup>
import {onMounted, reactive, watch} from 'vue'

const props = defineProps({
  globalConfig: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['update'])

const finals = [
  'a', 'o', 'e', 'i', 'u', 'ü',
  'ai', 'ei', 'ui', 'ao', 'ou', 'iu',
  'ie', 'üe', 'er',
  'an', 'en', 'in', 'un', 'ün',
  'ang', 'eng', 'ing', 'ong',
  'ia', 'ua', 'uo', 'ian', 'uan', 'üan',
  'iang', 'uang', 'iong'
]

const activeMap = reactive({})
const reset = () => {
  Object.keys(activeMap).forEach((key) => {
    if (isDisabled(key)) return
    activeMap[key] = true
  })
}
const isDisabled = (item) => {
  if (!props.globalConfig) return false;
  return (props.globalConfig[item] === false)
}

const toggle = (item) => {
  if (isDisabled(item)) return
  activeMap[item] = !activeMap[item]
  emit('update', { ...activeMap })
}
onMounted(()=>{
  finals.forEach(item => (activeMap[item] = true))
})
watch(
    () => props.globalConfig,
    (list) => {
      if (!list) return;
      Object.keys(list).forEach(key => {
        if (!list[key]) activeMap[key] = false;
      })
      emit('update', { ...activeMap })
    },
    { immediate: true }
)
</script>

<style scoped>
.item {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  user-select: none;
}
.active {
  background-color: #409eff;
  color: white;
}
.inactive {
  background-color: #e0e0e0;
  color: #666;
}
.disabled {
  background-color: #f5f5f5;
  color: #bbb;
  cursor: not-allowed;
}
</style>
