const exceptLast = <T>(array: T[], callback: (item: T) => void): void =>
  array.slice(0, -1).forEach((item) => callback(item));

export default exceptLast;
