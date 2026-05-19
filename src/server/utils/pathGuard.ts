import path from 'path';

/**
 * Guards against path traversal attacks.
 *
 * Returns the resolved absolute path if it is safely inside `root`,
 * or throws a 403-worthy error if the resolved path escapes the root.
 *
 * @param root   The trusted root directory (must be absolute).
 * @param unsafe The untrusted relative path from the client.
 * @returns      The safe absolute path.
 * @throws       Error with message 'PATH_TRAVERSAL' if the path escapes root.
 */
export function guardPath(root: string, unsafe: string): string {
  const resolved = path.resolve(root, unsafe);
  // Ensure the resolved path starts with root + separator (or equals root)
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (resolved !== root && !resolved.startsWith(rootWithSep)) {
    throw new Error('PATH_TRAVERSAL');
  }
  return resolved;
}
