<template>
  <el-container class="window">
    <el-header class="header"></el-header>
    <el-aside></el-aside>
    <el-main class="main" :style="curStyle">
      <div class="queryInput">
        <Ver0d1 v-if="version === versions[0].name"></Ver0d1>
        <Ver0d2 v-if="version === versions[1].name" @update="" style="margin-bottom: 20px"></Ver0d2>
      </div>
      <div class="globalHandle">
        <div class="resultHandle">
          <span class="resultText"><el-text>{{ curNum >= 0 ? `符合条件的成语数量为${curNum}` : ''  }}</el-text></span>
          <el-button type="primary" plain @click="getResult">{{`查看结果`}}</el-button>
        </div>
        <div class="functions">
          <el-button type="primary" plain @click="guess">{{`猜成语`}}</el-button>
          <version-selector :version="'0'" @update="setNewVersion"></version-selector>
        </div>
      </div>
    </el-main>
    <el-dialog v-model="isShowResult" title="查询结果" width="800" class="dialog">
      <el-scrollbar height="500">
        <el-row v-for="chunk in chunks" :key="chunk" :gutter="20">
          <el-col v-for="(item, colIndex) in chunk" :key="colIndex" :span="4">
            <el-text>{{ item[0] }}</el-text>
          </el-col>
        </el-row>
        <el-empty v-if="chunks.length === 0"></el-empty>
      </el-scrollbar>
    </el-dialog>
  </el-container>
</template>
<script setup>
import {ref, computed, onMounted} from 'vue'
import { ElMessage as _message } from "element-plus";
import { ElMessageBox as _messageBox} from "element-plus";
import Ver0d2 from "@/components/ver0dot2/index.vue"
import Ver0d1 from "@/components/ver0dot1/index.vue"
import VersionSelector from "@/components/VersionSelector.vue";
import { versions } from "@/data/versions.js";
const version = ref('0.1');
const curStyle = ref({
  width: '800px'
})
const setNewVersion = (ver) =>  {
  version.value = ver.name;
  curStyle.value = ver.style;
}
const getResult = ()=>{
  if(curNum.value >= 1000){
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

const results = ref([[]])

const combinedResult = computed(()=>{
  const res = new Set
  for (const result of results.value){
    if (result.length > 0 ) {
      result.forEach(item => {
        res.add(item)
      })
    }
  }
  return [...res]
})

const chunks = computed(()=>{
  const chunks = [];
  for (let i = 0; i < combinedResult.value.length; i += 6) {
    chunks.push(combinedResult.value.slice(i, i + 6));
  }
  return chunks;
})


const curNum = computed(()=>{
  return combinedResult.value.length
})


const isShowResult = ref(false)

const guess = ()=>{
  _message.error('兜能不足')
}

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
.dialog {
  padding: 20px;
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