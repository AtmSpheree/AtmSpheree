export default function getShortDescription(description: string[], value: number): string[] {
  let result: string[] = [];
  let current_length: number = 0;
  for (let index = 0; index < description.length; index++) {
    if (current_length + description[index].length > value) {
      result.push(description[index].slice(0, value - (current_length + description[index].length)) + '...');
      break;
    } else {
      current_length += description[index].length;
      result.push(description[index]);
    }
  }
  return result;
};