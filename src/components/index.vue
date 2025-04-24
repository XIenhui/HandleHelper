<template>
  <el-container class="window">
    <el-header class="header"></el-header>
    <el-aside></el-aside>
    <el-main class="main" :style="curStyle">
      <div class="queryInput">
        <component :is="curVersion" @update="setResult" @reset="reset"></component>
      </div>
      <div class="globalHandle">
        <div class="resultHandle">
          <span class="resultText"><el-text>{{ number >= 0 ? `符合条件的成语数量为${number}` : ''  }}</el-text></span>
          <el-button type="primary" plain @click="getResult">{{`查看结果`}}</el-button>
        </div>
        <div class="functions">
          <el-button type="primary" plain @click="guess">{{`猜成语`}}</el-button>
          <version-selector :version="version" @update="setNewVersion"></version-selector>
        </div>
      </div>
    </el-main>
    <result-pop v-model="isShowResult" :chunks="chunks"></result-pop>
  </el-container>
</template>
<script setup>
import {ref, onMounted, shallowRef, nextTick} from 'vue'
import { ElMessage as _message } from "element-plus";
import { ElMessageBox as _messageBox} from "element-plus";
import VersionSelector from "@/components/VersionSelector.vue";
import { versions } from "@/data/versions.js";
import ResultPop from "@/components/ResultPop.vue";
const version = ref();
const curVersion = shallowRef();
const number = ref();
const chunks = ref([]);
const isShowResult = ref(false)
const curStyle = ref({
  width: '800px'
})
const setNewVersion = (ver) =>  {
  version.value = ver.name;
  curStyle.value = ver.style;
  curVersion.value = ver.component;
}
const setResult = (result) => {
  chunks.value = result.data;
  number.value = result.num;
}
const reset = () => {
  const buffer = curVersion.value;
  curVersion.value = null;
  nextTick(() => {
    curVersion.value = buffer;
  })
}
const getResult = ()=>{
  if(number.value >= 1000){
    _messageBox.confirm(
        '当前条目较多，是否确认查看',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
        .then(() => {
          isShowResult.value = true
        })
        .catch(() => {})
  }
  else isShowResult.value = true
}
const guess = ()=>{
  _message.error('兜能不足')
}
onMounted(() => {
  version.value = versions[0].name;
  curVersion.value = versions[0].component;
})
</script>
<style scoped>
.main {
  margin: 0 auto;
  box-shadow: 0 3px 12px rgba(0, 0, 0, .07), 0 1px 4px rgba(0, 0, 0, .07);;
  border-radius: 8px;
}
.queryInput {
  padding-bottom: 12px;
}
.resultText {
  margin: 0 12px;
}
.globalHandle {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.resultHandle {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
}
.functions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>