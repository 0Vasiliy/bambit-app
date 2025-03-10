 <template>
  <div class="flex justify-center items-center">
    <!-- Контейнер для таблицы -->
    <div
      ref="tableContainer"
      class="foto-table overflow-auto border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:text-white w-full max-w-[600px] h-[400px] sm:h-[500px] md:h-[600px]"
    >
      <table class="table-auto w-full">
        <thead class="sticky top-0 bg-slate-950 text-white">
          <tr>
            <!-- Заголовки таблицы с возможностью сортировки -->
            <th @click="sort('id')" class="cursor-pointer p-2 text-sm sm:text-base">Ид</th>
            <th @click="sort('albumId')" class="cursor-pointer p-2 text-sm sm:text-base">Альбом</th>
            <th @click="sort('title')" class="cursor-pointer p-2 text-sm sm:text-base">Название</th>
            <th @click="sort('url')" class="cursor-pointer p-2 text-sm sm:text-base">Ссылка</th>
            <th @click="sort('thumbnailUrl')" class="cursor-pointer p-2 text-sm sm:text-base">Миниатюра</th>
          </tr>
        </thead>
        <tbody>
          <!-- Строки таблицы -->
          <tr
            v-for="photo in sortedPhotos"
            :key="photo.id"
            class="hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <td class="p-2 border dark:border-gray-600 text-sm sm:text-base">{{ photo.id }}</td>
            <td class="p-2 border dark:border-gray-600 text-sm sm:text-base">{{ photo.albumId }}</td>
            <td class="p-2 border dark:border-gray-600 text-sm sm:text-base" :title="photo.title">
              {{ truncatedText(photo.title) }}
            </td>
            <td class="p-2 border dark:border-gray-600 text-sm sm:text-base" :title="photo.url">
              {{ truncatedText(photo.url) }}
            </td>
            <td class="p-2 border dark:border-gray-600 text-sm sm:text-base" :title="photo.thumbnailUrl">
              {{ truncatedText(photo.thumbnailUrl) }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Индикатор загрузки дополнительных данных -->
      <div v-if="loadingMore" class="text-center py-4">Загрузка...</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  photos: {
    type: Array,
    required: true,
  },
  loadingMore: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['sort', 'load-more']);

const tableContainer = ref(null);
const sortColumn = ref(null);
const sortDirection = ref('asc');

// Сортировка фотографий
const sortedPhotos = computed(() => {
  if (!sortColumn.value) return props.photos;

  return [...props.photos].sort((a, b) => {
    if (a[sortColumn.value] < b[sortColumn.value]) return sortDirection.value === 'asc' ? -1 : 1;
    if (a[sortColumn.value] > b[sortColumn.value]) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
});

// Обработчик сортировки
const sort = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
  emit('sort', column);
};

// Укорачивание текста
const truncatedText = (text) => {
  return text.length > 30 ? text.slice(0, 30) + '...' : text;
};

// Обработчик скролла для загрузки дополнительных данных
const handleScroll = (event) => {
  const table = event.target;
  const bottom = table.scrollHeight - table.scrollTop <= table.clientHeight + 1;
  if (bottom) {
    emit('load-more');
  }
};

// Добавление обработчика скролла при монтировании
onMounted(() => {
  if (tableContainer.value) {
    tableContainer.value.addEventListener('scroll', handleScroll);
  }
});

// Удаление обработчика скролла при размонтировании
onUnmounted(() => {
  if (tableContainer.value) {
    tableContainer.value.removeEventListener('scroll', handleScroll);
  }
});
</script> 
