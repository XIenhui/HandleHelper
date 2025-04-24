<template>
  <el-dialog title="查询结果" width="800" class="dialog">
    <el-scrollbar height="500">
      <el-row v-for="chunk in chunks" :key="chunk" :gutter="20">
        <el-col v-for="(item, colIndex) in chunk" :key="colIndex" :span="4">
          <el-text>{{ item[0] }}</el-text>
        </el-col>
      </el-row>
      <el-empty v-if="chunks.length === 0"></el-empty>
    </el-scrollbar>
  </el-dialog>
</template>
<script setup>
const props = defineProps({
  chunks: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>

</style>