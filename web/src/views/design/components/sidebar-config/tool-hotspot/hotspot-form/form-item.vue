<script setup lang="ts">

interface Props {
  label: string;
  tip?: string|null;
}

const { label = '标题', tip= null } = defineProps<Props>()

</script>

<template>
  <div class="form-item">
    <div class="form-item__label">{{label}} <span class="form-item__label__tip">{{tip}}</span> </div>
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  width: 100%;
  .form-item__label {
    margin-bottom: 15px;
    font-size: 14px;
    .form-item__label__tip {
      font-size: 12px;
      color: #d9d9d9;
    }
  }
}
:deep(.n-input-number) {
  max-width: 100px;
}
</style>