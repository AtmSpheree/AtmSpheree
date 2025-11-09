import { sleep } from "./sleep";

const root: HTMLElement = document.documentElement;

export default async function animateProperty(property: string, states: Array<string>) {
  for (const item of states) {
    root.style.setProperty(property, item);
    await sleep(10);
  }
}