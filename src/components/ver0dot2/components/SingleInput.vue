<template>
  <div class="pinyin-input-with-tone">
    <el-form class="form" :model="form" :rules="rules" ref="formRef" label-position="top" size="small">
      <el-form-item label="汉字" prop="character">
        <el-input
            v-model="form.character"
            maxlength="1"
            clearable
            class="square-input"
            @input="handleCharInput"
        />
      </el-form-item>

      <el-form-item label="拼音" prop="pinyin">
        <div class="pinyin-tone-row">
          <el-input
              v-model="form.pinyin"
              placeholder="拼音"
              clearable
              class="pinyin-input"
              @input="emitChange"
          />
          <el-select v-model="form.tone" clearable placeholder="声调" class="tone-select" @change="emitChange">
            <el-option label="轻声" :value="0" />
            <el-option label="一声" :value="1" />
            <el-option label="二声" :value="2" />
            <el-option label="三声" :value="3" />
            <el-option label="四声" :value="4" />
          </el-select>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update'])

const form = reactive({
  character: '',
  pinyin: '',
  tone: null
})

const formRef = ref(null)

const pinyinPattern = /^[a-zü]{1,6}([a-zü]{1,6})?$/i

const rules = {
  pinyin: [
    {
      validator: (_, val, cb) => {
        if (!pinyinPattern.test(val)) return cb(new Error('拼音格式不正确'))
        cb()
      },
      trigger: 'blur'
    }
  ]
}

const handleCharInput = () => {
  form.character = form.character.slice(0, 1)
  emitChange()
}

const emitChange = () => {
  emit('update', {
    character: form.character,
    pinyin: form.pinyin,
    tone: form.tone
  })
}

const validateForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(`拼音输入正确: ${form.pinyin}, 声调: ${form.tone}`)
    }
  })
}
</script>

<style scoped>
.pinyin-input-with-tone {
  width: 260px;
}
.form {
  display: flex;
  gap: 12px;
  align-items: center;
}
.square-input {
  text-align: center;
  height: 100px;
  width: 100px;
  padding: 0;
  font-size: 40px;
}
:deep(.square-input .el-input__inner) {
  text-align: center;
  padding: 0;
  height: 100%;
  line-height: 100px;
  font-size: inherit;
}
.pinyin-tone-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.pinyin-input {
  flex: 1;
}
.tone-select {
  width: 80px;
}
</style>
