<template>
  <div class="tone-filter">
    <el-space>
      <span
          v-for="(label, index) in toneLabels"
          :key="index"
          :class="[
          'tone-item',
          isDisabled(index) ? 'disabled' : activeTones[index] ? 'active' : 'inactive'
        ]"
          @click="toggleTone(index)"
      >
        {{ label }}
      </span>
      <el-button @click="reset">重置</el-button>
    </el-space>
  </div>
</template>

<script setup>
import { reactive, watch, toRefs, onMounted } from 'vue'

// Props & Emits
const props = defineProps({
  globalConfig: {
    type: Array,
    default: () => [true, true, true, true, true], // 默认全启用：轻声, 一声, 二声, 三声, 四声
  },
  isExist: {
    type: Boolean,
    default: false,
  }
})
const emit = defineEmits(['update'])

// 声调标签
const toneLabels = ['轻声', '一声', '二声', '三声', '四声']

// 本地状态（默认启用）
const state = reactive({
  activeTones: [],
})
const reset = () => {
  if (!props.isExist) {
    state.activeTones.forEach((_val, index)=>{
      if (isDisabled(index)) return;
      state.activeTones[index] = true;
    })
  }
  else state.activeTones = [false, false, false, false, false];
  emit('update', [...state.activeTones])
}
const { activeTones } = toRefs(state)

// 判断是否被全局禁用
const isDisabled = (index) => props.globalConfig[index] === false

// 点击切换
const toggleTone = (index) => {
  if (isDisabled(index)) return
  state.activeTones[index] = !state.activeTones[index]
  emit('update', [...state.activeTones])
}

// 覆盖本地状态（初始化/变更）
watch(
    () => props.globalConfig,
    (newVal) => {
      if (newVal.length > 0) {
        newVal.forEach((val, i) => {
          if (val === false) state.activeTones[i] = false
        })
        emit('update', [...state.activeTones])
      }
    },
    { immediate: true, deep: true }
)
onMounted(() => {
  if (props.isExist) state.activeTones = [false, false, false, false, false];
  else state.activeTones = [true, true, true, true, true];
})
</script>

<style scoped>
.tone-item {
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  border-radius: 6px;
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