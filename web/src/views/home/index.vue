<script setup lang="ts">
import {
  NButton,
  NModal,
  NInput,
  NForm,
  NFormItem,
  NPerformantEllipsis,
  useDialog,
  NDialogProvider,
  type FormRules
} from 'naive-ui'
import {useRouter} from 'vue-router'
import {type ProjectType, useProjectStore} from '@/stores/useProject.ts'
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {authToken, uuid} from "../../../utils";
import {API} from "../../../utils/axios.ts";
import {DownloadJSON, GetProjectList} from "@/api/Project.ts";

const dialog = useDialog()
const projectStore = useProjectStore()
const {projectList} = storeToRefs(projectStore)
const router = useRouter()
const outLogin = () => {
  authToken.value = null
  router.replace('/login')
}

const pop = ref({
  show: false,
})
const formRef = ref(null)
const rules: FormRules = {
  name: {
    required: true,
    message: '请输入项目名称',
    trigger: ['input', 'blur']
  }

}
const projectForm = ref(<ProjectType>{
  id: '',
  name: '',
  description: null,
  createTime: null,
  viewerList: []
})
const handleAdd = () => {
  return formRef.value.validate((err) => {
    if (err) {
      window['$message'].warning('请输入项目名称')
      return false
    }
    projectForm.value.id = uuid()
    projectForm.value.createTime = new Date().getTime()
    projectStore.addProject(projectForm.value)
    projectForm.value = {
      id: '',
      name: '',
      description: null,
      createTime: null,
      viewerList: []
    }
  })
}
const handleDelete = (item: ProjectType) => {
  dialog.warning({
    title: '警告',
    content: `确定删除项目：${item.name}？`,
    positiveText: '确定',
    negativeText: '取消',
    draggable: true,
    onPositiveClick: () => {
      projectStore.deleteProject(item.id)
    },
    onNegativeClick: () => {
    }
  })
}
const handleEdit = (id) => {
  router.push({
    path: `/design`,
    query: {
      id
    }
  })
}
const preview = (id) => {
  router.push({
    path: '/preview',
    query: {
      id: id,
    }
  })
}

const download = (id) => {
  window.open(`/api/project/download/${id}`, '_blank')
}

const initData = async () => {
  try {
    await projectStore.getProjectList()
  } catch (e) {
    console.log(e)
  } finally {

  }
}
initData()
</script>

<template>
  <div class="page-min home-page w-screen h-screen">
    <div class="page-bg"></div>
    <div class="page__header flex flex-row justify-between">
      <div class="iconfont-alimama-bold text-4xl">720°全景编辑器</div>
      <div class="cursor-pointer" @click="outLogin">退出登录</div>
    </div>
    <div class="page__banner flex flex-row justify-between items-center">
      <div class="introduction text-[#ffffff] w-200">
        720°全景编辑器，是您轻松创建专业级沉浸式体验的得力助手。无需下载安装，通过浏览器即可快速上手。您只需上传全景图，通过直观的点击与拖拽，便能轻松添加信息提示、场景跳转、多媒体嵌入等丰富交互热点。系统支持多场景无缝链接，构建虚拟漫游空间，并支持一键导出独立项目，实现真正的私有化部署与数据安全。无论是虚拟看房、文旅展示还是线上展厅，都能助您以更低成本、更高效率，打造令人惊叹的VR内容。
      </div>
      <img src="../../assets/image/img.png" width="800" alt="img"/>
    </div>
    <div class="project-box">
      <n-button type="info" size="large" style="width: 200px" @click="pop.show = true">新建项目</n-button>
      <div class="list">
        <div class="item px-5 py-5 flex flex-col" v-for="(item) in projectList" :key="item.id">
          <div class="flex flex-row justify-between items-center">
            <div class="font-bold text-[#2080f0] text-lg">{{ item.name }}</div>
            <div class="grid grid-cols-4 gap-x-[5px]">
              <n-button size="tiny" quaternary type="tertiary" @click="handleDelete(item)">
                删除
              </n-button>
              <n-button size="tiny" quaternary type="info" @click="handleEdit(item.id)">
                编辑
              </n-button>
              <n-button size="tiny" quaternary type="info" @click="download(item.id)">
                导出
              </n-button>
              <n-button size="tiny" quaternary type="info" @click="preview(item.id)">
                预览
              </n-button>
            </div>
          </div>
          <div class="mt-auto">
            <div class="line w-full h-[1px] my-[8px]"></div>
            <n-performant-ellipsis style="max-width: 380px; color: #767c82">
              备注：{{ item.description || '暂无备注' }}
            </n-performant-ellipsis>
          </div>
        </div>
      </div>
    </div>

    <n-modal
        v-model:show="pop.show"
        preset="dialog"
        bordered
        title="新建项目"
        :show-icon="false"
        negative-text="取消"
        positive-text="确认"
        :onPositiveClick="handleAdd"
    >
      <n-form
          class="mt-10"
          ref="formRef"
          :label-width="80"
          :model="projectForm"
          :rules="rules"
      >
        <n-form-item label="项目名称" path="name">
          <n-input :maxlength="12" v-model:value="projectForm.name" placeholder="请输入项目名称"/>
        </n-form-item>
        <n-form-item label="备注" path="description">
          <n-input :maxlength="30" v-model:value="projectForm.description" placeholder="请输入备注"/>
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<style scoped lang="less">

.home-page {
  position: relative;

  .page-bg {
    width: 100%;
    background: linear-gradient(0deg, #ffffff 30%, #2b59ff 70%);
    height: 800px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .page__header {
    height: 100px;
    color: #ffffff;
    padding: 0 120px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .page__banner {
    padding: 0 60px;
    box-sizing: border-box;
    height: 450px;

    .introduction {
      font-size: 16px;
      line-height: 32px;
      text-indent: 32px;
    }
  }

  .project-box {
    padding: 0 60px;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;

    .list {
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 430px));
      gap: 20px;
      box-sizing: border-box;

      .item {
        height: 120px; // 228 233 255
        background: rgba(228, 233, 255, 0.8);
        border-radius: 10px;

        .line {
          background: rgba(215, 215, 215, 0.4);
        }
      }
    }
  }
}
</style>