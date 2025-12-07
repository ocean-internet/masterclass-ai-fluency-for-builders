import type { Heading, List, Root, RootContent } from "mdast";
import { toString as nodeToString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import { unified } from "unified";

import { sanitiseString } from "./sanitise-string";

export type MadrParsed = {
  title: string;
  options: string[];
  decision: string;
  consequences: string[];
};

export async function parseMadr(md: string): Promise<MadrParsed> {
  const ast = unified().use(remarkParse).parse(md) as Root;

  const title = getTitle(ast);
  const options = getOptions(ast);
  const decision = getDecision(ast);
  const consequences = getConsequences(ast);

  return { title, options, decision, consequences };
}

function getTitle(ast: Root) {
  const h1 = ast.children.find((n) => n.type === "heading" && (n as Heading).depth === 1) as Heading | undefined;
  return h1 ? sanitiseString(nodeToString(h1)) : "";
}

function getOptions(ast: Root) {
  const sectionNodes = findSectionNodes(ast, "Considered Options");
  if (!sectionNodes) return [];

  const list = sectionNodes.find((n) => n.type === "list");
  if (!list) return [];

  return (list as List).children.map((item) => sanitiseString(nodeToString(item)));
}

function getDecision(ast: Root): string {
  const sectionNodes = findSectionNodes(ast, "Decision Outcome");
  if (!sectionNodes) return "";

  const marker = "Chosen option: ";
  const node = sectionNodes.find((node) => nodeToString(node).startsWith(marker));

  return node ? sanitiseString(nodeToString(node).replace(marker, "")) : "";
}

function getConsequences(ast: Root) {
  const sectionNodes = findSectionNodes(ast, "Consequences", 3);
  if (!sectionNodes) return [];

  const list = sectionNodes.find((n) => n.type === "list");
  if (!list) return [];

  return (list as List).children.map((item) => sanitiseString(nodeToString(item)));
}

function findHeading(root: Root, depth: number, text: string): Heading | undefined {
  const target = text.trim().toLowerCase();
  return root.children.find(
    (n) => n.type === "heading" && (n as Heading).depth === depth && nodeToString(n).trim().toLowerCase() === target,
  ) as Heading | undefined;
}

function findSectionNodes(root: Root, section: string, depth: number = 2) {
  const sectionHeading = findHeading(root, depth, section);
  if (!sectionHeading) return;

  const startIdx = root.children.indexOf(sectionHeading);
  return nodesUntilNextHeading(root, startIdx, depth);
}

function nodesUntilNextHeading(root: Root, fromIndex: number, depth: number = 2): RootContent[] {
  const out: RootContent[] = [];
  for (let i = fromIndex + 1; i < root.children.length; i++) {
    const n = root.children[i] as RootContent;
    if (n.type === "heading" && (n as Heading).depth <= depth) break;
    out.push(n);
  }
  return out;
}
