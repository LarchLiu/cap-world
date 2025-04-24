import { defineStore } from 'pinia'

export const useVocabularyStore = defineStore('vocabulary', {
  state: () => ({
    items: [
      {
        date: '4月 08',
        words: [
          {
            id: '1',
            word: 'Youtiao',
            imageUrl: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg',
            data: [{
              chinese_name: '油条',
              english_name: 'Youtiao',
              english_phonetic: 'ˈjʊˌtjaʊ',
              chinese_pinyin: 'yóu tiáo',
            }],
          },
          {
            id: '2',
            word: 'Soy milk',
            imageUrl: 'https://images.pexels.com/photos/5946974/pexels-photo-5946974.jpeg',
            data: [{
              chinese_name: '豆浆',
              english_name: 'Soy milk',
              english_phonetic: 'sɔɪ mɪlk',
              chinese_pinyin: 'dòu jiāng',
            }],
          },
        ],
      },
      {
        date: '4月 07',
        words: [
          {
            id: '4',
            word: 'Brush',
            imageUrl: 'https://images.pexels.com/photos/6621472/pexels-photo-6621472.jpeg',
            data: [{
              chinese_name: '刷子',
              english_name: 'Brush',
              english_phonetic: 'brʌʃ',
              chinese_pinyin: 'shuā zi',
            }],
          },
        ],
      },
    ],
  }),
})
