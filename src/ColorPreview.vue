<template>
  <div class="color-preview" :class="theme">
    
    <div class="mockup-container">
      <div class="mockup-header">
        <div class="mockup-nav">
          <div class="mockup-nav-item" 
               v-for="color in mockupColors" 
               :key="color"
               :style="{ color: color }">
            Меню {{ mockupColors.indexOf(color) + 1 }}
          </div>
        </div>
      </div>
      
      <div class="mockup-content">
        <div class="mockup-card"
             :style="{ 
               backgroundColor: mockupColors[1] || '#fff',
               color: mockupColors[4] || '#000'
             }">
          <h4 :style="{ color: mockupColors[0] }">Пример карточки</h4>
          <button class="mockup-button"
                  :style="{ 
                    backgroundColor: mockupColors[0],
                    color: '#fff'
                  }">
            Кнопка действия
          </button>
        </div>
      </div>
    
    <div class="theme-info">
      <p>Текущая тема: {{ theme === 'light' ? 'Светлая' : 'Тёмная' }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ColorPreview',
  props: {
    colors: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  setup(props) {
    const mockupColors = computed(() => {
      return props.colors.slice(0, 5).map(c => c.hex)
    })

    return {
      mockupColors
    }
  }
}
</script>

<style scoped>
.color-preview {
  padding: 1.5rem;
  border-radius: 12px;
  transition: background-color 0.3s, color 0.3s;
}

.color-preview.light {
  background-color: #f8f9fa;
  color: #333;
}

.color-preview.dark {
  background-color: #2d3748;
  color: #f7fafc;
}

.color-preview h3 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.mockup-container {
  background-color: inherit;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mockup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .mockup-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.mockup-logo {
  font-size: 2rem;
}

.mockup-nav {
  display: flex;
  gap: 1.5rem;
}

.mockup-nav-item {
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.mockup-nav-item:hover {
  opacity: 0.8;
}

.mockup-content {
  padding: 2rem;
}

.mockup-card {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mockup-card h4 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.mockup-card p {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.mockup-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.mockup-button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.mockup-footer {
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
}

.dark .mockup-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.theme-info {
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}

.dark .theme-info {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>