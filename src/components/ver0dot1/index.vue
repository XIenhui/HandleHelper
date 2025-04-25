<template>
  <div>
    <el-scrollbar :height="height">
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
    </el-scrollbar>
    <div class="buttonArea">
      <div>
        <el-button type="primary" @click="addQuery">{{`添加条件`}}</el-button>
        <!--      <el-button @click="showTable">{{`拼音表筛选`}}</el-button>-->
        <el-button type="danger" @click="deleteQuery(-1)">{{`清空条件`}}</el-button>
        <el-button type="primary" plain @click="search">{{`查询`}}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import HanziQuery from "@/components/ver0dot1/hanziQuery.vue";
import {Delete} from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import {P} from "@/data/data.js";
import {convertPinyin, idiomPinyinIndex, parsePy, pinyinToHanzi} from "@/data/dataHelper.ts";
import {ElMessage as _message} from "element-plus/es/components/message/index";
const emit = defineEmits(['update'])
const trigger = ref(true);
const logDebounce = (data, time = 500) => {
  if (trigger.value) {
    console.log(data)
    trigger.value = false;
    const timer = setTimeout(() => {
      trigger.value = true;
      clearTimeout(timer);
    }, time)
  }
}
const data = ref({
  data0: [],
  data1: [],
  data2: [],
})
const results = ref([[]])
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
      res = res.map(([hz, _py]) => [hz])
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
  result.value = removeMulti(results.value)
  setChunks(result.value)
  emit('update', {
    data: chunks.value,
    num: result.value.length
  });
}
const chunks = ref([[]])
const result = ref([])

const removeMulti = (data) => {
  const res = new Set
  for (const result of data){
    if (result.length > 0 ) {
      result.forEach(item => {
        res.add(item)
      })
    }
  }
  return [...res]
}
const setChunks = (data) => {
  chunks.value = []
  for (let i = 0; i < data.length; i += 6) {
    chunks.value.push(data.slice(i, i + 6));
  }
}
const setQuery = (data,type,index) => {
  query.value[index][type] = data
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
  logDebounce(tar)
  return (!value[0] || tar[0] === value[0])
      && (!value[1] || tar[1] === value[1])
      && (!value[2] || tar[2] === Number(value[2]))
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


</script>

<style scoped>
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
  margin-top: 12px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
}
</style>