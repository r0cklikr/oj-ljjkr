<template>
  <el-container class="layout-container">
    <el-header>
      <div class="header-left">
        <h2 class="logo">在线判题系统</h2>
        <el-menu
          mode="horizontal"
          :router="true"
          class="header-menu"
        >
          <el-menu-item index="/problem">题目列表</el-menu-item>
          <el-menu-item index="/submission">提交列表</el-menu-item>
          <!-- 添加管理员菜单 -->
          <el-menu-item 
            v-if="isAdmin" 
            index="/problem/add"
          >
            添加题目
          </el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <el-avatar :size="40" :src="userInfo.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userInfo = ref({})

// 判断是否为管理员
const isAdmin = computed(() => {
  return userInfo.value.role === 'admin'
})

onMounted(() => {
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
  }
})

const handleCommand = (command) => {
  if (command === 'userInfo') {
    router.push('/user/info')
  } else if (command === 'logout') {
    localStorage.removeItem('userInfo')
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  margin-right: 40px;
  color: #409EFF;
}

.header-menu {
  border-bottom: none;
}

.header-right {
  cursor: pointer;
}
</style>