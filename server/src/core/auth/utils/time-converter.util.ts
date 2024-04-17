export const converteTimeToMilliseconds = (time: string): number => {
  const unitMap: Record<string, number> = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
  };

  const unit = time.slice(-1);
  const num = parseInt(time);

  if (Number.isNaN(num) || !unitMap?.[unit]) {
    throw new Error('Invalid time format');
  }

  return num * unitMap[unit];
};
