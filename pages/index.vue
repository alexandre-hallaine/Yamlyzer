<script setup lang="ts">
const input = ref('')
const output = ref('')
const loading = ref(false)

async function convert() {
  output.value = ''
  loading.value = true
  console.log('convert')

  const response = await $fetch<ReadableStream>('/api/convert', {
    method: 'POST',
    body: input.value,
    responseType: 'stream',
    headers: {
      'Content-Type': 'text/plain',
    },
  })

  let buffer = ''
  const reader = response.pipeThrough(new TextDecoderStream()).getReader()

  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      if (buffer.trim()) console.warn('Stream ended with unparsed data:', buffer)
      break
    }

    buffer += value
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice('data: '.length).trim()

      try {
        const jsonData = JSON.parse(data)
        if (jsonData.response) output.value += jsonData.response
      }
      catch (parseError) {
        console.warn('Error parsing JSON:', parseError)
      }
    }
  }

  loading.value = false
}
</script>

<template>
  <UPageSection>
    <UPageHero title="Hey" />
    <UTextarea v-model="input" />
    <UButton
      label="Convert"
      :loading
      @click="convert"
    />
    <pre>{{ output }}</pre>
  </UPageSection>
</template>
