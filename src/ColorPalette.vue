<template>
  <div class="palette-generator">
    <main class="main-content">
      <div class="controls">
        <button @click="generateRandomPalette" class="generate-button">
          Случайная палитра
        </button>
        
        <div class="control-group">
          <label>Количество цветов:</label>
          <select v-model="colorCount" @change="updatePaletteCount" class="select-input">
            <option value="3">3 цвета</option>
            <option value="5">5 цветов</option>
            <option value="7">7 цветов</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>Формат:</label>
          <div class="format-toggle">
            <button 
              @click="colorFormat = 'hex'"
              :class="{ active: colorFormat === 'hex' }"
              class="format-button"
            >
              HEX
            </button>
            <button 
              @click="colorFormat = 'rgb'"
              :class="{ active: colorFormat === 'rgb' }"
              class="format-button"
            >
              RGB
            </button>
          </div>
        </div>
        
        <div class="control-group">
          <label>Тема:</label>
          <button 
            @click="togglePreviewTheme"
            class="theme-toggle"
          >
            {{ previewTheme === 'light' ? 'Тёмная' : 'Светлая' }}
          </button>
        </div>
      </div>

      <div class="palette-container">
        <h2>Текущая палитра</h2>
        <div v-if="colors.length === 0" class="empty-palette">
        </div>
        
        <div v-else class="color-strip">
          <div 
            v-for="(color, index) in colors" 
            :key="index"
            class="color-card"
            :style="{ backgroundColor: color.hex }"
            @click="copyToClipboard(color)"
            :class="{ pinned: color.pinned }"
          >
            <div class="color-info">
              <div class="color-value">
                {{ formatColorValue(color) }}
              </div>
              <div class="color-actions">
                <button 
                  @click.stop="togglePinColor(index)"
                  class="pin-button"
                  :title="color.pinned ? 'Открепить' : 'Закрепить'"
                >
                </button>
                <div 
                  v-if="color.copied" 
                  class="copied-notification"
                >
                  Скопировано
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="pinnedColors.length > 0" class="pinned-colors-info">
          <p>Закреплено цветов: {{ pinnedColors.length }}</p>
        </div>
      </div>

      <ColorPreview 
        :colors="colors" 
        :theme="previewTheme"
        class="preview-section"
      />
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import ColorPreview from './ColorPreview.vue'

export default {
  name: 'ColorPalette',
  components: {
    ColorPreview
  },
  setup() {
    const colors = ref([])
    const colorCount = ref(5)
    const colorFormat = ref('hex')
    const previewTheme = ref('light')

    const generateRandomHex = () => {
      return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    }

    const generateHarmoniousColors = (baseColor, count) => {
      const colors = [baseColor]

      const baseHsl = hexToHsl(baseColor)

      for (let i = 1; i < count; i++) {

        const hue = (baseHsl.h + (i * 30)) % 360
        const saturation = Math.min(100, baseHsl.s + (Math.random() * 20 - 10))
        const lightness = Math.min(100, baseHsl.l + (Math.random() * 20 - 10))
        
        colors.push(hslToHex(hue, saturation, lightness))
      }
      
      return colors
    }

    const hexToHsl = (hex) => {

      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255
      
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h, s, l = (max + min) / 2
      
      if (max === min) {
        h = s = 0
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        h /= 6
      }
      
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      }
    }

    const hslToHex = (h, s, l) => {
      s /= 100
      l /= 100
      
      const c = (1 - Math.abs(2 * l - 1)) * s
      const x = c * (1 - Math.abs((h / 60) % 2 - 1))
      const m = l - c / 2
      
      let r = 0, g = 0, b = 0
      
      if (0 <= h && h < 60) {
        r = c; g = x; b = 0
      } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0
      } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x
      } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c
      } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c
      } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x
      }
      
      r = Math.round((r + m) * 255)
      g = Math.round((g + m) * 255)
      b = Math.round((b + m) * 255)
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgb(${r}, ${g}, ${b})`
    }

    const formatColorValue = (color) => {
      if (colorFormat.value === 'rgb') {
        return hexToRgb(color.hex)
      }
      return color.hex.toUpperCase()
    }

    const generateRandomPalette = () => {
      const baseColor = generateRandomHex()
      const newColors = generateHarmoniousColors(baseColor, colorCount.value)

      const pinned = colors.value.filter(c => c.pinned).map(c => c.hex)
      
      colors.value = newColors.map((hex, index) => {
        const wasPinned = pinned.includes(hex)
        return {
          hex,
          pinned: wasPinned,
          copied: false
        }
      })

      if (pinned.length > 0) {
        for (let i = 0; i < Math.min(pinned.length, colors.value.length); i++) {
          colors.value[i].hex = pinned[i]
          colors.value[i].pinned = true
        }
      }
      
      saveToLocalStorage()
    }

    const updatePaletteCount = () => {
      if (colors.value.length > 0) {
        const currentColors = colors.value.map(c => c.hex)
        const pinned = colors.value.filter(c => c.pinned).map(c => c.hex)
        
        if (currentColors.length < colorCount.value) {
          const baseColor = currentColors[0]
          const newColors = generateHarmoniousColors(baseColor, colorCount.value)
          
          colors.value = newColors.map((hex, index) => ({
            hex,
            pinned: pinned.includes(hex),
            copied: false
          }))
        } else {
          colors.value = colors.value.slice(0, colorCount.value)
        }
        
        saveToLocalStorage()
      }
    }

    const copyToClipboard = async (color) => {
      try {
        const textToCopy = colorFormat.value === 'rgb' ? hexToRgb(color.hex) : color.hex
        await navigator.clipboard.writeText(textToCopy)
        color.copied = true
        setTimeout(() => {
          color.copied = false
        }, 2000)
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }

    const togglePinColor = (index) => {
      colors.value[index].pinned = !colors.value[index].pinned
      saveToLocalStorage()
    }

    const togglePreviewTheme = () => {
      previewTheme.value = previewTheme.value === 'light' ? 'dark' : 'light'
    }

    const saveToLocalStorage = () => {
      const data = {
        colors: colors.value,
        colorCount: colorCount.value,
        colorFormat: colorFormat.value,
        previewTheme: previewTheme.value
      }
      localStorage.setItem('colorPalette', JSON.stringify(data))
    }

    const loadFromLocalStorage = () => {
      const saved = localStorage.getItem('colorPalette')
      if (saved) {
        const data = JSON.parse(saved)
        colors.value = data.colors || []
        colorCount.value = data.colorCount || 5
        colorFormat.value = data.colorFormat || 'hex'
        previewTheme.value = data.previewTheme || 'light'
      }
    }

    const pinnedColors = computed(() => {
      return colors.value.filter(color => color.pinned)
    })

    onMounted(() => {
      loadFromLocalStorage()
      if (colors.value.length === 0) {
        generateRandomPalette()
      }
    })

    return {
      colors,
      colorCount,
      colorFormat,
      previewTheme,
      generateRandomPalette,
      updatePaletteCount,
      copyToClipboard,
      togglePinColor,
      togglePreviewTheme,
      formatColorValue,
      pinnedColors
    }
  }
}
</script>

<style scoped>
.palette-generator {
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.app-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.app-header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.generate-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.generate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 600;
  color: #333;
}

.select-input {
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.select-input:focus {
  outline: none;
  border-color: #667eea;
}

.format-toggle {
  display: flex;
  gap: 0.5rem;
}

.format-button {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.format-button.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.theme-toggle {
  padding: 0.5rem 1rem;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background-color: #2d3748;
}

.palette-container {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.palette-container h2 {
  margin-bottom: 1rem;
  color: #333;
}

.empty-palette {
  text-align: center;
  padding: 3rem;
  color: #718096;
  font-style: italic;
}

.color-strip {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.color-card {
  flex: 1;
  min-height: 150px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-card:hover {
  transform: scale(1.05);
  z-index: 1;
}

.color-card.pinned {
  border: 3px solid #fbbf24;
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.75rem;
}

.color-value {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.color-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pin-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.pin-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.copied-notification {
  background-color: #48bb78;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  20%, 80% { opacity: 1; }
}

.pinned-colors-info {
  text-align: center;
  padding: 1rem;
  background-color: #fef3c7;
  border-radius: 6px;
  color: #92400e;
}

.preview-section {
  margin-top: 2rem;
}

.app-footer {
  text-align: center;
  padding: 1.5rem;
  background-color: #2d3748;
  color: white;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .color-strip {
    flex-direction: column;
  }
  
  .color-card {
    min-height: 100px;
  }
}
</style>