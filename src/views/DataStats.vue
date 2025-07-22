<template>
  <div class="data-stats-page">
    <div class="stats-header">
      <h2 class="stats-title">数据分析</h2>
      <p class="stats-desc">系统访问统计与活跃板块分布</p>
      <button class="back-button" @click="goBack">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H6m0 0l7 7m-7-7l7-7"/>
        </svg>
        返回首页
      </button>
    </div>
    <div v-if="loading" class="stats-loading">正在加载数据...</div>
    <div v-else-if="error" class="stats-error">{{ error }}</div>
    <div v-else class="stats-content">
      <div class="stats-cards">
        <div class="stats-card">
          <h3>教师访问数</h3>
          <div class="stats-value">{{ stats.totalTeachersVisits }}</div>
        </div>
        <div class="stats-card">
          <h3>学生访问数</h3>
          <div class="stats-value">{{ stats.totalStudentsVisits }}</div>
        </div>
      </div>
      <div class="stats-charts">
        <div class="chart-section">
          <h3>活跃板块分布</h3>
          <div ref="sectionChart" class="chart-box"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { getUsageStatsService } from '@/api/admin.js'

const router = useRouter()
const loading = ref(true)
const error = ref('')
const stats = ref({
  totalTeachersVisits: 0,
  totalStudentsVisits: 0,
  topActiveSections: []
})
const sectionChart = ref(null)

const goBack = () => {
  router.push('/')
}

const renderSectionChart = () => {
  if (!sectionChart.value) return
  const chart = echarts.init(sectionChart.value)
  const data = stats.value.topActiveSections || []
  chart.setOption({
    tooltip: {},
    grid: { left: 40, right: 20, top: 40, bottom: 40 },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: { fontSize: 14 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 14 }
    },
    series: [{
      data: data.map(item => item.count),
      type: 'bar',
      barWidth: 32,
      itemStyle: {
        color: '#3b82f6',
        borderRadius: [8, 8, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 14
      }
    }]
  })
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getUsageStatsService('daily')
    if (res.data && res.data.code === 200) {
      stats.value = res.data.data
      loading.value = false
      setTimeout(renderSectionChart, 100) // 等DOM渲染
    } else {
      error.value = res.data?.msg || '数据获取失败'
      loading.value = false
    }
  } catch (e) {
    error.value = '网络错误或服务器异常'
    loading.value = false
  }
})
</script>

<style scoped>
.data-stats-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(59,130,246,0.08);
}
.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}
.stats-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}
.stats-desc {
  color: #64748b;
  font-size: 1.1rem;
  margin-left: 24px;
  flex: 1;
}
.back-button {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  color: #64748b;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}
.back-button:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
  color: #475569;
  transform: translateX(-2px);
}
.stats-loading, .stats-error {
  text-align: center;
  color: #64748b;
  font-size: 1.2rem;
  margin: 48px 0;
}
.stats-content {
  margin-top: 16px;
}
.stats-cards {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}
.stats-card {
  flex: 1;
  background: #f8fafc;
  border-radius: 16px;
  padding: 32px 0;
  text-align: center;
  box-shadow: 0 2px 8px rgba(59,130,246,0.05);
}
.stats-card h3 {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 12px;
}
.stats-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #3b82f6;
}
.stats-charts {
  margin-top: 16px;
}
.chart-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(59,130,246,0.05);
}
.chart-section h3 {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 16px;
}
.chart-box {
  width: 100%;
  height: 320px;
}
@media (max-width: 900px) {
  .data-stats-page {
    padding: 16px 4px;
  }
  .stats-cards {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
