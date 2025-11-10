type ArrayRGBA = [number, number, number, number]

export function getRGBA(color: string): ArrayRGBA {
  return color.split('(')[1].split(')')[0].split(', ').map((item: string): number => parseFloat(item)) as ArrayRGBA
}

export function convertRGBAToString(color: ArrayRGBA): string {
  return `rgba(${color.join(', ')})`;
}

export function getAlphaColor(color: string): string {
  return `rgba(${color.split('(')[1].split(')')[0].split(', ').slice(0, -1).join(', ')}, 0)`;
}

function makeGradient(color_1: string, color_2: string, time: number, time_step: number): Array<string> {
  let result: Array<ArrayRGBA> = [];
  let iterations: number = Math.floor(time / time_step);
  let color_1_rgba: ArrayRGBA = getRGBA(color_1);
  let color_2_rgba: ArrayRGBA = getRGBA(color_2);
  let color_step: ArrayRGBA = color_1_rgba.map((value: number, index_value: number): number => {
    return Math.abs(color_2_rgba[index_value] - value) / iterations;
  }) as ArrayRGBA;
  for (let index: number = 0; index < (iterations + 1); index++) {
    result.push(color_1_rgba.map((value: number, index_value: number): number => {
      return index_value === 3 ?
        (value - color_2_rgba[index_value] <= 0 ?
          Math.round((value + (color_step[index_value] * index)) * 10) / 10
        : 
          Math.round((value - (color_step[index_value] * index)) * 10) / 10)
      :
        (value - color_2_rgba[index_value] < 0 ?
          Math.round(value + (color_step[index_value] * (index + 1)))
        : 
          Math.round(value - (color_step[index_value] * index)));
    }) as ArrayRGBA);
  }
  return result.map((item: ArrayRGBA): string => convertRGBAToString(item));
}

export default makeGradient;