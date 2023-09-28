import { PluginType, validateType } from "./plugin.js";
import { toCamelCase } from "./utils/string.js";

export type TemplateArgs = { directory: string };

export type Template = {
  type: PluginType;
  interactive?: boolean;
  apply: (args: TemplateArgs) => Promise<void>;
};

type TemplateOptions = {
  directory: string;
  name: string;
  beforeApply?: (template: Template) => any | Promise<any>;
  afterApply?: (template: Template) => any | Promise<any>;
};

const CORE_TEMPLATES = [
  "bandersnatch",
  "common",
  "cra",
  "express",
  "github-action",
  "lib",
  "next",
  "sanity",
];

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
    // Workaround to prevent TS5055 errors
    const packageName = "@mokr/templates" as string;
    const templates: any = await import(packageName);
    template = templates[toCamelCase(name) as keyof typeof templates];
  } else {
    template = await import(name);
  }

  if (!isTemplate(template)) {
    throw new Error(`Template ${name} does not exist or is not valid`);
  }

  await validateType({ directory, name, type: template.type });

  return template;
}

export async function applyTemplate({
  directory,
  name,
  beforeApply,
  afterApply,
}: TemplateOptions) {
  const template = await importTemplate({ directory, name });

  if (beforeApply) {
    await beforeApply(template);
  }

  await template.apply({ directory });

  if (afterApply) {
    await afterApply(template);
  }
}
