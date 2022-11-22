import { isMonorepo } from "./monorepo.js";
import { toCamelCase } from "./utils/string.js";

export type TemplateArgs = { directory: string };

export enum TemplateType {
  Monorepo = "monorepo",
  Workspace = "workspace",
  Any = "any",
}

export type Template = {
  type: string | TemplateType;
  apply: (args: TemplateArgs) => Promise<void>;
};

type TemplateOptions = {
  directory: string;
  name: string;
};

const CORE_TEMPLATES = ["lib", "full"];

export function isTemplate(template: unknown): template is Template {
  return !!(
    template &&
    typeof template === "object" &&
    // @ts-ignore
    typeof template?.type === "string" &&
    // @ts-ignore
    typeof template?.apply === "function"
  );
}

export async function importTemplate({ directory, name }: TemplateOptions) {
  let template: Template;

  if (CORE_TEMPLATES.includes(name)) {
    // @ts-ignore
    const templates: any = await import("@mokr/templates");
    template = templates[toCamelCase(name) as keyof typeof templates];
  } else {
    template = await import(name);
  }

  if (!isTemplate(template)) {
    throw new Error(`Template ${name} does not exist or is not valid`);
  }

  // Monorepo level?
  if (await isMonorepo({ directory })) {
    if (template.type === "workspace") {
      throw new Error(`Template ${name} can only be used at workspace level`);
    }
  } else {
    if (template.type === "monorepo") {
      throw new Error(`Template ${name} can only be used at monorepo level`);
    }
  }

  return template;
}

export async function applyTemplate({ directory, name }: TemplateOptions) {
  const template = await importTemplate({ directory, name });

  await template.apply({ directory });
}
