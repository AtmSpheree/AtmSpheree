import type { ColorGradients } from "../static";

export default function reverseColorGradients(object: Record<string, string[]>): ColorGradients {
  return Object.fromEntries(Object.entries(object).map(([key, values]) => [key, values.reverse()]));
}