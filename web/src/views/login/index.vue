<script setup lang="ts">
import SVG from '@/components/svg-waves/index.vue'
import {type FormInst, NButton, NForm, NFormItem, NInput} from 'naive-ui'
import {ref} from "vue";
import {useRouter} from "vue-router";
import {Login, type LoginRequest} from "@/api/Login.ts";
import {authToken, login} from "../../../utils";

const router = useRouter()

const formRef = ref<FormInst | null>(null)
const rules = {
  account: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入账号/手机号'
  },
  password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入密码'
  },
}
const model = ref<LoginRequest>({
  account: null,
  password: null,
})

const handleLogin = () => {
  formRef.value.validate(async (err) => {
    try {
      if (err) {
        window['$message'].warning('请输入账号和密码')
        return
      }
      const res = await Login({...model.value})
      console.log(res, 'res')
      login(res.data)
      window['$message'].success('登录成功')
      await router.push('/')
    } catch (e) {
      console.log(e, 'df')
    } finally {

    }
  })
}

</script>

<template>
<div class="page-min login-page w-screen h-screen">
<!--  <div class="page__header">logo</div>-->
  <div class="page__content flex flex-row justify-between items-center">
    <div class="content__title flex flex-col items-end">
      <div class="title iconfont-alimama-bold">720°全景编辑器</div>
      <div class="name">—— 函23级重庆计算机科学与技术升本校本部 秦予玥</div>
    </div>
    <div class="login-box px-10 py-10 flex flex-col justify-center items-center">
      <div class="title text-center font-bold text-[#208df3]">欢迎使用</div>
      <n-form class="w-full mt-10 mb-10" ref="formRef" :model="model" :rules="rules" size="large">
        <n-form-item path="account" label="账号/手机号">
          <n-input type="text" v-model:value="model.account" @keydown.enter.prevent placeholder="请输入账号/手机号"/>
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input type="password" v-model:value="model.password" @keydown.enter.prevent placeholder="请输入密码"/>
        </n-form-item>
      </n-form>
      <div class="w-full grid place-items-center">
        <n-button @click="handleLogin" size="large" strong round type="info" style="width: 200px">登 录</n-button>
      </div>
    </div>
  </div>
  <SVG></SVG>
</div>
</template>

<style scoped>
.login-page {
  overflow: hidden;
  background: linear-gradient(0deg, #4762e2, #2b59ff);
  .page__header {
    width: 100%;
    height: 0;
    padding-left: 120px;
    padding-right: 120px;
    box-sizing: border-box;
  }
  .page__content {
    margin: 0 auto;
    max-width: 1600px;
    height: calc(100% - 150px);
    padding: 0 120px;
    .content__title {
      margin-right: 120px;
      color: #fff;
      .title {
        font-size: 100px;
        letter-spacing: 2px;
      }
      .name {
        font-size: 16px;
      }
    }
    .login-box {
      background: white;
      border-radius: 20px;
      width: 500px;
      height: 500px;
      //padding: 20px;
      box-sizing: border-box;
      .title {
        font-size: 26px;
        //opacity: 0.8;
        letter-spacing: 2px;
      }
    }
  }

}
</style>