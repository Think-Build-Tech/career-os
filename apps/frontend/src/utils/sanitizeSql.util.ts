export function sanitizeInput(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .normalize("NFKC")                 // fold lookalike Unicode characters
    .replace(/\0/g, "")                // strip null bytes
    .replace(/(--|\/\*|\*\/|;)/g, "")  // SQL comments and statement separators
    .replace(/['"`\\]/g, "")           // quotes and backslashes
    .replace(/\b(union|select|insert|update|delete|drop|alter|exec|execute|truncate|xp_\w+)\b/gi, "")
    .trim();
}