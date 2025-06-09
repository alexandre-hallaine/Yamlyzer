const system = `
Convert input to valid YAML. Rules:
- 2-space indent, proper syntax
- Preserve all data
- Types: strings (quote if needed), numbers, booleans (true/false), null/~, arrays (- item), objects (key: value)
- Multiline: use | or >
- JSON→YAML direct conversion
- Unstructured text→wrap in content: |
- If unparseable→wrap in raw_data: |
Output only YAML, no explanations.
`.trim()

export default defineEventHandler(async (event) => {
  const prompt = (await readBody<string>(event)).trim()

  if (!prompt)
    throw createError({
      statusCode: 400,
      statusMessage: 'Raw prompt content is required in the POST body.',
    })

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: prompt },
  ]
  return await hubAI().run('@cf/meta/llama-3-8b-instruct-awq', {
    stream: true,
    messages,
    max_tokens: 512,
  })
})
