<template>
  <div class="initial-filter">
    <el-space wrap>
      <span
          v-for="item in initials"
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
  },
  isExist: {
    type: Boolean,
    default: false,
  }
})
const emit = defineEmits(['update'])

const initials = [
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l',
  'g', 'k', 'h', 'j', 'q', 'x',
  'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'
]

const activeMap = reactive({})

const reset = () => {
  if (props.isExist) initials.forEach(item => (activeMap[item] = false))
  else {
    Object.keys(activeMap).forEach((key) => {
      if (isDisabled(key)) return
      activeMap[key] = true
    })
  }
  emit('update', { ...activeMap })
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
watch(
    () => props.globalConfig,
    (list) => {
      if (!list) return;
      Object.keys(list).forEach(key => {
        if (list[key] === false) activeMap[key] = false;
      })
      emit('update', { ...activeMap })
    },
    { immediate: true, deep: true }
)
onMounted(()=>{
  if (props.isExist) initials.forEach(item => (activeMap[item] = false))
  else initials.forEach(item => (activeMap[item] = true))
})
</script>

<style scoped>
.item {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  user-select: none;
}
.active {
  background-color: #67c23a;
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
