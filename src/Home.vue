<template>
  <div class="home-page">
    <header class="hero-section">
      <h1>🎨 Генератор цветовых палитр</h1>
      <p class="subtitle">Создавайте, анализируйте и экспортируйте гармоничные цветовые схемы</p>
      
      <div class="cta-buttons">
        <router-link to="/generator" class="btn btn-primary">
          🚀 Начать генерацию
        </router-link>
        <router-link to="/library" class="btn btn-secondary">
          📚 Моя библиотека
        </router-link>
      </div>
    </header>

    <section class="features-section">
      <h2>Возможности приложения</h2>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🎲</div>
          <h3>Умная генерация</h3>
          <p>Создавайте палитры по типу (аналогичные, комплементарные, монохромные) и настроению</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Анализ доступности</h3>
          <p>Проверяйте контрастность по стандартам WCAG (AA, AAA)</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">💾</div>
          <h3>Библиотека палитр</h3>
          <p>Сохраняйте, редактируйте и организуйте палитры в коллекции</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📤</div>
          <h3>Экспорт</h3>
          <p>Экспортируйте в CSS, SCSS, Tailwind, JSON и другие форматы</p>
        </div>
      </div>
    </section>

    <section class="recent-palettes" v-if="recentPalettes.length">
      <h2>Недавние палитры</h2>
      
      <div class="palettes-grid">
        <div 
          v-for="palette in recentPalettes" 
          :key="palette.id"
          class="palette-preview"
          @click="openPalette(palette.id)"
        >
          <div class="palette-colors">
            <div 
              v-for="color in palette.colors.slice(0, 5)" 
              :key="color"
              class="color-chip"
              :style="{ backgroundColor: color }"
            ></div>
          </div>
          <div class="palette-info">
            <h4>{{ palette.name }}</h4>
            <span class="date">{{ formatDate(palette.createdAt) }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePaletteStorage } from '../composables/usePaletteStorage'

export default {
  name: 'HomePage',
  
  setup() {
    const router = useRouter()
    const { savedPalettes } = usePaletteStorage()
    const recentPalettes = ref([])
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU')
    }
    
    const openPalette = (id) => {
      router.push(`/editor/${id}`)
    }
    
    onMounted(() => {
      recentPalettes.value = savedPalettes.value.slice(0, 6)
    })
    
    return {
      recentPalettes,
      formatDate,
      openPalette
    }
  }
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  margin-bottom: 40px;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-primary {
  background-color: white;
  color: #667eea;
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.features-section {
  margin-bottom: 60px;
}

.features-section h2 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.recent-palettes h2 {
  margin-bottom: 30px;
  color: #333;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.palette-preview {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.palette-preview:hover {
  transform: translateY(-5px);
}

.palette-colors {
  display: flex;
  height: 100px;
}

.color-chip {
  flex: 1;
  height: 100%;
}

.palette-info {
  padding: 20px;
}

.palette-info h4 {
  margin-bottom: 5px;
  color: #333;
}

.date {
  color: #888;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
    text-align: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
