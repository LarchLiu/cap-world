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
              date: '2025-4-25',
              words: [
                {
                  id: '1',
                  word: 'Washing machine',
                  imageUrl: 'https://v3.fal.media/files/elephant/lMGtsskaoTkGKPl3WMpEu_89dbc99024864b01a89509140fe79eac.webp',
                  data: [
                    {
                      chinese_name: '洗衣机',
                      english_name: 'Washing machine',
                      english_phonetic: '/ˈwɒʃɪŋ məˈʃiːn/',
                      chinese_pinyin: 'xǐ yī jī',
                    },

                  ],
                },
                {
                  id: '2',
                  word: 'Liquid Detergent, Pine Scented Liquid Detergent',
                  imageUrl: 'https://v3.fal.media/files/lion/901J5XqXho-aHdWHWNjFA_b45ec5be0c8b42b297b70ddd1830e8a4.webp',
                  data: [
                    {
                      chinese_name: '洗衣液',
                      english_name: 'Liquid Detergent',
                      english_phonetic: '/ˈlɪkwid dəˌtɜːr.dʒənt/',
                      chinese_pinyin: 'xǐ yī ròu',
                    },
                    {
                      chinese_name: '松香洗衣液',
                      english_name: 'Pine Scented Liquid Detergent',
                      english_phonetic: '/pain sɛnd tʃæd liqjwɪd di.tɜːrdʒ.ənt/',
                      chinese_pinyin: 'sōng xiāng',
                    },
                  ],
                },

              ],
            },
            {
              date: '2025-4-24',
              words: [
                {
                  id: '3',
                  word: 'Mug, Spoon',
                  imageUrl: 'https://v3.fal.media/files/kangaroo/bXoRex-ASZLXlqQuGl77Y_f2fb4ca30c6a464a8e3d29e0a3456675.webp',
                  data: [
                    {
                      chinese_name: '马克杯',
                      english_name: 'Mug',
                      english_phonetic: '/mʌɡ/',
                      chinese_pinyin: 'Mǎkèbēi',
                    },
                    {
                      chinese_name: '勺子',
                      english_name: 'Spoon',
                      english_phonetic: '/spuːn/',
                      chinese_pinyin: 'Sháozi',
                    },
                  ],
                },
                {
                  id: '4',
                  word: 'Mobile phone, Cigarette pack',
                  imageUrl: 'https://v3.fal.media/files/lion/pk6xkdXvRpYimwecKBa32_ce32c1595c894901b347a5e85f268b52.webp',
                  data: [
                    {
                      chinese_name: '手机',
                      english_name: 'Mobile phone',
                      english_phonetic: '/ˈməʊbaɪl fəʊn/',
                      chinese_pinyin: 'shǒujī',
                    },
                    {
                      chinese_name: '香烟盒',
                      english_name: 'Cigarette pack',
                      english_phonetic: '/ˈsɪɡərɛt pæk/',
                      chinese_pinyin: 'xiāngyān hé',
                    },
                  ],
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
