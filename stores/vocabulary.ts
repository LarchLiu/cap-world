import { defineStore } from 'pinia'

export const useVocabularyStore = defineStore('vocabulary', {
  state: () => ({
    items: [
      {
        date: '4月 08',
        words: [
          { id: '1', word: 'Youtiao', imageUrl: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg' },
          { id: '2', word: 'Soy milk', imageUrl: 'https://images.pexels.com/photos/5946974/pexels-photo-5946974.jpeg' },
        ],
      },
      {
        date: '4月 07',
        words: [
          { id: '4', word: 'Brush', imageUrl: 'https://images.pexels.com/photos/6621472/pexels-photo-6621472.jpeg' },
        ],
      },
    ],
  }),
})
