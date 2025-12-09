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

  return {
    title: getTitle(ast),
    options: getListItemsFromSection(ast, "Considered Options"),
    decision: getDecision(ast),
    consequences: getListItemsFromSection(ast, "Consequences", 3),
  };
}

function getTitle(ast: Root): string {
  const h1 = ast.children.find((n): n is Heading => n.type === "heading" && n.depth === 1);
  return sanitiseString(nodeToString(h1));
}

function getListItemsFromSection(ast: Root, section: string, depth: number = 2): string[] {
  const sectionNodes = findSectionNodes(ast, section, depth);
  const list = sectionNodes.find((n): n is List => n.type === "list");
  return list?.children.map((item) => sanitiseString(nodeToString(item))) ?? [];
}

function getDecision(ast: Root): string {
  const sectionNodes = findSectionNodes(ast, "Decision Outcome");
  const marker = "Chosen option: ";
  const node = sectionNodes.find((node) => nodeToString(node).startsWith(marker));
  return sanitiseString(nodeToString(node).replace(marker, ""));
}

function findSectionNodes(root: Root, section: string, depth: number = 2): RootContent[] {
  const sectionHeading = findHeading(root, depth, section);
  if (!sectionHeading) return [];

  const startIdx = root.children.indexOf(sectionHeading);
  return nodesUntilNextHeading(root, startIdx, depth);
}

function findHeading(root: Root, depth: number, text: string): Heading {
  const target = text.trim().toLowerCase();
  return (
    root.children.find(
      (n): n is Heading => n.type === "heading" && n.depth === depth && nodeToString(n).trim().toLowerCase() === target,
    ) || { type: "heading", depth: 1, children: [] }
  );
}

function nodesUntilNextHeading(root: Root, fromIndex: number, depth: number = 2): RootContent[] {
  const out: RootContent[] = [];
  for (let i = fromIndex + 1; i < root.children.length; i++) {
    const n = root.children[i];
    if (!n) continue;
    if (n.type === "heading" && (n as Heading).depth <= depth) break;
    out.push(n);
  }
  return out;
}
