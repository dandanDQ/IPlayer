export const parseTime = (seconds) => {
  // 将秒数转换为时：分：秒
  const sec = String(Math.floor(seconds % 60));
  seconds /= 60;
  const min = String(Math.floor(seconds % 60));
  seconds /= 60;
  const hour = String(Math.floor(seconds % 60));
  // 如果没到小时，就不展示小时的，节省空间
  return hour !== '0'
    ? `${hour.padStart(2, '0')}:${min.padStart(2, '0')}:
  ${sec.padStart(2, '0')}`
    : `${min.padStart(2, '0')}:
  ${sec.padStart(2, '0')}`;
};
