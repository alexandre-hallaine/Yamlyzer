export function useStream(endpoint: string, body: string) {
  return async function* () {
    const response = await $fetch(endpoint, {
      method: 'POST',
      body,
      responseType: 'stream',
      headers: { 'Content-Type': 'text/plain' },
    })
    if (!(response instanceof ReadableStream)) throw new Error('Expected a stream response')

    let buffer = ''
    const reader = (response as ReadableStream).pipeThrough(new TextDecoderStream()).getReader()

    while (true) {
      const { value, done } = await reader.read()

      if (done) {
        if (buffer.trim()) console.warn('Stream ended with unparsed data:', buffer)
        return
      }

      buffer += value
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice('data: '.length).trim()
        if (data === '[DONE]') break

        try {
          const jsonData = JSON.parse(data)
          if (jsonData.response) yield jsonData.response
        }
        catch (parseError) {
          console.warn('Error parsing JSON:', parseError)
        }
      }
    }
  }
}
