import fs from "fs";
import path from "path";
import traverse from "@babel/traverse";
import debugFactory from "debug";
import { getFileId } from "../naming-utils.js";
import getAst from "../get-ast.js";
import getDefaultExport from "./get-default-export.js";
import getStorynameAndMeta from "./get-storyname-and-meta.js";
import getNamedExports from "./get-named-exports.js";

const debug = debugFactory("ladle:vite");

/**
 * @param {string[]} entries
 */
export const getEntryData = async (entries) => {
  /**
   * @type {import('../../../shared/types').EntryData}
   */
  const entryData = {};
  for (let entry of entries) {
    debug(`Parsing ${entry}`);
    entryData[entry] = await getSingleEntry(entry);
  }
  return entryData;
};

/**
 * @param {string} entry
 */
export const getSingleEntry = async (entry) => {
  /** @type {import('../../../shared/types').ParsedStoriesResult} */
  const result = {
    entry,
    stories: [],
    exportDefaultProps: { title: undefined, meta: undefined },
    namedExportToMeta: {},
    namedExportToStoryName: {},
    storyParams: {},
    fileId: getFileId(entry),
  };
  const code = await fs.promises.readFile(
    path.join(process.cwd(), entry),
    "utf8",
  );
  const ast = getAst(code, entry);
  /** @type {any} */ (traverse).default(ast, {
    Program: getStorynameAndMeta.bind(this, result),
    ExportDefaultDeclaration: getDefaultExport.bind(this, result),
    ExportNamedDeclaration: getNamedExports.bind(this, result),
  });
  debug(`Parsed data for ${entry}:`);
  debug(result);
  return result;
};
