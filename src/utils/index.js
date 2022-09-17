export const parseTime = (seconds) => {
  // 将秒数转换为时：分：秒
  const sec = String(Math.floor(seconds % 60));
  seconds /= 60;
  const min = String(Math.floor(seconds % 60));
  seconds /= 60;
  const hour = String(Math.floor(seconds % 60));
  return `${hour.padStart('0', 2)}:${min.padStart('0', 2)}:${sec.padStart(
    '0',
    2,
  )}`;
};
