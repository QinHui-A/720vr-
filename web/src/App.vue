<script setup lang="ts">
import {
  type GlobalThemeOverrides,
  lightTheme,
  NConfigProvider,
  createDiscreteApi,
  NDialogProvider
} from 'naive-ui'
import { nextTick, onMounted} from "vue";
import {RouterView} from 'vue-router'
const {message} = createDiscreteApi(['message']);

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2080F0',
    primaryColorHover: 'rgba(32,128,240,0.7)',
    primaryColorPressed: 'rgba(32,128,240,0.7)',
  },
  Form: {
    labelTextColor: '#878787',
  }
}

onMounted(() => {
  nextTick(() => {
    window['$message'] = message
  })
})
</script>

<template>
  <n-config-provider :theme="lightTheme" :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <RouterView></RouterView>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
