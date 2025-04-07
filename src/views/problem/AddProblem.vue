<template>
  <div class="add-problem">
    <el-card class="problem-form">
      <template #header>
        <div class="card-header">
          <span>添加题目</span>
        </div>
      </template>

      <el-form :model="problemForm" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="题目标题" prop="title">
          <el-input v-model="problemForm.title" placeholder="请输入题目标题" />
        </el-form-item>

        <el-form-item label="题目难度" prop="hardLevel">
          <el-select v-model="problemForm.hardLevel" placeholder="请选择难度">
            <el-option label="简单" value="简单" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
        </el-form-item>

        <el-form-item label="题目标签" prop="problemTags">
          <el-input v-model="problemForm.problemTags" placeholder="请输入标签，用逗号分隔" />
        </el-form-item>

        <el-form-item label="时间复杂度" prop="timeComplexityRequirement">
          <el-input v-model="problemForm.timeComplexityRequirement" placeholder="请输入时间复杂度要求" />
        </el-form-item>

        <el-form-item label="题目描述" prop="problemDescription">
          <md-editor 
            v-model="problemForm.problemDescription"
            height="400px"
            :preview="true"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { addProblem } from '../../api/problem'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const formRef = ref(null)
const submitting = ref(false)

const problemForm = reactive({
  title: '',
  hardLevel: '',
  problemTags: '',
  timeComplexityRequirement: '',
  problemDescription: ''
})

const rules = {
  title: [{ required: true, message: '请输入题目标题', trigger: 'blur' }],
  hardLevel: [{ required: true, message: '请选择题目难度', trigger: 'change' }],
  problemDescription: [{ required: true, message: '请输入题目描述', trigger: 'blur' }]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const res = await addProblem(problemForm)
        if (res.code === 200) {
          ElMessage.success('添加题目成功')
          resetForm()
        }
      } catch (error) {
        console.error('添加题目失败:', error)
      } finally {
        submitting.value = false
      }
    }
  })
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    problemForm.problemDescription = ''
  }
}
</script>

<style scoped>
.add-problem {
  padding: 20px;
}

.problem-form {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

:deep(.v-md-editor) {
  margin-top: 10px;
}
</style>