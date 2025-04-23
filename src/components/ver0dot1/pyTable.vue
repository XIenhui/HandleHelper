<script setup>
  import {computed} from 'vue'

  const props = defineProps({
    show: Boolean
  })
  const emits = defineEmits(['close'])
  const showAni = computed(()=>{
    return props.show ? "" : "transform: translateY(-100%);"
  })

  const shengmu = []
  const yunmu = []

  const setContain = ()=>{

  }
  const setNoContain = ()=>{

  }
  const close = ()=>{
    emits("close")
  }
</script>

<template>
  <div class="bg-base border-base absolute transition-all duration-200 ease-out max-w-screen max-h-screen overflow-auto scrolls top-0 left-0 right-0 border-b"
       :style="showAni">
    <div p8="" pt4="" flex="~ col center" relative="">
      <div absolute="" top-4="" right-4="" flex="~ gap-3">
        <button icon-btn="" @click="close"><div i-carbon-close=""></div></button>
      </div>
      <p text-xl="" font-serif="" mb8=""><b>拼音速查表</b></p>
      <div grid="~ cols-[1fr_3fr] gap-x-10 gap-y-4" font-mono="" font-light="">
        <div text-center="">声母</div><div text-center="">韵母</div>
        <div grid="~ cols-2 gap-3" h-min="">
          <div v-for="item in shengmu" @click="setNoContain">{{ item }}</div>
          <div class="">b</div><div class="">p</div><div class="">m</div>
          <div class="">f</div><div class="">d</div><div class="">t</div><div class="">n</div>
          <div class="">l</div><div class="">g</div><div class="">k</div><div class="">h</div>
          <div class="">j</div><div class="">q</div><div class="">r</div><div class="">x</div>
          <div class="">w</div><div class="">y</div><div class="">zh</div><div class="">ch</div>
          <div class="">sh</div><div class="">z</div><div class="">c</div><div class="">s</div>
        </div>
        <div grid="~ cols-3 gap-3" h-min="">
          <div class="">a</div><div class="">ai</div><div class="">an</div><div class="">ang</div>
          <div class="">ao</div><div class="">e</div><div class="">ei</div><div class="">en</div>
          <div class="">eng</div><div class="">er</div><div class="">i</div><div class="">ia</div>
          <div class="">ian</div><div class="">iang</div><div class="">iao</div><div class="">ie</div>
          <div class="">in</div><div class="">ing</div><div class="">io</div><div class="">iong</div>
          <div class="">iu</div><div class="">o</div><div class="">ong</div><div class="">ou</div>
          <div class="text-ok">u</div><div class="">ua</div><div class="">uai</div><div class="">uan</div>
          <div class="">uang</div><div class="">ui</div><div class="">un</div><div class="">uo</div>
          <div class="">ü</div><div class="">üan</div><div class="">üe</div><div class="">ün</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>