export type RGB = [number, number, number];

export interface HSL {
  h: number;
  s: number;
  l: number;
}

type Matrix3x3 = [
  number, number, number,
  number, number, number,
  number, number, number
];

type FilterVector = [number, number, number, number, number, number];

interface SolverState {
  values: FilterVector;
  loss: number;
}

export class Color {
  private _r = 0;
  private _g = 0;
  private _b = 0;

  constructor(r: number, g: number, b: number) {
    this.set(r, g, b);
  }

  get r(): number {
    return this._r;
  }

  get g(): number {
    return this._g;
  }

  get b(): number {
    return this._b;
  }

  toString(): string {
    return `rgb(${Math.round(this._r)}, ${Math.round(this._g)}, ${Math.round(this._b)})`;
  }

  set(r: number, g: number, b: number): void {
    this._r = this.clamp(r);
    this._g = this.clamp(g);
    this._b = this.clamp(b);
  }

  hueRotate(angle = 0): void {
    const rad = (angle / 180) * Math.PI;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    this.multiply([
      0.213 + cos * 0.787 - sin * 0.213,
      0.715 - cos * 0.715 - sin * 0.715,
      0.072 - cos * 0.072 + sin * 0.928,
      0.213 - cos * 0.213 + sin * 0.143,
      0.715 + cos * 0.285 + sin * 0.140,
      0.072 - cos * 0.072 - sin * 0.283,
      0.213 - cos * 0.213 - sin * 0.787,
      0.715 - cos * 0.715 + sin * 0.715,
      0.072 + cos * 0.928 + sin * 0.072,
    ] as Matrix3x3);
  }

  grayscale(value = 1): void {
    this.multiply([
      0.2126 + 0.7874 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 + 0.2848 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 + 0.9278 * (1 - value),
    ] as Matrix3x3);
  }

  sepia(value = 1): void {
    this.multiply([
      0.393 + 0.607 * (1 - value),
      0.769 - 0.769 * (1 - value),
      0.189 - 0.189 * (1 - value),
      0.349 - 0.349 * (1 - value),
      0.686 + 0.314 * (1 - value),
      0.168 - 0.168 * (1 - value),
      0.272 - 0.272 * (1 - value),
      0.534 - 0.534 * (1 - value),
      0.131 + 0.869 * (1 - value),
    ] as Matrix3x3);
  }

  saturate(value = 1): void {
    this.multiply([
      0.213 + 0.787 * value,
      0.715 - 0.715 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 + 0.285 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 - 0.715 * value,
      0.072 + 0.928 * value,
    ] as Matrix3x3);
  }

  brightness(value = 1): void {
    this.linear(value);
  }

  contrast(value = 1): void {
    this.linear(value, -(0.5 * value) + 0.5);
  }

  invert(value = 1): void {
    this._r = this.clamp((value + (this._r / 255) * (1 - 2 * value)) * 255);
    this._g = this.clamp((value + (this._g / 255) * (1 - 2 * value)) * 255);
    this._b = this.clamp((value + (this._b / 255) * (1 - 2 * value)) * 255);
  }

  hsl(): HSL {
    const r = this._r / 255;
    const g = this._g / 255;
    const b = this._b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: h * 100,
      s: s * 100,
      l: l * 100,
    };
  }

  private multiply(matrix: Matrix3x3): void {
    const newR = this.clamp(this._r * matrix[0] + this._g * matrix[1] + this._b * matrix[2]);
    const newG = this.clamp(this._r * matrix[3] + this._g * matrix[4] + this._b * matrix[5]);
    const newB = this.clamp(this._r * matrix[6] + this._g * matrix[7] + this._b * matrix[8]);
    this._r = newR;
    this._g = newG;
    this._b = newB;
  }

  private linear(slope = 1, intercept = 0): void {
    this._r = this.clamp(this._r * slope + intercept * 255);
    this._g = this.clamp(this._g * slope + intercept * 255);
    this._b = this.clamp(this._b * slope + intercept * 255);
  }

  private clamp(value: number): number {
    if (value > 255) {
      return 255;
    }
    if (value < 0) {
      return 0;
    }
    return value;
  }
}

export class Solver {
  private readonly target: Color;
  private readonly targetHSL: HSL;
  private readonly reusedColor: Color;

  constructor(target: Color, baseColor: Color = new Color(0, 0, 0)) {
    this.target = target;
    this.targetHSL = target.hsl();
    this.reusedColor = baseColor;
  }

  solve(): { values: FilterVector; loss: number; filter: string } {
    const result = this.solveNarrow(this.solveWide());
    return {
      values: result.values,
      loss: result.loss,
      filter: this.css(result.values),
    };
  }

  private solveWide(): SolverState {
    const A = 5;
    const c = 15;
    const a: FilterVector = [60, 180, 18000, 600, 1.2, 1.2];
    let best: SolverState = { values: [0, 0, 0, 0, 0, 0], loss: Infinity };

    for (let i = 0; best.loss > 25 && i < 3; i++) {
      const initial: FilterVector = [50, 20, 3750, 50, 100, 100];
      const result = this.spsa(A, a, c, initial, 1000);
      if (result.loss < best.loss) {
        best = result;
      }
    }

    return best;
  }

  private solveNarrow(wide: SolverState): SolverState {
    const A = wide.loss;
    const c = 2;
    const A1 = A + 1;
    const a: FilterVector = [
      0.25 * A1,
      0.25 * A1,
      A1,
      0.25 * A1,
      0.2 * A1,
      0.2 * A1,
    ];
    return this.spsa(A, a, c, wide.values, 500);
  }

  private spsa(A: number, a: FilterVector, c: number, values: FilterVector, iters: number): SolverState {
    const alpha = 1;
    const gamma = 0.16666666666666666;

    let bestValues: FilterVector = values.slice(0) as FilterVector;
    let bestLoss = Infinity;
    const deltas = new Array<number>(6);
    const highArgs = new Array<number>(6);
    const lowArgs = new Array<number>(6);

    const fix = (value: number, idx: number): number => {
      let max = 100;
      if (idx === 2) {
        max = 7500;
      } else if (idx === 4 || idx === 5) {
        max = 200;
      }

      if (idx === 3) {
        if (value > max) {
          return value % max;
        }
        if (value < 0) {
          return max + (value % max);
        }
        return value;
      }

      if (value < 0) {
        return 0;
      }
      if (value > max) {
        return max;
      }
      return value;
    };

    for (let k = 0; k < iters; k++) {
      const ck = c / Math.pow(k + 1, gamma);
      for (let i = 0; i < 6; i++) {
        deltas[i] = Math.random() > 0.5 ? 1 : -1;
        highArgs[i] = values[i] + ck * deltas[i];
        lowArgs[i] = values[i] - ck * deltas[i];
      }

      const lossDiff = this.loss(highArgs as FilterVector) - this.loss(lowArgs as FilterVector);
      for (let i = 0; i < 6; i++) {
        const g = (lossDiff / (2 * ck)) * deltas[i];
        const ak = a[i] / Math.pow(A + k + 1, alpha);
        values[i] = fix(values[i] - ak * g, i) as FilterVector[number];
      }

      const loss = this.loss(values);
      if (loss < bestLoss) {
        bestValues = values.slice(0) as FilterVector;
        bestLoss = loss;
      }
    }

    return { values: bestValues, loss: bestLoss };
  }

  private loss(filters: FilterVector): number {
    const color = this.reusedColor;
    color.set(0, 0, 0);

    color.invert(filters[0] / 100);
    color.sepia(filters[1] / 100);
    color.saturate(filters[2] / 100);
    color.hueRotate(filters[3] * 3.6);
    color.brightness(filters[4] / 100);
    color.contrast(filters[5] / 100);

    const colorHSL = color.hsl();
    return (
      Math.abs(color.r - this.target.r) +
      Math.abs(color.g - this.target.g) +
      Math.abs(color.b - this.target.b) +
      Math.abs(colorHSL.h - this.targetHSL.h) +
      Math.abs(colorHSL.s - this.targetHSL.s) +
      Math.abs(colorHSL.l - this.targetHSL.l)
    );
  }

  private css(filters: FilterVector): string {
    const fmt = (idx: number, multiplier = 1) => Math.round(filters[idx] * multiplier);
    return `filter: invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%);`;
  }
}

export function hexToRgb(hex: string): RGB | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const expandedHex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expandedHex);

  if (!match) {
    return null;
  }

  return [
    parseInt(match[1], 16),
    parseInt(match[2], 16),
    parseInt(match[3], 16),
  ];
}
