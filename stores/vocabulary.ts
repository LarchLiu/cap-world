import { defineStore } from 'pinia'

// 类型定义
interface WordData {
  chinese_name: string
  english_name: string
  english_phonetic: string
  chinese_pinyin: string
}

interface Word {
  id: string
  word: string
  imageUrl: string
  data: WordData[]
}

interface DateGroup {
  date: string
  words: Word[]
}

// IndexedDB 配置
const DB_NAME = 'vocabulary-db'
const STORE_NAME = 'vocabulary-store'
const DB_VERSION = 1

// 初始化 IndexedDB
async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // 移除 keyPath 配置
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

async function saveToIndexedDB(data: DateGroup[]) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    // 清除旧数据
    const clearRequest = store.clear()
    clearRequest.onsuccess = () => {
      const items = data.map(group => ({
        date: group.date,
        words: JSON.parse(JSON.stringify(group.words)), // 深拷贝确保数据是纯对象
      }))

      // 保存每个日期组的数据
      let completed = 0
      const total = items.length

      items.forEach((item, index) => {
        const addRequest = store.add(item, index) // 使用索引作为键
        addRequest.onsuccess = () => {
          completed++
          if (completed === total)
            resolve(true)
        }
        addRequest.onerror = () => reject(addRequest.error)
      })

      // 如果没有数据需要保存，直接返回
      if (total === 0)
        resolve(true)
    }
    clearRequest.onerror = () => reject(clearRequest.error)
  })
}

// 从 IndexedDB 读取数据
async function loadFromIndexedDB(): Promise<DateGroup[]> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const results: DateGroup[] = request.result || []
      // 按日期降序排序
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      resolve(results)
    }
  })
}

export const useVocabularyStore = defineStore('vocabulary', {
  state: () => ({
    items: [] as DateGroup[],
  }),

  actions: {
    async initializeStore() {
      try {
        const data = await loadFromIndexedDB()
        if (data.length > 0) {
          this.items = data
        }
        else {
          // 如果 IndexedDB 中没有数据，使用默认数据
          this.items = [
            {
              date: '2025-4-8',
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
              date: '2025-4-7',
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
          ]
          await this.syncToIndexedDB()
        }
      }
      catch (error) {
        console.error('Failed to initialize store:', error)
      }
    },

    async syncToIndexedDB() {
      try {
        await saveToIndexedDB(this.items)
      }
      catch (error) {
        console.error('Failed to sync to IndexedDB:', error)
      }
    },
  },
})
