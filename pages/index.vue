<script setup lang="ts">
const input = ref('')
const output = ref('')
const loading = ref(false)

async function convert() {
  loading.value = true
  output.value = ''

  const response = useStream('/api/convert', input.value)()
  for await (const chunk of response) output.value += chunk

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
