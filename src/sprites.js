import * as PIXI from 'pixi.js';

export function sprites() {

  const frameIs = [0, 1, 2, 3, 4, 5, 6, 7];

  
  
  const frames = [
    {
      "sci-left-left": [3],
      "sci-right-right": [7],
      "sci-up-up": [1],
      "sci-down-down": [5],
      "sci-up-right": [0],
      "sci-right-up": [0],
      "sci-up-left": [2],
      "sci-left-up": [2],
      "sci-down-left": [4],
      "sci-left-down": [4],
      "sci-down-right": [6],
      "sci-right-down": [6]
    },
    { "sci-up": frameIs },
    { "sci-down": frameIs },
    { "sci-left": frameIs },
    { "sci-right": frameIs },
    { zonk: [0],
      "hanged-zonk": [1],
      "zonk-roll-right": frameIs,
      "zonk-roll-left": frameIs.reverse() },
    { infotron: [0],
      "info-roll-right": frameIs,
      "info-roll-left": frameIs.reverse() },
    { infoVanish: frameIs },
    { infoExplode: frameIs },
    { explode: frameIs },
    { disk: [0],
      diskVanish: frameIs },
    { redTerminal: [0],
      redTerminalOn: frameIs },
    { greenTerminal: [0],
      greenTerminalOn: frameIs },
    { base: [0],
      baseVanish: frameIs },
    { baseBug: [0, 1, 2, 3, 4],
      empty: [6],
      exit: [7]
    },
    { yellowDisk: [6] },
    { chip: [0] },
    { portVertical: [2],
      portAll: [3],
      portUp: [4],
      portLeft: [5],
      portRight: [6],
      portHorizontal: [7]
    },
    {
      electron: frameIs
    },
    {
      murphy: [0],
      murphyYawn: frameIs
    },
    { 
      murphyYawn2: frameIs
    },
    {
      "murphy-snap-right": [0],
      "murphy-snap-left": [1],
      "murphy-snap-up": [2],
      "murphy-snap-down": [3] },
    {
      "murphy-push-left": [0],
      "murphy-push-right": [1],
      "murphySick": [2]
    },
    { "murphy-right": frameIs },
    { "murphy-left": frameIs },
    { murphyVanish: frameIs }
  ];

  const baseTexture = PIXI.utils.TextureCache['images/Supaplex32.png'];

  const tss = {};

  for (var col = 0; col < frames.length; col++) {
    var obj = frames[col];


    for (var key in obj) {
      let rows = obj[key];

      let textures = rows.map((row) => {
        let posX = row * 32;
        let posY = col * 32;
        
        let rect = new PIXI.Rectangle(posX, posY, 32, 32);
        let texture = new PIXI.Texture(baseTexture);
        texture.frame = rect;
        return texture;
      });

      tss[key] = textures;
    }

  }

  return tss;
}
