<script setup>
  import {watch, computed, onMounted} from "vue";
  import {ref} from 'vue'
  const props = defineProps({
    init: {
      type: Object,
      default: {
        type: '',
        logic: '',
        position: '',
        value: '',
      }
    },
    index: Number,
    modelValue: String,
    hasLabel: {
      type: Boolean,
      default: false
    }
  })
  const types = [
    {
      value: 'hz',
      label: '汉字'
    },
    {
      value: 'py',
      label: '拼音'
    },
    {
      value: 'sp',
      label: '双拼'
    },
    {
      value: 'zy',
      label: '注音'
    },
  ]
  const type = ref('hz')

  const logics = [
    {
      value: 'contain',
      label: '包含'
    },
    {
      value: 'no-contain',
      label: '不包含'
    },
    {
      value: 'equal',
      label: '等于'
    },
    {
      value: 'no-equal',
      label: '不等于'
    },
  ]
  const logic = ref('contain')

  const positions = [
    {
      value: 0,
      label: '全部'
    },
    {
      value: 1,
      label: '第一个'
    },
    {
      value: 2,
      label: '第二个'
    },
    {
      value: 3,
      label: '第三个'
    },
    {
      value: 4,
      label: '第四个'
    },
  ]
  const position = ref(0)

  const hzValue = ref('')

  const shengdiao = [
    {
      value: 0,
      label: '轻声'
    },
    {
      value: 1,
      label: '一声'
    },
    {
      value: 2,
      label: '二声'
    },
    {
      value: 3,
      label: '三声'
    },
    {
      value: 4,
      label: '四声'
    },
  ]
  const pyValue = ref(['','', null])
  const emits = defineEmits(['update:modelValue','typeChange','logicChange','positionChange'])

  watch(hzValue,()=>{
    emits('update:modelValue', hzValue.value)
  })
  watch(pyValue,()=>{
    console.log(pyValue.value)
    emits('update:modelValue', pyValue.value.join(','))
  },{deep: true})
  watch(type,()=>{
    emits('typeChange', type.value, 'type', props.index)
  })
  watch(logic,()=>{
    emits('logicChange', logic.value, 'logic', props.index)
  })
  watch(position,()=>{
    emits('positionChange', position.value, 'position', props.index)
  })
  onMounted(() => {
    const { type: typeInit, logic: logicInit, position: positionInit, value: valueInit } = props.init
    console.log({ typeInit, logicInit, positionInit, valueInit })
    if (typeInit) type.value = typeInit;
    if (logicInit) logic.value = logicInit;
    if (positionInit || positionInit === 0) position.value = positionInit;
    if (typeInit === 'hz' && valueInit) hzValue.value = valueInit;
    if (typeInit === 'py' && valueInit) {
      pyValue.value = valueInit;
      pyValue.value[2] = Number((pyValue.value[2]));
    }
  })
</script>

<template>
  <el-form :inline="true" class="singleForm" label-position="top">
    <el-form-item class="typeArea" :label="hasLabel && '类型'">
      <el-select class="select" v-model="type">
        <el-option v-for="item in types"
                   :key="item"
                   :value="item.value"
                   :label="item.label"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="logicArea" :label="hasLabel && '方式'">
      <el-select class="select" v-model="logic">
        <el-option v-for="item in logics"
                   :key="item"
                   :value="item.value"
                   :label="item.label">

        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="positionArea" :label="hasLabel && '位置'">
      <el-select class="select" v-model="position" :disabled="!logic.toString().includes('equal')">
        <el-option v-for="item in positions"
                   :key="item"
                   :value="item.value"
                   :label="item.label">

        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="inputArea" :class="hasLabel && 'labelTop'">
      <template v-if="type === 'hz'">
        <el-input class="hzInput" v-model="hzValue" placeholder="汉字"></el-input>
      </template>
      <template v-if="type === 'py'">
        <el-input class="charInput" v-model="pyValue[0]" placeholder="声母"></el-input>
        <el-input class="charInput" v-model="pyValue[1]" placeholder="韵母"></el-input>
        <el-select class="select2" v-model="pyValue[2]" placeholder="声调" clearable>
          <el-option v-for="item in shengdiao"
                     :key="item"
                     :value="item.value"
                     :label="item.label">
          </el-option>
        </el-select>
      </template>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.singleForm {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: left;
  margin-bottom: 20px;
}
.typeArea {
  margin-bottom: 0;
  margin-right: 12px;
}
.logicArea {
  margin-bottom: 0;
  margin-right: 12px;
}
.positionArea{
  margin-bottom: 0;
  margin-right: 12px;
}
.inputArea {
  margin-bottom: 0;
  margin-right: 12px;
}
.select {
  min-width: 100px;
}
.select2 {
  width: 100px;
}
.labelTop {
  margin-top: 30px;
}
.changeButton {
}
.charArea {

}
.charInput {
  width: 80px;
  margin-right: 20px;
}
.hzInput {
  width: 60px;
}
</style>