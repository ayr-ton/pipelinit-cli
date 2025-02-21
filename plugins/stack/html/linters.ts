import { IntrospectFn } from "../deps.ts";

import {
  ESLint,
  introspect as introspectESLint,
} from "../_shared/eslint/mod.ts";

import {
  introspect as introspectStylelint,
  Stylelint,
} from "../_shared/stylelint/mod.ts";

// deno-lint-ignore no-empty-interface
interface Deno {}

export type Linters = {
  eslint?: ESLint | null;
  stylelint?: Stylelint | null;
  deno?: Deno;
} | null;

function anyValue(records: Record<string, unknown>): boolean {
  return Object.values(records).some((v) => v);
}

export const introspect: IntrospectFn<Linters> = async (context) => {
  const logger = context.getLogger("html");
  logger.debug("detecting linter");

  const eslint = await introspectESLint(context);
  if (eslint !== null) {
    logger.debug("detected ESLint");
  }

  const styleLint = await introspectStylelint(context);
  if (styleLint !== null) {
    logger.debug("detected stylelint");
  }

  const linters = {
    eslint,
    styleLint,
  };

  if (anyValue(linters)) return linters;

  if (context.suggestDefault) {
    logger.warning("No Vue or HTML linter detected, using ESLint");
    return {
      eslint: { name: "eslint", hasIgnoreFile: false },
    };
  }

  logger.debug("no supported linter detected");
  return null;
};
