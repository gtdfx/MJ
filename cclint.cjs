#!/usr/bin/env node
/**
 * cclint - Comprehensive CoffeeScript/CJS Linter
 *
 * Analyzes compiled CJS JavaScript to find require() calls with missing targets.
 * Uses acorn for reliable AST parsing.
 *
 * Usage:
 *   node cclint.cjs [-r REPLACEMENT] [--write] [--dry-run] FILE
 */

const fs = require("fs");
const path = require("path");
const acorn = require("acorn");

// ---------- CLI ----------

const args = process.argv.slice(2);
let replacementModule = null;
let writeMode = false;
let dryRun = false;
const files = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === "-r" || args[i] === "--replace") {
    replacementModule = args[++i];
  } else if (args[i] === "--write") {
    writeMode = true;
  } else if (args[i] === "--dry-run") {
    dryRun = true;
  } else {
    files.push(args[i]);
  }
}

if (files.length === 0) {
  console.error(
    "Usage: cclint [-r REPLACEMENT] [--write] [--dry-run] FILE [FILE...]",
  );
  process.exit(1);
}

// ---------- AST Analysis ----------

/**
 * Extract all require() calls from the AST, returning structured info
 * about each one including the source range for replacement.
 */
function findRequires(code, ast) {
  const requires = [];
  const resolvedFiles = [];

  function walk(node, ancestors) {
    if (!node || typeof node !== "object") return;

    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, [...ancestors, { key: i }]));
      return;
    }

    if (node.type === "CallExpression") {
      const callee = node.callee;

      // Simple: require('literal')
      // BinaryOp: 'foo' + require('literal')
      // Ternary: cond ? 'a' : require('literal')
      // Member: require('foo').bar
      const reqArg = extractRequireArg(node);
      if (reqArg !== null) {
        const fullText = code.slice(node.start, node.end);
        const innerText = code.slice(node.arguments[0].start, node.arguments[0].end);
        const line = getLineNumber(code, node.start);
        const col = getColumnNumber(code, node.start);

        requires.push({
          moduleName: reqArg,
          line,
          column: col,
          outerStart: node.start,
          outerEnd: node.end,
          innerStart: node.arguments[0].start,
          innerEnd: node.arguments[0].end,
          fullText,
          innerText,
          resolved: false,
          resolvedPath: null,
          resolvedLines: 0,
          candidates: [],
        });
      }
    }

    // Recurse
    for (const key of Object.keys(node)) {
      if (key === "type" || key === "start" || key === "end" || key === "loc") continue;
      const child = node[key];
      walk(child, [...ancestors, { key }]);
    }
  }

  walk(ast, []);

  // Resolve each require
  for (const req of requires) {
    if (req.moduleName) {
      const result = resolveModule(req.moduleName);
      req.resolved = result.exists;
      req.resolvedPath = result.path;
      req.resolvedLines = result.lines;
      req.candidates = result.candidates;
    }
  }

  return requires;
}

/**
 * Extract the string argument from a require() call, handling various patterns:
 * - require('literal')
 * - 'prefix' + require('literal')
 * - require('literal').method
 * - ternary ? require('a') : require('b')
 * - conditional ? 'static' : require('dynamic')
 */
function extractRequireArg(callNode) {
  if (callNode.arguments.length === 0) return null;

  const arg = callNode.arguments[0];

  // require('literal') - simple string
  if (arg.type === "Literal" && typeof arg.value === "string") {
    return arg.value;
  }

  // Binary: 'prefix' + require('literal') or require('literal') + 'suffix'
  if (arg.type === "BinaryExpression") {
    const left = extractRequireArgFromExpr(arg.left);
    if (left !== null) return left;
    const right = extractRequireArgFromExpr(arg.right);
    if (right !== null) return right;
  }

  // Conditional: cond ? require('a') : require('b')
  if (arg.type === "ConditionalExpression") {
    const consequent = extractRequireArgFromExpr(arg.consequent);
    if (consequent !== null) return consequent;
    const alternate = extractRequireArgFromExpr(arg.alternate);
    if (alternate !== null) return alternate;
  }

  return null;
}

function extractRequireArgFromExpr(expr) {
  if (expr.type === "Literal" && typeof expr.value === "string") {
    return expr.value;
  }
  if (expr.type === "CallExpression" && expr.callee.type === "Identifier" && expr.callee.name === "require" && expr.arguments.length > 0) {
    const arg = expr.arguments[0];
    if (arg.type === "Literal" && typeof arg.value === "string") {
      return arg.value;
    }
  }
  if (expr.type === "BinaryExpression") {
    const l = extractRequireArgFromExpr(expr.left);
    if (l !== null) return l;
    const r = extractRequireArgFromExpr(expr.right);
    if (r !== null) return r;
  }
  if (expr.type === "ConditionalExpression") {
    const c = extractRequireArgFromExpr(expr.consequent);
    if (c !== null) return c;
    const a = extractRequireArgFromExpr(expr.alternate);
    if (a !== null) return a;
  }
  return null;
}

// ---------- Module Resolution ----------

const BUILTIN_MODULES = new Set(require("module").builtinModules || []);

function resolveModule(moduleName) {
  // Skip empty strings and builtins
  if (!moduleName || moduleName.startsWith(".") || BUILTIN_MODULES.has(moduleName.split("/")[0])) {
    return { exists: true, path: null, lines: 0, candidates: [] };
  }

  // Try to resolve as npm package
  const candidates = findCandidates(moduleName);
  const best = candidates[0];

  if (best) {
    let lines = 0;
    try {
      lines = countLines(best.path);
    } catch (e) {
      // ok
    }
    return { exists: true, path: best.path, lines, candidates };
  }

  return { exists: false, path: null, lines: 0, candidates: [] };
}

function findCandidates(moduleName) {
  const candidates = [];

  // node_modules search
  let dir = process.cwd();
  let lastDir = null;
  while (dir !== lastDir) {
    const nmDir = path.join(dir, "node_modules");
    if (fs.existsSync(nmDir)) {
      // Scoped package: @scope/name
      if (moduleName.startsWith("@")) {
        const parts = moduleName.split("/");
        const scope = parts[0];
        const pkg = parts[1];
        if (parts.length >= 2) {
          const pkgDir = path.join(nmDir, scope, pkg);
          const pkgJson = path.join(pkgDir, "package.json");
          if (fs.existsSync(pkgJson)) {
            const target = getMainFile(pkgDir, pkgJson);
            if (target) {
              candidates.push({ path: target, source: "node_modules" });
            }
          }
          // Direct JS file
          const direct = path.join(nmDir, moduleName + ".js");
          if (fs.existsSync(direct)) {
            candidates.push({ path: direct, source: "node_modules" });
          }
        }
      } else {
        const pkgDir = path.join(nmDir, moduleName);
        const pkgJson = path.join(pkgDir, "package.json");
        if (fs.existsSync(pkgJson)) {
          const target = getMainFile(pkgDir, pkgJson);
          if (target) {
            candidates.push({ path: target, source: "node_modules" });
          }
        }
        // Direct JS file
        const direct = path.join(nmDir, moduleName + ".js");
        if (fs.existsSync(direct)) {
          candidates.push({ path: direct, source: "node_modules" });
        }
      }
    }
    lastDir = dir;
    dir = path.dirname(dir);
  }

  // Local path search (relative to CWD)
  const local = path.join(process.cwd(), moduleName + ".js");
  if (fs.existsSync(local)) {
    candidates.unshift({ path: local, source: "local" });
  }

  return candidates;
}

function getMainFile(pkgDir, pkgJsonPath) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
    const main = pkg.main || "index.js";
    const target = path.resolve(pkgDir, main);
    if (fs.existsSync(target)) return target;
    const withJs = target + ".js";
    if (fs.existsSync(withJs)) return withJs;
    const index = path.join(pkgDir, "index.js");
    if (fs.existsSync(index)) return index;
  } catch (e) {}
  return null;
}

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return content.split("\n").length;
  } catch (e) {
    return 0;
  }
}

// ---------- Utilities ----------

function getLineNumber(code, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < code.length; i++) {
    if (code[i] === "\n") line++;
  }
  return line;
}

function getColumnNumber(code, offset) {
  let col = 1;
  for (let i = offset - 1; i >= 0; i--) {
    if (code[i] === "\n") break;
    col++;
  }
  return col;
}

// ---------- Output ----------

function formatLocation(req) {
  return `${req.line}:${req.column}`;
}

function printReport(filePath, requires, code) {
  const issues = requires.filter((r) => !r.resolved);

  if (issues.length === 0) {
    return false; // no issues
  }

  console.error(`\n\x1b[1;31m${filePath}\x1b[0m`);

  for (const issue of issues) {
    const loc = formatLocation(issue);
    console.error(
      `\x1b[33m  ⚠ ${loc} \x1b[0;37mrequire(${issue.innerText})\x1b[0m`,
    );

    // Show candidates
    if (issue.candidates.length > 0) {
      for (let i = 0; i < issue.candidates.length; i++) {
        const c = issue.candidates[i];
        const relPath = c.source === "local"
          ? path.relative(process.cwd(), c.path)
          : path.relative(process.cwd(), c.path);
        console.error(
          `    \x1b[32m${i === 0 ? "►" : " "} Fix: \x1b[0;37m${relPath} \x1b[90m(${c.source})\x1b[0m`,
        );
      }
    } else {
      console.error(
        `    \x1b[31m✗ No matching module found\x1b[0m`,
      );
    }
  }

  return true;
}

function generateFixes(code, requires, replacementModule) {
  let fixedCode = code;
  const fixCount = { total: 0 };

  // Process in reverse order to preserve offsets
  const needsFix = requires
    .filter((r) => !r.resolved && r.candidates.length > 0)
    .sort((a, b) => b.innerStart - a.innerStart);

  for (const issue of needsFix) {
    let newModuleName = replacementModule;

    if (!newModuleName && issue.candidates.length > 0) {
      // Use the best candidate - just the npm package name (not full path)
      const bestPath = issue.candidates[0].path;
      // Extract npm package name from the full path
      newModuleName = extractNpmName(bestPath, issue.moduleName);
    }

    if (newModuleName) {
      const newReq = `require('${newModuleName}')`;
      fixedCode =
        fixedCode.slice(0, issue.innerStart) +
        newReq +
        fixedCode.slice(issue.innerEnd);
      fixCount.total++;
    }
  }

  return { fixedCode, fixCount };
}

function extractNpmName(candidatePath, originalName) {
  // Extract the npm package name from a resolved path
  // e.g., /.../node_modules/@anthropic-ai/sdk/index.js -> @anthropic-ai/sdk
  // e.g., /.../node_modules/lodash/index.js -> lodash

  const nmIdx = candidatePath.indexOf("node_modules");
  if (nmIdx !== -1) {
    const afterNm = candidatePath.slice(nmIdx + "node_modules".length + 1);
    // Handle scoped packages
    if (afterNm.startsWith("@")) {
      const parts = afterNm.split(path.sep);
      return parts[0] + "/" + parts[1];
    }
    // Handle regular packages
    const parts = afterNm.split(path.sep);
    return parts[0];
  }

  // Local file - try to derive a reasonable name
  // e.g., ./d.ts -> ./d (strip extension)
  const noExt = originalName.replace(/\.js$/, "").replace(/\.ts$/, "");
  return noExt;
}

// ---------- Main ----------

let totalIssues = 0;
let totalFiles = 0;
let fixedFiles = 0;

for (const filePath of files) {
  totalFiles++;
  let code;
  try {
    code = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error(`Error reading ${filePath}: ${err.message}`);
    continue;
  }

  let ast;
  try {
    ast = acorn.parse(code, {
      ecmaVersion: "latest",
      sourceType: "script",
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true,
      allowSuperOutsideMethod: true,
      allowHashBang: true,
      source: filePath,
    });
  } catch (err) {
    console.error(`Error parsing ${filePath}: ${err.message}`);
    continue;
  }

  const requires = findRequires(code, ast);
  const hasIssues = printReport(filePath, requires, code);

  if (hasIssues) {
    totalIssues += requires.filter((r) => !r.resolved).length;

    if (writeMode) {
      const { fixedCode, fixCount } = generateFixes(
        code,
        requires,
        replacementModule,
      );

      if (fixCount.total > 0) {
        if (!dryRun) {
          fs.writeFileSync(filePath, fixedCode, "utf8");
        }
        console.log(
          `  \x1b[32m${dryRun ? "[dry-run] " : ""}Fixed ${fixCount.total} require(s)\x1b[0m`,
        );
        fixedFiles++;
      }
    }
  }
}

// Summary
console.log("\n" + "─".repeat(50));
console.log(
  `\x1b[1;31m${totalIssues} error(s)\x1b[0m in \x1b[1;34m${totalFiles} file(s)\x1b[0m`,
);
if (writeMode) {
  console.log(`\x1b[32m${dryRun ? "[dry-run] " : ""}Fixed: ${fixedFiles} file(s)\x1b[0m`);
}
console.log("─".repeat(50));

process.exit(totalIssues > 0 ? 1 : 0);
