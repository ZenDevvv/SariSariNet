import fs from "fs";
import path from "path";

const root = process.cwd();
const schemaDir = path.join(root, "prisma", "schema");
const outDir = path.join(root, "zod", "modules");

const targetFiles = [
  "user.prisma",
  "auth-session.prisma",
  "account-recovery-token.prisma",
  "account-status-event.prisma",
  "connection-request.prisma",
  "connection.prisma",
  "connection-notification.prisma",
  "organization.prisma",
  "organization-membership.prisma",
  "organization-invite.prisma",
  "organization-join-request.prisma",
  "product-listing.prisma",
  "listing-lifecycle-event.prisma",
  "suggestion-layout-preference.prisma",
  "transaction.prisma",
  "transaction-invoice.prisma",
  "transaction-adjustment.prisma",
  "borrowing-record.prisma",
  "repayment.prisma",
  "settlement-note.prisma",
  "borrowing-audit-entry.prisma",
  "commerce-metric-snapshot.prisma",
  "borrowing-metric-snapshot.prisma",
  "report-view-preset.prisma",
  "report-export-job.prisma",
];

const scalarTypes = new Set([
  "String",
  "Int",
  "Float",
  "Boolean",
  "DateTime",
  "Json",
  "Decimal",
  "BigInt",
  "Bytes",
]);

function pascalFromKebab(file) {
  return file
    .replace(/\.prisma$/, "")
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function camelFromPascal(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function pluralize(camel) {
  if (camel.endsWith("s")) return `${camel}es`;
  if (camel.endsWith("y")) return `${camel.slice(0, -1)}ies`;
  return `${camel}s`;
}

function parseEnums(content) {
  const enums = [];
  const enumRegex = /enum\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let match;
  while ((match = enumRegex.exec(content))) {
    const [, name] = match;
    enums.push(name);
  }
  return enums;
}

function parseModels(content) {
  const models = [];
  const modelRegex = /model\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let match;
  while ((match = modelRegex.exec(content))) {
    const [, name, body] = match;
    const fields = [];
    const lines = body
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("@@") && !l.startsWith("//"));

    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length < 2) continue;
      const fieldName = parts[0];
      const rawType = parts[1];
      const isList = rawType.endsWith("[]");
      const typeNoList = isList ? rawType.slice(0, -2) : rawType;
      const optional = typeNoList.endsWith("?");
      const baseType = optional ? typeNoList.slice(0, -1) : typeNoList;
      const rest = parts.slice(2).join(" ");

      fields.push({
        name: fieldName,
        baseType,
        optional,
        isList,
        isObjectId: rest.includes("@db.ObjectId"),
      });
    }

    models.push({ name, fields });
  }
  return models;
}

function zodForField(field, allEnums) {
  let base;
  const type = field.baseType;

  if (scalarTypes.has(type)) {
    if (field.isList) {
      if (type === "String") base = "z.array(z.string())";
      else if (type === "Int") base = "z.array(z.number().int())";
      else if (type === "Float" || type === "Decimal") base = "z.array(z.number())";
      else if (type === "Boolean") base = "z.array(z.boolean())";
      else if (type === "DateTime") base = "z.array(z.coerce.date())";
      else if (type === "Json") base = "z.array(z.unknown())";
      else if (type === "BigInt") base = "z.array(z.bigint())";
      else base = "z.array(z.unknown())";
    } else {
      if (type === "String") {
        base = field.isObjectId
          ? "z.string().refine((value) => isValidObjectId(value), { message: \"Invalid ObjectId\" })"
          : "z.string()";
      } else if (type === "Int") {
        base = "z.number().int()";
      } else if (type === "Float" || type === "Decimal") {
        base = "z.number()";
      } else if (type === "Boolean") {
        base = "z.boolean()";
      } else if (type === "DateTime") {
        base = "z.coerce.date()";
      } else if (type === "Json") {
        base = "z.unknown()";
      } else if (type === "BigInt") {
        base = "z.bigint()";
      } else {
        base = "z.unknown()";
      }
    }
  } else if (allEnums.has(type)) {
    base = field.isList ? `z.array(z.nativeEnum(${type}))` : `z.nativeEnum(${type})`;
  } else {
    return null;
  }

  if (field.optional) {
    return `${base}.optional().nullable()`;
  }

  return base;
}

function main() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const allEnumNames = new Set();
  const modelByFile = new Map();

  for (const file of targetFiles) {
    const full = path.join(schemaDir, file);
    const content = fs.readFileSync(full, "utf8");
    parseEnums(content).forEach((e) => allEnumNames.add(e));
    modelByFile.set(file, parseModels(content));
  }

  for (const file of targetFiles) {
    const models = modelByFile.get(file) || [];
    for (const model of models) {
      const modelName = model.name;
      const modelCamel = camelFromPascal(modelName);
      const pluralCamel = pluralize(modelCamel);
      const baseName = file.replace(/\.prisma$/, "");
      const outFile = path.join(outDir, `${baseName}.zod.ts`);

      const fieldEntries = model.fields
        .map((field) => {
          const zExpr = zodForField(field, allEnumNames);
          if (!zExpr) return null;
          return { name: field.name, baseType: field.baseType, optional: field.optional, line: `\t${field.name}: ${zExpr},` };
        })
        .filter(Boolean);

      const scalarFieldNames = new Set(fieldEntries.map((entry) => entry.name));

      const fields = fieldEntries.map((entry) => entry.line).join("\n");

      const optionalCreate = fieldEntries
        .filter((f) => f.optional || f.name === "isDeleted")
        .map((f) => `\t${f.name}: true,`)
        .join("\n");

      const omitCreateList = ["id", "createdAt", "updatedAt"]
        .filter((name) => scalarFieldNames.has(name))
        .map((name) => `\t${name}: true,`)
        .join("\n");

      const omitUpdateList = ["id", "createdAt", "updatedAt", "isDeleted"]
        .filter((name) => scalarFieldNames.has(name))
        .map((name) => `\t${name}: true,`)
        .join("\n");

      const usedEnums = [...allEnumNames].filter((enumName) => {
        return fieldEntries.some((f) => f.baseType === enumName);
      });

      const enumImportLine =
        usedEnums.length > 0
          ? `import { ${usedEnums.join(", ")} } from "../../generated/prisma";\n`
          : "";

      const content = `import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
${enumImportLine}
export const ${modelName}Schema = z.object({
${fields}
});

export const Create${modelName}Schema = ${modelName}Schema.omit({
${omitCreateList}
}).partial({
${optionalCreate}
});

export const Update${modelName}Schema = ${modelName}Schema.omit({
${omitUpdateList}
}).partial();

export const GetAll${modelName}sSchema = z.object({
\t${pluralCamel}: z.array(${modelName}Schema),
\tpagination: PaginationSchema.optional(),
\tcount: z.number().optional(),
});

export type ${modelName} = z.infer<typeof ${modelName}Schema>;
export type Create${modelName} = z.infer<typeof Create${modelName}Schema>;
export type Update${modelName} = z.infer<typeof Update${modelName}Schema>;
`;

      fs.writeFileSync(outFile, content, "utf8");
      console.log(`generated ${path.relative(root, outFile)}`);
    }
  }
}

main();
