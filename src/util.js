import * as Constants from './data';

const { MAP_HEIGHT, MAP_WIDTH } = Constants;

const padZeros = new Array(5).join('0');

function padZero(text, upto) {
  const diff = upto - (text+'').length;
  return padZeros.substr(0, diff) + text;
}

function pos2key(pos) {
  return pos[1] * MAP_WIDTH + pos[0];
}

function key2pos(key) {
  return [key % MAP_WIDTH, Math.floor(key / MAP_WIDTH)];
}

const allPos = (function(width, height) {
  const ps = [];
  for (var y = 0; y<height; y++) {
    for (var x = 0; x<width; x++) {
      ps.push([x, y]);
    }
  }
  return ps;
})(Constants.VIEW_WIDTH, Constants.VIEW_HEIGHT);



export {
  padZero,
  pos2key,
  key2pos,
  allPos
};
