<template>
  <div class="user-info">
    <el-card class="avatar-card">
      <div class="avatar-container">
        <el-avatar 
          :size="100" 
          :src="userInfo.avatarUrl || defaultAvatar"
        />
        <div class="avatar-actions">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
          >
            <el-button type="primary" :loading="updating">
              {{ updating ? '上传中...' : '更换头像' }}
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 jpg/png 文件，且不超过10MB
              </div>
            </template>
          </el-upload>
        </div>
      </div>
    </el-card>

    <!-- 原有的统计卡片 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>做题统计</span>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="stat-box easy">
            <h3>简单</h3>
            <div class="stat-number">
              <span class="solved">{{ statistics.solvedEasyCount }}</span>
              <span class="total">/{{ statistics.totalEasyCount }}</span>
            </div>
            <el-progress 
              :percentage="getPercentage(statistics.solvedEasyCount, statistics.totalEasyCount)"
              status="success"
            />
          </div>
        </el-col>
        
        <el-col :span="8">
          <div class="stat-box medium">
            <h3>中等</h3>
            <div class="stat-number">
              <span class="solved">{{ statistics.solvedMediumCount }}</span>
              <span class="total">/{{ statistics.totalMediumCount }}</span>
            </div>
            <el-progress 
              :percentage="getPercentage(statistics.solvedMediumCount, statistics.totalMediumCount)"
              status="warning"
            />
          </div>
        </el-col>
        
        <el-col :span="8">
          <div class="stat-box hard">
            <h3>困难</h3>
            <div class="stat-number">
              <span class="solved">{{ statistics.solvedHardCount }}</span>
              <span class="total">/{{ statistics.totalHardCount }}</span>
            </div>
            <el-progress 
              :percentage="getPercentage(statistics.solvedHardCount, statistics.totalHardCount)"
              status="exception"
            />
          </div>
        </el-col>
      </el-row>

      <div class="total-stats">
        <h3>总体完成情况</h3>
        <el-progress 
          :percentage="getTotalPercentage()"
          :format="format"
          type="circle"
          :width="120"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSubmissionStatistics } from '../../api/statistics'
import { uploadAvatar } from '../../api/user'
import { ElMessage } from 'element-plus'

// 添加新的响应式变量
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const avatarUrl = ref('')
const updating = ref(false)
const userInfo = ref({})

// 添加更新头像的方法
const handleUpdateAvatar = async () => {
  if (!avatarUrl.value) {
    ElMessage.warning('请输入头像URL')
    return
  }
  
  updating.value = true
  try {
    const res = await updateAvatar(userInfo.value.id, avatarUrl.value)
    if (res.data) {
      ElMessage.success('头像更新成功')
      // 更新本地存储的用户信息
      userInfo.value.avatarUrl = avatarUrl.value
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      // 清空输入框
      avatarUrl.value = ''
    }
  } catch (error) {
    console.error('更新头像失败:', error)
  } finally {
    updating.value = false
  }
}

// 修改原有的 onMounted
onMounted(async () => {
  try {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      userInfo.value = JSON.parse(storedUserInfo)
      const res = await getSubmissionStatistics(userInfo.value.id)
      statistics.value = res.data
    }
  } catch (error) {
    console.error('获取信息失败:', error)
  }
})

const statistics = ref({
  solvedEasyCount: 0,
  solvedMediumCount: 0,
  solvedHardCount: 0,
  totalEasyCount: 0,
  totalMediumCount: 0,
  totalHardCount: 0
})

const getPercentage = (solved, total) => {
  if (!total) return 0
  return Math.round((solved / total) * 100)
}

const getTotalPercentage = () => {
  const totalSolved = statistics.value.solvedEasyCount + 
                     statistics.value.solvedMediumCount + 
                     statistics.value.solvedHardCount
  const total = statistics.value.totalEasyCount + 
                statistics.value.totalMediumCount + 
                statistics.value.totalHardCount
  return getPercentage(totalSolved, total)
}

const format = (percentage) => {
  const totalSolved = statistics.value.solvedEasyCount + 
                     statistics.value.solvedMediumCount + 
                     statistics.value.solvedHardCount
  const total = statistics.value.totalEasyCount + 
                statistics.value.totalMediumCount + 
                statistics.value.totalHardCount
  return `${totalSolved}/${total}`
}

// 上传前校验
const beforeAvatarUpload = (file) => {
  const isJPGOrPNG = ['image/jpeg', 'image/png'].includes(file.type)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isJPGOrPNG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('头像大小不能超过 10MB!')
    return false
  }
  return true
}

// 自定义上传方法
const handleAvatarUpload = async (options) => {
  updating.value = true
  try {
    const res = await uploadAvatar(userInfo.value.id, options.file)
    if (res.code === 200) {
      ElMessage.success('头像更新成功')
      // 更新本地存储的用户信息
      userInfo.value.avatarUrl = res.data
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  } catch (error) {
    console.error('上传头像失败:', error)
    ElMessage.error('上传头像失败')
  } finally {
    updating.value = false
  }
}
</script>

<style scoped>
/* 添加新的样式 */
.avatar-card {
  max-width: 1000px;
  margin: 0 auto 20px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.avatar-actions {
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 500px;
}

.avatar-input {
  flex: 1;
}

.user-info {
  padding: 20px;
}

.info-card {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.stat-box {
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
  text-align: center;
}

.stat-box h3 {
  margin: 0 0 15px;
  color: #606266;
}

.stat-number {
  margin-bottom: 15px;
  font-size: 24px;
}

.solved {
  font-weight: bold;
  color: #409EFF;
}

.total {
  color: #909399;
  font-size: 16px;
}

.total-stats {
  margin-top: 40px;
  text-align: center;
}

.total-stats h3 {
  margin-bottom: 20px;
  color: #606266;
}

.easy :deep(.el-progress-bar__inner) {
  background-color: #67C23A;
}

.medium :deep(.el-progress-bar__inner) {
  background-color: #E6A23C;
}

.hard :deep(.el-progress-bar__inner) {
  background-color: #F56C6C;
}

.avatar-uploader {
  width: 100%;
  text-align: center;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>