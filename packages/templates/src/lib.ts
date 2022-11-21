import { TemplateArgs, TemplateType } from "@mokr/core";

async function apply({ directory }: TemplateArgs) {
  directory;
  return;
}

export const lib = {
  type: TemplateType.Workspace,
  apply,
};
