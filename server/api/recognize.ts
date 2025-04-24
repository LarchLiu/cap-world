/* eslint-disable no-console */
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const apiKey = runtimeConfig.bailianApiKey
  try {
    const body = await readBody(event)

    const requestBody = {
      model: 'qwen-vl-plus-2025-01-25',
      messages: [
        {
          role: 'system',
          content: '我想通过图片学习英文，识别图片中的物体，返回该物体的中英文名称，以及对应的英文音标和中文拼音，不要有其他任何解释性文字，返回格式为JSON，如果图片中有多个物体，需返回多个物体的识别结果。JSON格式\n[\n{\n    "chinese_name": "",\n    "english_name": "",\n    "english_phonetic": "",\n    "chinese_pinyin": ""\n  }\n]',
        },
        body,
      ],
      stream: false,
      temperature: 0.1,
    }
    console.time('recognize')
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })
    console.timeEnd('recognize')

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`)
    }

    const result = await response.json()
    console.log(result.choices[0].message.content)
    return result
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
})
