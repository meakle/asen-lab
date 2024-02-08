const config = {  
  Weight: [100, 1000],
  Grade: [-200, 150],
};

let weight = 100;
let grade = -200;

export const mouseManager = (event: MouseEvent) => {
  const { x, y } = event;
  const { innerHeight, innerWidth } = window;

  const xx  = x / innerWidth;
  const yy = y / innerHeight;

  weight = config.Weight[0] + (config.Weight[1] - config.Weight[0]) * yy;
  grade = config.Grade[0] + (config.Grade[1] - config.Grade[0]) * xx;
};

export const getVariationSettingsCSS = () => {
  const str = `"wght" ${weight}, "wdth" 100, "opsz" 48, "slnt" -10, "GRAD" ${grade};`
  const prefix = 'font-variation-settings: ';

  return prefix + str;
};
