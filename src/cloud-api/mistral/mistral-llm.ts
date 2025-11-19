import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { isEmpty } from "lodash";
import moment from "moment";
import {
  shouldResetChatHistory,
  systemPrompt,
  updateLastMessageTime,
} from "../../config/llm-config";
import { FunctionCall, Message, ToolReturnTag } from "../../type";
import { combineFunction } from "../../utils";
import { mistral, mistralLLMModel } from "./mistral";
import { llmFuncMap, llmTools } from "../../config/llm-tools";
import { ChatWithLLMStreamFunction } from "../interface";
import { chatHistoryDir } from "../../utils/dir";
import { extractToolResponse, stimulateStreamResponse } from "../../config/common";

dotenv.config();

const chatHistoryFileName = `mistral_chat_history_${moment().format(
  "YYYY-MM-DD_HH-mm-ss"
)}.json`;

const messages: Message[] = [
  {
    role: "system",
    content: systemPrompt,
  },
];

const resetChatHistory = (): void => {
  messages.length = 0;
  messages.push({
    role: "system",
    content: systemPrompt,
  });
};

const chatWithLLMStream: ChatWithLLMStreamFunction = async (
  inputMessages: Message[] = [],
  partialCallback: (partial: string) => void,
  endCallback: () => void,
  partialThinkingCallback?: (partialThinking: string) => void,
  invokeFunctionCallback?: (functionName: string, result?: string) => void
): Promise<void> => {
  if (!mistral) {
    console.error("Mistral API key is not set.");
    return;
  }
  if (shouldResetChatHistory()) {
    resetChatHistory();
  }
  updateLastMessageTime();
  let endResolve: () => void = () => {};
  const promise = new Promise<void>((resolve) => {
    endResolve = resolve;
  }).finally(() => {
    fs.writeFileSync(
      path.join(chatHistoryDir, chatHistoryFileName),
      JSON.stringify(messages, null, 2)
    );
  });
  messages.push(...inputMessages);

  const chatCompletion = await mistral.chat.stream({
    model: mistralLLMModel,
    messages: messages as any,
    tools: llmTools as any,
  });

  let partialAnswer = "";
  const functionCallsPackages: any[] = [];

  for await (const chunk of chatCompletion) {
    const deltaContent = chunk.data.choices[0].delta.content;
    if (deltaContent && typeof deltaContent === "string") {
      partialCallback(deltaContent);
      partialAnswer += deltaContent;
    }
    if (chunk.data.choices[0].delta.toolCalls) {
      functionCallsPackages.push(...chunk.data.choices[0].delta.toolCalls);
    }
  }

  const answer = partialAnswer;
  const functionCalls = combineFunction(functionCallsPackages);
  messages.push({
    role: "assistant",
    content: answer,
    tool_calls: isEmpty(functionCalls) ? undefined : functionCalls,
  });

  if (!isEmpty(functionCalls)) {
    const results = await Promise.all(
      functionCalls.map(async (call: FunctionCall) => {
        const {
          function: { arguments: argString, name },
          id,
        } = call;
        let args: Record<string, any> = {};
        try {
          args = JSON.parse(argString || "{}");
        } catch {
          console.error(
            `Error parsing arguments for function ${name}:`,
            argString
          );
        }
        const func = llmFuncMap[name! as string];
        invokeFunctionCallback?.(name! as string);
        if (func) {
          return [
            id,
            await func(args)
              .then((res) => {
                invokeFunctionCallback?.(name! as string, res);
                return res;
              })
              .catch((err) => {
                console.error(`Error executing function ${name}:`, err);
                return `Error executing function ${name}: ${err.message}`;
              }),
          ];
        } else {
          console.error(`Function ${name} not found`);
          return [id, `Function ${name} not found`];
        }
      })
    );

    console.log("call results: ", results);
    const newMessages: Message[] = results.map(([id, result]: any) => ({
      role: "tool",
      content: result as string,
      tool_call_id: id as string,
    }));

    // Directly extract and return the tool result if available
    const describeMessage = newMessages.find((msg) =>
      msg.content.startsWith(ToolReturnTag.Response)
    );
    const responseContent = extractToolResponse(
      describeMessage?.content || ""
    );
    if (responseContent) {
      console.log(
        `[LLM] Tool response starts with "[response]", return it directly.`
      );
      newMessages.push({
        role: "assistant",
        content: responseContent,
      });
      // append responseContent in chunks
      await stimulateStreamResponse({
        content: responseContent,
        partialCallback,
        endResolve,
        endCallback,
      });
      return;
    }

    await chatWithLLMStream(newMessages, partialCallback, () => {
      endResolve();
      endCallback();
    });
    return;
  } else {
    endResolve();
    endCallback();
  }
  return promise;
};

export { chatWithLLMStream, resetChatHistory };
