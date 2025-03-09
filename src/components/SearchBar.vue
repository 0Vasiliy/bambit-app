<template>
  <div class="flex flex-col sm:flex-row justify-between items-center">
    <!-- Поле ввода для ID альбомов -->
    <input
      :value="albumIds"
      @input="updateAlbumIds"
      type="text"
      placeholder="Введите ID альбомов (например: 1 2 3)"
      class="px-4 py-2 border rounded-md w-full sm:w-2/3 dark:bg-gray-700 dark:text-white dark:border-gray-600"
    />
    <!-- Кнопка поиска -->
    <button
      @click="onSearch"
      :disabled="loading"
      class="mt-4 sm:mt-0 sm:ml-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      <span v-if="loading" class="animate-spin">🔄</span>
      <span v-else>Поиск</span>
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  albumIds: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:albumIds', 'search']);

// Обработчик поиска
const onSearch = () => {
  emit('search');
};

// Обновление ID альбомов
const updateAlbumIds = (event) => {
  emit('update:albumIds', event.target.value);
};
</script>