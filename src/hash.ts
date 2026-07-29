import { createHash, randomUUID } from "node:crypto";

export function sha256(content: string | Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

export function newId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}
