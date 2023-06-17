import { OpenAI, PromptTemplate } from "langchain";
import { AnalyzeDocumentChain, loadSummarizationChain } from "langchain/chains"
import removeMarkdown from "remove-markdown"
import Redis from "ioredis"

let redisClient:Redis
if (process.env.REDIS_URL) {
 redisClient = new Redis(process.env.REDIS_URL!)
}

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
  maxTokens: 400,
})

export async function getSummarg(post: Record<string, string> , lang = 'zh') {
  const id = Object.keys(post)[0]
  const content = Object.values(post)[0]

  let res = await redisClient.get(id)
  if (res) {
    return res
  }

  const prompt = new PromptTemplate({
    template: `Summarize this in "${lang}" language:
        "{text}"
        CONCISE SUMMARY:`,
    inputVariables: ["text"],
  })

  const combineDocsChain = loadSummarizationChain(model, {
    type: "map_reduce",
    combineMapPrompt: prompt,
    combinePrompt: prompt,
  })

  const chain = new AnalyzeDocumentChain({
    combineDocumentsChain: combineDocsChain,
  })

  const data = await chain.call({
    input_document: removeMarkdown(content, {
      useImgAltText: true,
      gfm: true,
    }),
  })

  res = data.text || '错误'
  await redisClient.set(id, res!);

  return res
}
