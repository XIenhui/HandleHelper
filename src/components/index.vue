<template>
  <el-container class="window">
    <el-header class="header"></el-header>
    <el-aside></el-aside>
    <el-main class="main" :style="curStyle">
      <el-scrollbar :height="height">
<!--        <component :is="curVersion"></component>-->
        <div class="queryInput" v-if="version === '0.1'">
          <div class="queryItem" v-for="(item, index) in query"  :key="item">
            <el-button text circle @click="deleteQuery(index)" class="deleteBtn">
              <el-icon><delete></delete></el-icon>
            </el-button>
            <hanzi-query :has-label="index === 0" v-model="item.value"
                         :index = index
                         @type-change="setQuery"
                         @logic-change="setQuery"
                         @position-change="setQuery"></hanzi-query>
          </div>
        </div>
        <div class="queryInput" v-if="version === '0.2'">
          <Ver0d2 @update="" style="margin-bottom: 20px"></Ver0d2>
        </div>
      </el-scrollbar>
      <div class="buttonArea">
        <div>
          <el-button type="primary" @click="addQuery">{{`添加条件`}}</el-button>
          <el-button @click="showTable">{{`拼音表筛选`}}</el-button>
          <el-button type="danger" @click="deleteQuery(-1)">{{`清空条件`}}</el-button>
          <el-button type="primary" plain @click="search">{{`查询`}}</el-button>
          <el-button type="primary" plain @click="guess">{{`猜成语`}}</el-button>
          <span class="resultText"><el-text>{{ curNum >= 0 ? `符合条件的成语数量为${curNum}` : ''  }}</el-text></span>
        </div>
        <el-button type="primary" plain @click="getResult">{{`查看结果`}}</el-button>
      </div>
      <div class="changeVersion">
        <span>切换新版</span>
        <el-switch v-model="isNewVer" @change="versionChange"></el-switch>
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
import HanziQuery from "@/components/ver0dot1/hanziQuery.vue";
import {ref, computed, onMounted} from 'vue'
import {Delete, Soccer} from "@element-plus/icons-vue";
import { ElMessage as _message } from "element-plus";
import { ElMessageBox as _messageBox} from "element-plus";
import PyTable from "@/components/ver0dot1/pyTable.vue";
import { P } from "@/data/data.js"
import { hanziToPinyin, pinyinToHanzi, idiomPinyinIndex } from "@/data/dataHelper.js";
import {convertPinyin} from "@/data/dataHelper.js";
import Ver0d2 from "@/components/ver0dot2/index.vue"
const isNewVer = ref(false);
const version = ref('0.1');
const curStyle = ref({
  width: '800px'
})
const versionChange = () =>  {
  version.value = isNewVer.value ? '0.2' : '0.1';
  if (version.value === '0.2') {
    curStyle.value.width = '1200px'
    height.value = 800;
  }
  else {
    curStyle.value.width = '800px'
    height.value = 500;
  }
}
const data = ref({
  data0: [],
  data1: [],
  data2: [],
})
onMounted(()=>{
  initData()
  addQuery()
})
const initData = ()=>{
  data.value.data0 = [...Object.entries(P)]
  data.value.data1 = [...idiomPinyinIndex]
}
const height = ref(500);
const query = ref([])
const addQuery = ()=>{
  query.value.push({
    type: 'hz',
    logic: 'contain',
    position: 0,
    value: ''
  })
}
const deleteQuery = (index)=>{
  if(index === -1 ) {
    query.value = []
    addQuery()
  }
  else if(query.value.length > 1) query.value.splice(index,1)
  else {
    _message.warning('至少需要一个条件')
  }
}

const isTableShow = ref(false)
const showTable = ()=>{
  isTableShow.value = !isTableShow.value
}
const closeTable = ()=> {
  isTableShow.value = false
}

const deleteBtnClass = computed((index)=>{
  return index === 1 ? 'deleteBtn1' : 'deleteBtn2'
})

const search = ()=>{
  results.value = []
  // console.log(Object.entries(data.value))
  for (const [name, cy] of Object.entries(data.value)){
    let res = cy
    singleTest.value = true
    if(name === 'data0'){
      query.value.forEach(item => {
        if(item.type === 'sp' || item.type === 'zy') {
          _message.error('暂不支持该类型查询')
          return
        }
        // console.log('item',item)
        if(item.type === 'py') res = pyFilter(res, item)
        if(item.type === 'hz') res = hzFilter(res, item)
      })
      res = res.map(([hz, py]) => [hz])
    }
    else if(name === 'data1'){
      query.value.forEach(item => {
        // console.log('item',item)
        if(item.type === 'py') res = pyFilter(res, item, 1)
        if(item.type === 'hz') res = hzFilter(res, item)
      })
    }
    // console.log('res',res)
    results.value.push(res)
  }
}
const searchByPy = (py) => {
  return pinyinToHanzi.get(py) || [];
}
const singleTest = ref(true)
const pyFilter = (cy, data, type = 0)=>{
  if(type !== 0){
    return cy.filter(item => {
      const pinyinArr = item[1].map(item => {
        return item[0].split(',').map(singlePy =>
            parsePy(convertPinyin(singlePy.replace('ü','v')))
        )
      })
      // if(singleTest.value){
      //   singleTest.value = false
      //   console.log('item1',item[1])
      //   console.log('pinyinArrTest', pinyinArr)
      // }
      return pyLogicMatch(pinyinArr, data, 1)
    })
  }
  return cy.filter(item => {
    const pinyinStr = item[1]
    const pinyinArr = pinyinStr.split(' ').map(parsePy);
    return pyLogicMatch(pinyinArr, data)
  })
}
const pyLogicMatch = (tar = [], data = {
  logic: '',
  position: '',
  value: ''}, type = 0) =>
{
  const logic = data.logic
  const position = data.position
  const value = data.value.split(',')
  if(type === 0){
    if(logic === 'contain'){
      const res = tar.findIndex(item => {
        return pySingleCheck(item, value)
      })
      return res >= 0
    }
    else if(logic === 'no-contain'){
      const res = tar.findIndex(item => {
        return pySingleCheck(item, value)
      })
      return res < 0
    }
    else if(logic === 'equal'){
      const item = tar[position-1]
      // console.log('item',item)
      // console.log('value',value)
      // if(singleTest.value){
      //   singleTest.value = false
      //   console.log('Array.from(item)', Array.from(item))
      //   console.log('item', item)
      // }
      return pySingleCheck(item, value)
    }
    else if(logic === 'no-equal'){
      const item = tar[position-1]
      return !pySingleCheck(item, value)
    }
  }
  else {
    if(logic === 'contain'){
      const res = tar.findIndex(item => {
        return Array.from(item).some(single => pySingleCheck(single, value))
      })
      return res >= 0
    }
    else if(logic === 'no-contain'){
      const res = tar.findIndex(item => {
        return Array.from(item).some(single => pySingleCheck(single, value))
      })
      return res < 0
    }
    else if(logic === 'equal'){
      const item = tar[position-1]
      // console.log('item',item)
      // console.log('value',value)
      // if(singleTest.value){
      //   singleTest.value = false
      //   console.log('Array.from(item)', Array.from(item))
      //   console.log('item', item)
      // }
      return Array.from(item).some(single => pySingleCheck(single, value))
    }
    else if(logic === 'no-equal'){
      const item = tar[position-1]
      return !Array.from(item).some(single => pySingleCheck(single, value))
    }
  }
}

const pySingleCheck = (tar, value)=>{
  return (!value[0] || tar.initial === value[0])
      && (!value[1] || tar.final === value[1])
      && (!value[2] || tar.tone.toString() === value[2])
}
const hzFilter = (cy, data)=>{
  return cy.filter(item => {
    const hanziStr = item[0]
    const hanziArr = Array.from(hanziStr);
    return hzLogicMatch(hanziArr, data)
  })
}
const hzLogicMatch = (tar, data = {
  logic: '',
  position: '',
  value: ''
})=>{
  const logic = data.logic
  const position = data.position
  const value = data.value
  if(!value) return true
  if(logic === 'contain'){
    return tar.includes(value)
  }
  else if(logic === 'no-contain'){
    return !tar.includes(value)
  }
  else if(logic === 'equal'){
    return tar[position-1] === value
  }
  else if(logic === 'no-equal'){
    return tar[position-1] !== value
  }
}
const parsePy = (pinyin)=>{
  const tone = pinyin.match(/[1-4]$/)?.[0] || '0';
  const base = pinyin.replace(tone, '');

  // 分离声母和韵母（支持零声母）
  let initial = '';
  let final = base;
  const initials = ['b','p','m','f','d','t','n','l','g','k','h','j','q','x','zh','ch','sh','r','z','c','s','y','w'];
  for (let i = Math.min(2, base.length); i > 0; i--) {
    const part = base.slice(0, i);
    if (initials.includes(part)) {
      initial = part;
      final = base.slice(i);
      break;
    }
  }

  return { initial, final, tone: parseInt(tone) || 0 };
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

const setQuery = (data,type,index) => {
  query.value[index][type] = data
}
const isShowResult = ref(false)

const guess = ()=>{
  _message.error('兜能不足')
}

</script>
<style scoped>
.charHasCheck {
  overflow-x: hidden;
}
.main {
  margin: 0 auto;
  box-shadow: 0 3px 12px rgba(0, 0, 0, .07), 0 1px 4px rgba(0, 0, 0, .07);;
  border-radius: 8px;
}
.queryItem {
  display: flex;
  align-items: center;
  text-align: center;
}
.queryItem:first-child .deleteBtn{
  top: 6px;
}
.deleteBtn {
  position: relative;
  bottom: 10px;
}
.buttonArea {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
}
.resultText {
  margin: 0 12px;
}
.dialog {
  padding: 20px;
}
.changeVersion {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
}
</style>