<template>
  <div class="problem-list">
    <!-- 搜索和筛选区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input
            v-model="searchForm.title"
            placeholder="搜索题目"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.hardLevel" placeholder="难度" clearable>
            <el-option label="简单" value="简单" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.tag"
            placeholder="标签"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 题目列表 -->
    <el-table
      v-loading="loading"
      :data="problemList"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="题号" width="80" />
      <el-table-column prop="title" label="题目" min-width="200">
        <template #default="{ row }">
          <router-link :to="`/problem/${row.id}`" class="problem-link">
            {{ row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="hardLevel" label="难度" width="100">
        <template #default="{ row }">
          <el-tag :type="getDifficultyType(row.hardLevel)">
            {{ row.hardLevel }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="problemTags" label="标签" width="200">
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.problemTags?.split(',')"
            :key="tag"
            class="tag-item"
            size="small"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getProblems } from '../../api/problem'  // 修改这里，使用相对路径


const loading = ref(false)
const problemList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  title: '',
  hardLevel: '',
  tag: ''
})

const getDifficultyType = (difficulty) => {
  const types = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return types[difficulty] || 'info'
}

const fetchProblems = async () => {
  loading.value = true
  try {
    const res = await getProblems({
      current: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm
    })
    problemList.value = res.data.records
    total.value = res.data.total
  } catch (error) {
    console.error('获取题目列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchProblems()
}

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchProblems()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchProblems()
}

onMounted(() => {
  fetchProblems()
})
</script>

<style scoped>
.problem-list {
  padding: 20px;
}

.search-area {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-area :deep(.el-form-item) {
  margin-bottom: 18px;
  margin-right: 18px;
}

.search-area :deep(.el-input),
.search-area :deep(.el-select) {
  width: 200px;
}

.problem-link {
  color: #409EFF;
  text-decoration: none;
}

.problem-link:hover {
  color: #66b1ff;
}

.tag-item {
  margin-right: 5px;
  margin-bottom: 5px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-table) {
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-icon {
  font-size: 16px;
  color: #909399;
}
</style>