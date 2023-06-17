import { content } from "@/mock";
import { OpenAI, PromptTemplate } from "langchain";
import { AnalyzeDocumentChain, loadSummarizationChain } from "langchain/chains"
import removeMarkdown from "remove-markdown"

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
  maxTokens: 400,
})

export async function getSummarg(lang = 'zh') {
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

  const res = await chain.call({
    input_document: removeMarkdown(content, {
      useImgAltText: true,
      gfm: true,
    }),
  })
  return res
}
