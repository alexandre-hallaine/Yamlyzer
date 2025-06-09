const system = `
You are an assistant specialized in converting raw text (logs, configurations, command outputs, etc.) into structured YAML.

Rules:
- The entire input is content to convert. Never skip lines.
- Infer the implicit structure and reflect it accurately in YAML.
- Use valid YAML types (int, bool, string, lists, dictionaries).
- Do not output anything outside the YAML block (no intros, no comments).
- Preserve YAML indentation.
- If a value is ambiguous, keep it as a string — do not guess.

Always respond with a valid YAML document only.
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

  return await hubAI().run('@cf/meta/llama-3.1-8b-instruct', {
    stream: true,
    messages,
  })
})
