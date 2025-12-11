import type { Context } from "../context/schema";
import type { Decision } from "../decision/schema";
import type { Option } from "../options/schema";
import type { AdrData } from "./schema";

type AdrDataInput = {
  context: Context;
  options: Option[];
  decision: Decision;
};

export function extractAdrData(input: AdrDataInput): AdrData {
  const {
    context,
    options,
    decision: { title, ...decision },
  } = input;
  return {
    title,
    context,
    options,
    decision,
  };
}
