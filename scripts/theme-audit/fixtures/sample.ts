import { basename } from "node:path";

export class Sample {
  readonly enabled: boolean = false;
  value(input: string): string {
    // Ordinary comment
    const name = basename(input);
    return this.enabled ? name : String(name.length);
  }
}
