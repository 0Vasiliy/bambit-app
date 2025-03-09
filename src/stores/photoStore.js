import { defineStore } from 'pinia';

export const usePhotoStore = defineStore('photo', {
  state: () => ({
    photos: [], 
    loading: false, 
    nextPage: 1, 
    error: null, 
    selectedAlbums: JSON.parse(localStorage.getItem('selectedAlbums')) || [], // Выбранные альбомы
  }),
  actions: {
    // Загрузка фотографий
    async fetchPhotos(albumIds = []) {
      this.loading = true;
      this.error = null;
      try {
        let url = 'https://jsonplaceholder.typicode.com/photos';
        if (albumIds.length) {
          const albumParams = albumIds.map(id => `albumId=${id}`).join('&');
          url += `?${albumParams}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (this.nextPage === 1) {
          // Первоначальная загрузка: все элементы
          this.photos = data;
        } else {
          // Подгрузка: добавляем следующие 20 элементов
          const newPhotos = data.slice((this.nextPage - 1) * 20, this.nextPage * 20);
          this.photos = [...this.photos, ...newPhotos];
        }
        this.nextPage++;
      } catch (error) {
        this.error = 'Ошибка при загрузке данных';
      } finally {
        this.loading = false;
      }
    },
    // Установка выбранных альбомов
    setSelectedAlbums(albumIds) {
      this.selectedAlbums = albumIds;
      localStorage.setItem('selectedAlbums', JSON.stringify(albumIds));
    },
  },
});