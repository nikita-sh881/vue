<template>
  <div class="generator-page">
    <div class="page-header">
      <h1>🎲 Генератор палитр</h1>
      <p>Создавайте гармоничные цветовые схемы</p>
    </div>
    
    <div class="generator-layout">
      <div class="control-panel">
        <div class="section">
          <h3>Базовые настройки</h3>
          
          <div class="form-group">
            <label>Базовый цвет:</label>
            <div class="color-picker-group">
              <input 
                type="color" 
                v-model="baseColor"
                class="color-picker"
              >
              <span class="color-value">{{ baseColor }}</span>
            </div>
            <button @click="pickRandomBaseColor" class="btn-random">
              🎲 Случайный цвет
            </button>
          </div>
          
          <div class="form-group">
            <label>Количество цветов:</label>
            <input 
              type="range" 
              v-model="colorCount"
              min="3"
              max="10"
              class="range-input"
            >
            <span class="value-display">{{ colorCount }}</span>
          </div>
          
          <div class="form-group">
            <label>Тип палитры:</label>
            <select v-model="paletteType" class="select-input">
              <option 
                v-for="type in paletteTypes" 
                :key="type.id"
                :value="type.id"
              >
                {{ type.name }}
              </option>
            </select>
            <p class="type-description">{{ getTypeDescription }}</p>
          </div>
          
          <div class="form-group">
            <label>Настроение:</label>
            <div class="mood-buttons">
              <button 
                v-for="mood in moodTypes"
                :key="mood.id"
                @click="selectMood(mood.id)"
                :class="{ active: selectedMood === mood.id }"
                class="mood-btn"
              >
                {{ mood.name }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h3>Цветовой круг</h3>
          <ColorWheel @color-selected="setBaseColor" />
        </div>
        
        <div class="action-buttons">
          <button @click="generatePalette" class="btn-generate">
            ✨ Сгенерировать палитру
          </button>
          <button @click="savePalette" class="btn-save">
            💾 Сохранить палитру
          </button>
        </div>
      </div>
      
      <!-- Центральная панель: Результат -->
      <div class="result-panel">
        <div v-if="generatedColors.length" class="palette-display">
          <h3>Сгенерированная палитра</h3>
          
          <div class="color-strip">
            <div 
              v-for="(color, index) in generatedColors"
              :key="index"
              class="color-card"
              :style="{ backgroundColor: color }"
              @click="copyToClipboard(color)"
            >
              <div class="color-info">
                <div class="color-value">
                  {{ colorFormat === 'hex' ? color : hexToRgb(color) }}
                </div>
                <div class="color-name">
                  {{ getColorName(color) }}
                </div>
              </div>
              <button 
                @click.stop="togglePinColor(index)"
                class="pin-btn"
                :title="pinnedColors[index] ? 'Открепить' : 'Закрепить'"
              >
                {{ pinnedColors[index] ? '📌' : '📍' }}
              </button>
            </div>
          </div>
          
          <div class="format-toggle">
            <button 
              @click="colorFormat = 'hex'"
              :class="{ active: colorFormat === 'hex' }"
              class="format-btn"
            >
              HEX
            </button>
            <button 
              @click="colorFormat = 'rgb'"
              :class="{ active: colorFormat === 'rgb' }"
              class="format-btn"
            >
              RGB
            </button>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">🎨</div>
          <h3>Палитра не сгенерирована</h3>
          <p>Настройте параметры и нажмите "Сгенерировать палитру"</p>
        </div>

        <AccessibilityPanel 
          v-if="generatedColors.length"
          :colors="generatedColors"
          class="accessibility-section"
        />
      </div>
      
      <div class="preview-panel">
        <h3>Превью</h3>
        <ColorPreview 
          :colors="previewColors"
          :theme="previewTheme"
        />
        
        <div class="preview-controls">
          <button 
            @click="togglePreviewTheme"
            class="theme-toggle"
          >
            {{ previewTheme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема' }}
          </button>
        </div>
        
        <div class="quick-actions">
          <h4>Быстрые действия</h4>
          <button @click="copyAllColors" class="quick-btn">
            📋 Копировать все цвета
          </button>
          <router-link to="/export" class="quick-btn">
            📤 Экспортировать палитру
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ColorWheel from '../ColorWheel.vue'
import ColorPreview from '../ColorPreview.vue'
import AccessibilityPanel from '../AccessibilityPanel.vue'
import { useColorGeneration } from '../useColorGeneration.js'
import { usePaletteStorage } from '../usePaletteStorage.js'

export default {
  name: 'GeneratorPage',
  
  components: {
    ColorWheel,
    ColorPreview,
    AccessibilityPanel
  },
  
  setup() {
    const router = useRouter()

    const { 
      paletteTypes, 
      moodTypes, 
      generatePalette: generatePaletteFunc,
      generateRandomColor,
      getColorName 
    } = useColorGeneration()
    
    const { savePalette: savePaletteToStorage } = usePaletteStorage()
    
    const baseColor = ref('#667eea')
    const colorCount = ref(5)
    const paletteType = ref('analogous')
    const selectedMood = ref(null)
    const colorFormat = ref('hex')
    const previewTheme = ref('light')
    const generatedColors = ref([])
    const pinnedColors = ref([])
    
    const previewColors = computed(() => 
      generatedColors.value.map(color => ({ hex: color }))
    )
    
    const getTypeDescription = computed(() => {
      const type = paletteTypes.find(t => t.id === paletteType.value)
      return type ? type.description : ''
    })
    
    const pickRandomBaseColor = () => {
      baseColor.value = generateRandomColor()
    }
    
    const setBaseColor = (color) => {
      baseColor.value = color
    }
    
    const selectMood = (moodId) => {
      selectedMood.value = selectedMood.value === moodId ? null : moodId
    }
    
    const generatePalette = () => {
      generatedColors.value = generatePaletteFunc(
        baseColor.value,
        paletteType.value,
        colorCount.value,
        selectedMood.value
      )
      pinnedColors.value = new Array(generatedColors.value.length).fill(false)
    }
    
    const togglePinColor = (index) => {
      pinnedColors.value[index] = !pinnedColors.value[index]
    }
    
    const copyToClipboard = async (color) => {
      try {
        const textToCopy = colorFormat.value === 'rgb' ? hexToRgb(color) : color
        await navigator.clipboard.writeText(textToCopy)
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }
    
    const copyAllColors = async () => {
      const colorsText = generatedColors.value.join('\n')
      await navigator.clipboard.writeText(colorsText)
    }
    
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgb(${r}, ${g}, ${b})`
    }
    
    const togglePreviewTheme = () => {
      previewTheme.value = previewTheme.value === 'light' ? 'dark' : 'light'
    }
    
    const savePalette = () => {
      if (generatedColors.value.length === 0) return
      
      const paletteName = prompt('Введите название палитры:', 
        `Палитра ${new Date().toLocaleDateString('ru-RU')}`
      )
      
      if (paletteName) {
        const saved = savePaletteToStorage(generatedColors.value, paletteName)
        router.push(`/editor/${saved.id}`)
      }
    }
    
    onMounted(() => {
      generatePalette()
    })
    
    return {
      baseColor,
      colorCount,
      paletteType,
      selectedMood,
      colorFormat,
      previewTheme,
      generatedColors,
      pinnedColors,
      previewColors,
      
      // Списки
      paletteTypes,
      moodTypes,
      
      // Вычисляемые свойства
      getTypeDescription,
      
      // Методы
      pickRandomBaseColor,
      setBaseColor,
      selectMood,
      generatePalette,
      togglePinColor,
      copyToClipboard,
      copyAllColors,
      hexToRgb,
      togglePreviewTheme,
      savePalette,
      getColorName
    }
  }
}
</script>

<style scoped>
.generator-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.generator-layout {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 30px;
}

.control-panel,
.result-panel,
.preview-panel {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.color-picker-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.color-picker {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.color-value {
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
}

.btn-random {
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-random:hover {
  background-color: #e0e0e0;
}

.range-input {
  width: 100%;
  margin: 10px 0;
}

.value-display {
  display: block;
  text-align: center;
  font-weight: bold;
  color: #667eea;
}

.select-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.type-description {
  margin-top: 5px;
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.mood-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.mood-btn {
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.mood-btn.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
}

.btn-generate,
.btn-save {
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-generate {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-save {
  background-color: #34d399;
  color: white;
}

.btn-generate:hover,
.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.palette-display h3 {
  margin-bottom: 20px;
  color: #333;
}

.color-strip {
  display: flex;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.color-card {
  flex: 1;
  min-height: 180px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-card:hover {
  transform: scale(1.05);
  z-index: 1;
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
}

.color-value {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  margin-bottom: 5px;
}

.color-name {
  font-size: 0.9rem;
  opacity: 0.9;
}

.pin-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.format-toggle {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.format-btn {
  padding: 10px 20px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.format-btn.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin-bottom: 10px;
  color: #333;
}

.accessibility-section {
  margin-top: 30px;
}

.preview-controls {
  margin-top: 20px;
}

.theme-toggle {
  width: 100%;
  padding: 12px;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.quick-actions {
  margin-top: 30px;
}

.quick-actions h4 {
  margin-bottom: 15px;
  color: #333;
}

.quick-btn {
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quick-btn:hover {
  background-color: #e9ecef;
}

@media (max-width: 1200px) {
  .generator-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .color-strip {
    flex-direction: column;
  }
  
  .color-card {
    min-height: 100px;
  }
  
  .mood-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
