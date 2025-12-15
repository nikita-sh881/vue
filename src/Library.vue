<template>
  <div class="library-page">
    <div class="page-header">
      <h1>📚 Библиотека палитр</h1>
      <p>Управляйте сохраненными цветовыми схемами</p>
    </div>
    
    <div class="library-controls">
      <SearchInput 
        v-model="searchQuery"
        label="Поиск палитр:"
        placeholder="Поиск по названию или тегам..."
        @search="performSearch"
        @reset="resetSearch"
        class="search-input"
      />
      
      <div class="filter-controls">
        <div class="filter-group">
          <label>Теги:</label>
          <div class="tags-filter">
            <button 
              v-for="tag in allTags" 
              :key="tag"
              @click="toggleTag(tag)"
              :class="{ active: selectedTags.includes(tag) }"
              class="tag-btn"
            >
              {{ tag }}
            </button>
          </div>
        </div>
        
        <div class="sort-controls">
          <label>Сортировка:</label>
          <select v-model="sortBy" class="select-input">
            <option value="date-desc">Сначала новые</option>
            <option value="date-asc">Сначала старые</option>
            <option value="name-asc">По имени (А-Я)</option>
            <option value="name-desc">По имени (Я-А)</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="collections-section" v-if="collections.length">
      <h2>Коллекции</h2>
      
      <div class="collections-grid">
        <div 
          v-for="collection in collections"
          :key="collection.id"
          class="collection-card"
          @click="viewCollection(collection.id)"
        >
          <div class="collection-header">
            <h3>{{ collection.name }}</h3>
            <span class="count">{{ collection.palettes.length }} палитр</span>
          </div>
          <p class="description">{{ collection.description }}</p>
          
          <div class="collection-colors">
            <div 
              v-for="palette in getCollectionPalettes(collection)"
              :key="palette.id"
              class="collection-color-strip"
            >
              <div 
                v-for="color in palette.colors.slice(0, 3)"
                :key="color"
                class="mini-color"
                :style="{ backgroundColor: color }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="palettes-section">
      <div class="section-header">
        <h2>Все палитры</h2>
        <button @click="createNewPalette" class="btn-new">
          ＋ Новая палитра
        </button>
      </div>
      
      <div v-if="filteredPalettes.length" class="palettes-grid">
        <PaletteCard 
          v-for="palette in filteredPalettes"
          :key="palette.id"
          :palette="palette"
          @edit="editPalette"
          @delete="deletePalette"
          @toggle-favorite="toggleFavorite"
          @copy="copyPalette"
        />
      </div>
      
      <div v-else class="empty-library">
        <div class="empty-icon">📚</div>
        <h3>Палитры не найдены</h3>
        <p>Создайте первую палитру в генераторе</p>
        <router-link to="/generator" class="btn-primary">
          🎲 Перейти к генератору
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SearchInput from '../SearchInput.vue'
import PaletteCard from '../PaletteCard.vue'
import { usePaletteStorage } from '../usePaletteStorage.js'

export default {
  name: 'LibraryPage',
  
  components: {
    SearchInput,
    PaletteCard
  },
  
  setup() {
    const router = useRouter()
    const { 
      savedPalettes, 
      collections, 
      getAllTags, 
      searchPalettes, 
      filterByTags,
      toggleFavorite,
      deletePalette 
    } = usePaletteStorage()
    
    const searchQuery = ref('')
    const selectedTags = ref([])
    const sortBy = ref('date-desc')

    const searchedPalettes = computed(() => {
      if (searchQuery.value.trim()) {
        return searchPalettes(searchQuery.value)
      }
      return savedPalettes.value
    })

    const filteredByTags = computed(() => {
      if (selectedTags.value.length === 0) {
        return searchedPalettes.value
      }
      return filterByTags(selectedTags.value)
    })
    
    const filteredPalettes = computed(() => {
      const palettes = [...filteredByTags.value]
      
      switch (sortBy.value) {
        case 'date-asc':
          return palettes.sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
          )
        
        case 'name-asc':
          return palettes.sort((a, b) => 
            a.name.localeCompare(b.name, 'ru')
          )
        
        case 'name-desc':
          return palettes.sort((a, b) => 
            b.name.localeCompare(a.name, 'ru')
          )
        
        case 'date-desc':
        default:
          return palettes.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          )
      }
    })
    

    const performSearch = () => {
    }
    
    const resetSearch
