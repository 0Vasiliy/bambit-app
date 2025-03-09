<template>
  <div :class="{ 'dark': isDarkTheme }" class="main-table flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
    <div class="w-full px-4 sm:px-6 lg:px-8 max-w-4xl items-center">
      <!-- Контейнер для поиска и кнопки переключения темы -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
        <!-- Компонент поиска -->
        <SearchBar v-model:albumIds="albumIds" @search="onSearch" :loading="loading" />
        <!-- Кнопка переключения темы -->
        <button
          @click="toggleTheme"
          class="mt-4 sm:mt-0 px-4 py-2 bg-gray-500 text-white rounded-full w-24 h-10 hover:bg-gray-600 transition-colors"
        >
          {{ isDarkTheme ? 'Light' : 'Dark' }}
        </button>
      </div>

      <!-- Таблица с фотографиями -->
      <PhotoTable
        v-if="!loading && !error"
        :photos="photos"
        :loadingMore="loadingMore"
        @sort="sortData"
        @load-more="loadMore"
      />

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="text-center py-8">Загрузка...</div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePhotoStore } from '../stores/photoStore';
import SearchBar from '../components/SearchBar.vue';
import PhotoTable from '../components/PhotoTable.vue';

const photoStore = usePhotoStore();
const albumIds = ref(photoStore.selectedAlbums.join(' '));
const loadingMore = ref(false);
const isDarkTheme = ref(false);

const photos = computed(() => photoStore.photos);
const loading = computed(() => photoStore.loading);
const error = computed(() => photoStore.error);

// Обработчик поиска
const onSearch = () => {
  const ids = albumIds.value.split(' ').map(id => id.trim()).filter(id => id);
  photoStore.setSelectedAlbums(ids);
  photoStore.nextPage = 1;
  photoStore.fetchPhotos(ids);
};

// Загрузка дополнительных данных
const loadMore = async () => {
  if (!loadingMore.value) {
    loadingMore.value = true;
    await photoStore.fetchPhotos(photoStore.selectedAlbums);
    loadingMore.value = false;
  }
};

// Сортировка данных
const sortData = (column) => {
  const sortedPhotos = [...photos.value].sort((a, b) => a[column] - b[column]);
  photoStore.photos = sortedPhotos;
};

// Переключение темы
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  photoStore.fetchPhotos();
});
</script>

<style>
.main-table {
  height: 100vh;
}
.dark {
  background-color: #1a202c;
  color: #ffffff;
}
.max-w-4xl{
  max-width: 600px;
}
</style>