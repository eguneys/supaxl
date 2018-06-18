import * as PIXI from 'pixi.js';

export function sprites() {

  const tss = {};

  tiles(tss);
  borders(tss);
  hud(tss);

  return tss;
}

function hud(tss) {
  let texture = PIXI.utils.TextureCache['images/hud.png'];
  tss['hud'] = new PIXI.Texture(texture);

  texture = PIXI.utils.TextureCache['images/main_menu1.png'];
  tss['main_menu'] = new PIXI.Texture(texture);
}

function borders(tss) {
  const baseTexture = PIXI.utils.TextureCache['images/SupaplexBorder.png'];

  let rect = new PIXI.Rectangle(0, 0, 16, 16);
  let texture = new PIXI.Texture(baseTexture);
  texture.frame = rect;
  tss['borderTopLeft'] = texture;

  rect = new PIXI.Rectangle(0, 16, 16, 16);
  texture = new PIXI.Texture(baseTexture);
  texture.frame = rect;
  tss['borderLeft'] = texture;

  rect = new PIXI.Rectangle(0, 16 * 2, 16, 16);
  texture = new PIXI.Texture(baseTexture);
  texture.frame = rect;
  tss['borderBottomLeft'] = texture;

  rect = new PIXI.Rectangle(16 * 2, 0, 16, 16);
  texture = new PIXI.Texture(baseTexture);
  texture.frame = rect;
  tss['borderTopRight'] = texture;

  rect = new PIXI.Rectangle(16 * 2, 16, 16, 16);
  texture = new PIXI.Texture(baseTexture);
  texture.frame = rect;
  tss['borderRight'] = texture;

  rect = new PIXI.Rectangle(16 * 2, 16 * 2, 16, 16);
  texture = new PIXI.Texture(baseTexture);
  texture.frame = rect;
  tss['borderBottomRight'] = texture;

  rect = new PIXI.Rectangle(16 * 1, 0, 16, 16);
  texture = new PIXI.Texture(baseTexture);
  texture.frame = rect;
  tss['borderTop'] = texture;

  rect = new PIXI.Rectangle(16 * 1, 16 * 2, 16, 16);
  texture = new PIXI.Texture(baseTexture);
  texture.frame = rect;
  tss['borderBottom'] = texture;
}

function tiles (tss) {
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
      "hanged-zonk-roll-right": [1],
      "hanged-zonk-roll-left": [3],
      "zonk-roll-right": [0, 1, 2, 3, 4],
      "zonk-roll-left": [4, 3, 2, 1, 0] },
    { infotron: [0],
      "hanged-info-roll-right": [1],
      "hanged-info-roll-left": [7],
      "info-roll-right": frameIs,
      "info-roll-left": frameIs.reverse() },
    { infoVanish: frameIs },
    { infoExplode: frameIs },
    { explode: frameIs },
    { reddisk: [0],
      reddiskVanish: frameIs },
    { redTerminal: [0],
      redTerminalOn: frameIs },
    { greenTerminal: [0],
      greenTerminalOn: frameIs },
    { base: [0],
      baseVanish: frameIs },
    { baseBug: [2, 1, 3, 4, 5, 4, 3, 4, 5, 4, 3, 1, 2, 0],
      empty: [6],
      exit: [7]
    },
    { 
      hardware5: [0],
      hardware6: [1],
      hardware7: [2],
      hardware8: [3],
      hardware9: [4],
      hardware10: [5],
      yellowdisk: [6],
      orangedisk: [7]
    },
    { chipTop: [0],
      chipLeft: [1],
      chip: [2],
      hardware1: [3],
      hardware2: [4],
      hardware3: [5],
      hardware4: [6],
      wall: [7]
    },
    {
      chipBottom: [0],
      chipRight: [1],
      portVertical: [2],
      portAll: [3],
      portUp: [4],
      portDown: [4],
      portRight: [5],
      portLeft: [6],
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
      "murphy-push-left": [1],
      "murphy-push-right": [0],
      "murphySick": [2]
    },
    { "murphy-right": frameIs },
    { "murphy-left": frameIs },
    { murphyVanish: frameIs }
  ];

  const baseTexture = PIXI.utils.TextureCache['images/Supaplex32.png'];

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
