import { Buffer } from 'node:buffer'
import { defineEventHandler, readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const baseUrl = runtimeConfig.recognizeBaseUrl
  try {
    // Parse multipart form data
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw new Error('No form data received')
    }

    // Find the file part
    const filePart = formData.find(part => part.name === 'file')
    if (!filePart || !filePart.data) {
      throw new Error('No file found in request')
    }

    // Create form data for external API
    const externalFormData = new FormData()
    const blob = new Blob([filePart.data], { type: filePart.type || 'image/jpeg' })
    externalFormData.append('file', blob, filePart.filename || 'photo.jpg')

    // Send to external prediction service
    const response = await fetch(`${baseUrl}/predict`, {
      method: 'POST',
      body: externalFormData,
    })

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`)
    }

    // Get the image response
    const imageBlob = await response.blob()
    const arrayBuffer = await imageBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Return the image with proper headers
    event.node.res.setHeader('Content-Type', 'image/png')
    return buffer
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
})
