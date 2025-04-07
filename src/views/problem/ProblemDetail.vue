<template>
  <div class="problem-detail">
    <el-row :gutter="20" class="full-height">
      <!-- 左侧题目描述 -->
      <el-col :span="12" class="description-panel">
        <el-card class="full-height">
          <template #header>
            <div class="problem-header">
              <h2>{{ problem.title }}</h2>
              <el-tag :type="getDifficultyType(problem.hardLevel)">
                {{ problem.hardLevel }}
              </el-tag>
            </div>
          </template>
          <div class="markdown-body">
            <MdPreview :modelValue="problem.problemDescription" />
          </div>
        </el-card>
      </el-col>

      <!-- 右侧代码编辑器 -->
      <el-col :span="12" class="code-panel">
        <el-card class="full-height">
          <template #header>
            <div class="code-header">
              <el-select v-model="language" placeholder="选择编程语言" style="width: 120px">
                <el-option label="Python" value="python" />
                <el-option label="Java" value="java" />
                <el-option label="C++" value="cpp" />
              </el-select>
              <el-button 
                type="primary" 
                @click="handleSubmit"
                :loading="submitting"
              >
                提交代码
              </el-button>
            </div>
          </template>
          
          <div class="editor-container">
            <Codemirror
              v-model="code"
              :style="{ height: '100%' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="extensions"
            />
          </div>

          <!-- 提交结果弹窗 -->
          <el-dialog
            v-model="showResult"
            title="提交结果"
            width="30%"
            :close-on-click-modal="false"
          >
            <div class="result-content">
              <el-result
                :icon="resultIcon"
                :title="resultTitle"
                :sub-title="submitResult.evaluate"
              >
                <template #extra>
                  <div class="score-info">
                    得分：{{ submitResult.score }}
                  </div>
                </template>
              </el-result>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="showResult = false">关闭</el-button>
              </span>
            </template>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { python } from '@codemirror/lang-python'
import { cpp } from '@codemirror/lang-cpp'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { useRoute } from 'vue-router'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { submitCode } from '../../api/submission'
import { ElMessage } from 'element-plus'
import { getProblemDetail } from '../../api/problem'

const route = useRoute()
const language = ref('python')
const code = ref('')
const submitting = ref(false)
const showResult = ref(false)
const problem = ref({})
const submitResult = ref({})

// 获取题目信息
const fetchProblemDetail = async () => {
  try {
    const res = await getProblemDetail(route.params.id)
    if (res.code === 200) {
      problem.value = res.data
    } else {
      ElMessage.error('获取题目详情失败')
    }
  } catch (error) {
    console.error('获取题目详情失败:', error)
    ElMessage.error('获取题目详情失败')
  }
}

const handleSubmit = async () => {
  if (!code.value.trim()) {
    ElMessage.warning('请输入代码')
    return
  }

  submitting.value = true
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const res = await submitCode({
      code: code.value,
      problemId: Number(route.params.id),
      type: language.value,
      userId: userInfo.id
    })
    
    submitResult.value = res.data
    showResult.value = true
  } catch (error) {
    console.error('提交代码失败:', error)
  } finally {
    submitting.value = false
  }
}

const resultIcon = computed(() => {
  return submitResult.value.score === 100 ? 'success' : 'warning'
})

const resultTitle = computed(() => {
  return submitResult.value.score === 100 ? '通过' : '未通过'
})

const getDifficultyType = (difficulty) => {
  const types = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return types[difficulty] || 'info'
}

onMounted(() => {
  fetchProblemDetail()
})

const extensions = computed(() => {
  const langExtension = {
    'python': python(),
    'cpp': cpp(),
    'java': javascript()
  }[language.value] || python()
  
  return [
    langExtension,
    oneDark
  ]
})
</script>

<style scoped>
.problem-detail {
  height: calc(100vh - 60px);
  padding: 20px;
}

.full-height {
  height: 100%;
}

.description-panel, .code-panel {
  height: 100%;
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-container {
  height: calc(100% - 20px);
}

.markdown-body {
  padding: 0 10px;
  overflow-y: auto;
  height: calc(100% - 20px);
}

.result-content {
  text-align: center;
}

.score-info {
  font-size: 18px;
  color: #409EFF;
  margin-top: 10px;
}

:deep(.el-card__body) {
  height: calc(100% - 60px);
  padding: 10px;
}
</style>