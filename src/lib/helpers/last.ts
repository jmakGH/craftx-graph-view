const last = <T>(array: T[], callback: (item: T) => void): void =>
  callback(array[array.length - 1]);

export default last;
