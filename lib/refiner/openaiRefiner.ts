import { Configuration, OpenAIApi } from "openai";
import { Instruction } from "./instructions";

import LanguageDetect from "languagedetect";
import { guessLanguage } from "../guessLanguage";
import { trackRefine } from "../tracker";
import { titleCase } from "../strings";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const openai = new OpenAIApi(configuration);

export const languageDetector = new LanguageDetect();

export async function openAIRefineText(
  text: string,
  instructions: Instruction[]
): Promise<string> {
  const languageName = guessLanguage(text);
  const prompt = `Fix grammar and stylistic errors in the text provided below.

The output text must conform to the following instructions:

${formatInstructions(instructions)}
- Return only corrected text. Do not write validation status.
- ${getLanguageInstruction(languageName)} Do not translate the text.
- Do not add any information that is not present in the input text.
- If you don't see any errors in the provided text and there is nothing to fix, return the provided text verbatim.
`;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    temperature: 0,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text },
    ],
  });

  const refined = completion.data.choices[0].message?.content || "";
  await trackRefine(text, prompt, refined, instructions, languageName);
  return refined;
}

function getLanguageInstruction(languageName: string | undefined): string {
  const fallbackInstruction =
    "Keep the output language the same as the input language.";
  if (!languageName) {
    return fallbackInstruction;
  }
  return `Keep ${titleCase(
    languageName
  )} as the output language (the same as the input language).`;
}

function formatInstructions(instructions: Instruction[]): string {
  return instructions
    .map((instruction) => {
      return `- ${instruction.prompt}`;
    })
    .join("\n");
}
