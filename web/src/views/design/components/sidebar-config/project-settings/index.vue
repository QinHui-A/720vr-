<script setup lang="ts">
import {useDesignStore} from "@/stores/useDesign.ts";
import {storeToRefs} from "pinia";
import {type FormRules, NForm, NFormItem, NInput} from 'naive-ui'
import {ref} from "vue";

const designStore = useDesignStore()
const { currProjectId, currViewerId, currProjectInfo} = storeToRefs(designStore)

const rules: FormRules = {
  name: {
    required: true,
    message: '请输入项目名称',
    trigger: ['input', 'blur']
  }
}
const form = ref({
  name: '',
  description: ''
})
</script>

<template>
<div v-if="currProjectInfo">
  <n-form
      ref="formRef"
      :label-width="80"
      :rules="rules"
  >
    <n-form-item label="项目名称" required>
      <n-input :maxlength="12" v-model:value="currProjectInfo.name" type="text" placeholder="请输入项目名称"></n-input>
    </n-form-item>
    <n-form-item label="备注">
      <n-input :maxlength="30" v-model:value="currProjectInfo.description" type="textarea" placeholder="请输入备注"></n-input>
    </n-form-item>
  </n-form>
</div>
</template>

<style scoped>

</style>