<template>
  <main :style="cssStr">
    Asen's Lab
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getVariationSettingsCSS, mouseManager } from './mouse';

const cssStr = ref('');

onMounted(() => {
  window.addEventListener('mousemove', (event) => {
    mouseManager(event);
    cssStr.value = getVariationSettingsCSS();
  });
}); 
</script>

<style scoped>
@font-face {
  font-family: 'RobotoFlex';
  src: url(/fonts/RobotoFlex.ttf);
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'RobotoFlex';
  font-size: 48px;
  font-variation-settings: "wght" 400, "wdth" 100, "opsz" 48, "slnt" -10;
}
</style>
