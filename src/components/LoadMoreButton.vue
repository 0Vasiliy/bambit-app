<template>
  <div class="mt-4 text-center">
    <!-- Кнопка "Загрузить ещё" -->
    <button @click="loadMore" class="px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
      Загрузить ещё
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['load-more']);

// Обработчик загрузки дополнительных данных
const loadMore = () => {
  emit('load-more');
};
</script>