/**
 * variableResolver.ts
 *
 * Resolves {{variable}} placeholders in strings against an environment variable map.
 * Handles nested variables and provides warnings for missing keys.
 */

const VARIABLE_PATTERN = /\{\{([^{}]+)\}\}/g;

/**
 * Resolve all {{key}} placeholders in `input` using `vars`.
 * Returns the resolved string and a list of unresolved variable names.
 */
export function resolveVariables(
  input: string,
  vars: Record<string, string>
): { resolved: string; missing: string[] } {
  const missing: string[] = [];

  const resolved = input.replace(VARIABLE_PATTERN, (_match, key: string) => {
    const trimmed = key.trim();
    if (Object.prototype.hasOwnProperty.call(vars, trimmed)) {
      return vars[trimmed];
    }
    missing.push(trimmed);
    return _match; // leave unresolved placeholder intact
  });

  return { resolved, missing };
}

/**
 * Resolve all variables in a URL including query params.
 */
export function resolveUrl(url: string, vars: Record<string, string>): string {
  return resolveVariables(url, vars).resolved;
}

/**
 * Resolve all variables in a Record<string, string> object (e.g. headers/params).
 */
export function resolveRecord(
  record: Record<string, string>,
  vars: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [
      resolveVariables(k, vars).resolved,
      resolveVariables(v, vars).resolved,
    ])
  );
}

/**
 * Extract all variable names used in a string.
 */
export function extractVariables(input: string): string[] {
  const matches: string[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(VARIABLE_PATTERN.source, 'g');
  while ((m = re.exec(input)) !== null) {
    matches.push(m[1].trim());
  }
  return [...new Set(matches)];
}

/**
 * Returns true if the string contains unresolved variable placeholders.
 */
export function hasUnresolvedVars(input: string, vars: Record<string, string>): boolean {
  const { missing } = resolveVariables(input, vars);
  return missing.length > 0;
}
