/* eslint-disable no-console */
import { fal } from '@fal-ai/client'
// import { Client } from '@gradio/client'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const falModelIdCfg = runtimeConfig.falModelId.split(':')
  const falModelId = falModelIdCfg[0]
  const outputWebp = falModelIdCfg[1] === 'webp'

  fal.config({
    credentials: runtimeConfig.falApiKey,
  })
  try {
    const body = await readBody(event)
    const input: any = {
      image_url: body.imageUrl,
    }
    if (outputWebp) {
      input.output_format = 'webp'
    }
    console.time('remove-bg')
    const response = await fal.subscribe(falModelId, {
      // input: {
      //   image_url: body.imageUrl,
      //   // output_mask: true,
      //   output_format: 'webp',
      // },
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          update.logs.map(log => log.message).forEach(console.log)
        }
      },
    })
    console.log(response.data)
    const result = response.data
    console.timeEnd('remove-bg')
    return result
  }
  catch (error) {
    console.log(error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
})
