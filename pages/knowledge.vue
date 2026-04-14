<template>
  <div class="knowledge-page">
    <div class="container">
      <AppHeader />
      <AppNavigation />
      
      <div class="section-header">
        <h2>{{ t('knowledge.title') }}</h2>
        <p class="subtitle">{{ t('knowledge.subtitle') }}</p>
      </div>
      
      <!-- Поиск -->
      <div class="search-section">
        <div class="search-wrapper">
          <input 
            type="text" 
            v-model="searchQuery"
            :placeholder="t('knowledge.searchPlaceholder')"
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>
      
      <!-- Категории -->
      <div class="categories-section">
        <div class="categories-filter">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="category-btn"
            :class="{ active: activeCategory === cat.id }"
            @click="activeCategory = cat.id"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span>{{ t(cat.nameKey) }}</span>
          </button>
        </div>
      </div>
      
      <!-- Статьи -->
      <div class="articles-grid">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id"
          class="article-card"
          @click="openArticle(article)"
        >
          <div class="article-image">
            <span>{{ article.icon }}</span>
          </div>
          <div class="article-content">
            <div class="article-category">{{ t(article.categoryKey) }}</div>
            <h3>{{ t(article.titleKey) }}</h3>
            <p>{{ t(article.descKey) }}</p>
            <div class="article-meta">
              <span>📅 {{ formatDate(article.date) }}</span>
              <span>👁️ {{ article.views }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Популярные статьи -->
      <div class="popular-section">
        <h3>{{ t('knowledge.popularArticles') }}</h3>
        <div class="popular-list">
          <div 
            v-for="article in popularArticles" 
            :key="article.id"
            class="popular-item"
            @click="openArticle(article)"
          >
            <div class="popular-icon">{{ article.icon }}</div>
            <div class="popular-info">
              <h4>{{ t(article.titleKey) }}</h4>
              <p>{{ t(article.descKey) }}</p>
            </div>
            <div class="popular-views">
              <span>👁️ {{ article.views }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно статьи -->
    <div class="modal" v-if="selectedArticle" @click="closeArticle">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeArticle">✕</button>
        <div class="modal-header">
          <span class="modal-icon">{{ selectedArticle.icon }}</span>
          <h2>{{ t(selectedArticle.titleKey) }}</h2>
          <div class="modal-category">{{ t(selectedArticle.categoryKey) }}</div>
        </div>
        <div class="modal-body">
          <div v-html="t(selectedArticle.contentKey)"></div>
        </div>
        <div class="modal-footer">
          <span>📅 {{ formatDate(selectedArticle.date) }}</span>
          <span>👁️ {{ selectedArticle.views }} {{ t('knowledge.views') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const searchQuery = ref('')
const activeCategory = ref('all')
const selectedArticle = ref(null)

const categories = [
  { id: 'all', nameKey: 'knowledge.allCategories', icon: '📚' },
  { id: 'traumatology', nameKey: 'tests.traumatology', icon: '🦴' },
  { id: 'cardiology', nameKey: 'tests.cardiology', icon: '❤️' },
  { id: 'rehabilitation', nameKey: 'tests.rehabilitation', icon: '🏋️' },
  { id: 'nutrition', nameKey: 'tests.nutrition', icon: '🥗' }
]

const articles = [
  {
    id: 1,
    titleKey: 'knowledge.article1.title',
    descKey: 'knowledge.article1.desc',
    contentKey: 'knowledge.article1.content',
    categoryKey: 'tests.traumatology',
    category: 'traumatology',
    icon: '🦴',
    date: '2026-01-01',
    views: 1250
  },
  {
    id: 2,
    titleKey: 'knowledge.article2.title',
    descKey: 'knowledge.article2.desc',
    contentKey: 'knowledge.article2.content',
    categoryKey: 'tests.cardiology',
    category: 'cardiology',
    icon: '❤️',
    date: '2026-02-15',
    views: 980
  },
  {
    id: 3,
    titleKey: 'knowledge.article3.title',
    descKey: 'knowledge.article3.desc',
    contentKey: 'knowledge.article3.content',
    categoryKey: 'tests.rehabilitation',
    category: 'rehabilitation',
    icon: '🏋️',
    date: '2026-03-20',
    views: 1560
  },
  {
    id: 4,
    titleKey: 'knowledge.article4.title',
    descKey: 'knowledge.article4.desc',
    contentKey: 'knowledge.article4.content',
    categoryKey: 'tests.nutrition',
    category: 'nutrition',
    icon: '🥗',
    date: '2026-04-05',
    views: 2100
  },
  {
    id: 5,
    titleKey: 'knowledge.article5.title',
    descKey: 'knowledge.article5.desc',
    contentKey: 'knowledge.article5.content',
    categoryKey: 'tests.traumatology',
    category: 'traumatology',
    icon: '🦵',
    date: '2026-05-15',
    views: 750
  }
]

const filteredArticles = computed(() => {
  let filtered = articles
  
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(a => a.category === activeCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(a => 
      t(a.titleKey).toLowerCase().includes(query) ||
      t(a.descKey).toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const popularArticles = computed(() => {
  return [...articles].sort((a, b) => b.views - a.views).slice(0, 3)
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const openArticle = (article) => {
  selectedArticle.value = article
}

const closeArticle = () => {
  selectedArticle.value = null
}

useHead({
  title: locale.value === 'ru' ? 'База знаний - MedSkills' : 'Knowledge Base - MedSkills'
})
</script>

<style scoped>
.knowledge-page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #64748b;
}

/* Поиск */
.search-section {
  margin-bottom: 24px;
}

.search-wrapper {
  position: relative;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 16px 48px 16px 20px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
}

/* Категории */
.categories-section {
  margin-bottom: 32px;
}

.categories-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: none;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-btn:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}

.category-btn.active {
  background: #3b82f6;
  color: white;
}

.cat-icon {
  font-size: 18px;
}

/* Статьи */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.article-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.article-image {
  height: 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
}

.article-content {
  padding: 20px;
}

.article-category {
  display: inline-block;
  padding: 4px 12px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;
}

.article-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.article-content p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #94a3b8;
}

/* Популярные статьи */
.popular-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.popular-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.popular-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popular-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.popular-item:hover {
  background: #eff6ff;
}

.popular-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popular-info {
  flex: 1;
}

.popular-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.popular-info p {
  font-size: 14px;
  color: #64748b;
}

.popular-views {
  font-size: 14px;
  color: #94a3b8;
}

/* Модальное окно */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 700px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.modal-close:hover {
  background: #e2e8f0;
}

.modal-header {
  padding: 32px 32px 24px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.modal-icon {
  font-size: 60px;
  display: block;
  margin-bottom: 16px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.modal-category {
  display: inline-block;
  padding: 4px 16px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.modal-body {
  padding: 32px;
  line-height: 1.8;
  color: #334155;
}

.modal-footer {
  padding: 20px 32px 32px;
  display: flex;
  justify-content: space-between;
  color: #94a3b8;
  font-size: 14px;
  border-top: 1px solid #e2e8f0;
}

/* Стили для контента статьи */
.modal-body :deep(ul),
.modal-body :deep(ol) {
  padding-left: 24px;
  margin: 12px 0;
}

.modal-body :deep(li) {
  margin-bottom: 8px;
  line-height: 1.6;
}

.modal-body :deep(p) {
  margin-bottom: 16px;
  line-height: 1.6;
}

.modal-body :deep(strong) {
  color: #1e293b;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .knowledge-page {
    padding: 12px;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-filter {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }
  
  .popular-item {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-header {
    padding: 24px 20px 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
}
</style>