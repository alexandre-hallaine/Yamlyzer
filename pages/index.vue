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
  <UPageSection
    title="Yamlyzer"
    description="Convert raw logs, configs, or CLI output into structured YAML instantly."
  >
    <template #links>
      <UButton
        label="Convert"
        :loading
        @click="convert"
      />
    </template>

    <UPageGrid class="lg:grid-cols-2">
      <UTextarea
        v-model="input"
        autoresize
        placeholder="Paste raw text here..."
        :ui="{ base: 'h-full' }"
      />
      <UCard>
        <pre
          class="whitespace-pre-wrap"
          v-text="output"
        />
      </UCard>
    </UPageGrid>
  </UPageSection>
</template>
