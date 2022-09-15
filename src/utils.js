export const getVideoType = (src) => {
  // 通过 url 判断视频类型，不一定准确，用户填写的类型优先级更高
  let type= 'normal'
  if (/m3u8(#|\?|$)/i.exec(src)) {
      type = 'hls';
  } else if (/.flv(#|\?|$)/i.exec(src)) {
      type = 'flv';
  } else if (/.mpd(#|\?|$)/i.exec(src)) {
      type = 'dash';
  }
  return type
}