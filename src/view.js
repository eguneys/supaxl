import { pContainer } from './asprite';
import { asprite } from './asprite' ;
import { pos2key, allPos } from './util';


function tDuration(tile) {
  return 1000;
}

function tFrame(textures, tile) {
  let frame = frames[tile.role];

  if (!frame) {
    frame = textures['empty'];
  } else {
    frame = textures[frame(tile)];
  }

  if (!frame) {
    throw 'no frame for tile ' + tile;
  }

  return frame;
}

const frames = {
    SNIKSNAK: (tile) => {
    return tile.moving > 0 ?
        ['sci', tile.facing].join('-'):
        ['sci', tile.facing, tile.preFace].join('-');
  },
  ZONK: (tile) => {
    if (tile.rolling > 0) {
      const hanged = tile.rolling === 3?'hanged-':'';
      return hanged + ['zonk', 'roll', tile.facing].join('-');
    }
    return 'zonk';
  },
  INFOTRON: (tile) => {
    if (tile.rolling > 0) {
      const hanged = tile.rolling === 3?'hanged ':'';
      return hanged + ['info', 'roll', tile.facing].join('-');
    }
    if (tile.vanishing > 0) {
      return 'infoVanish';
    }
    return 'infotron';
  },
  BASE: (tile) => {
    if (tile.vanishing > 0) {
      return 'baseVanish';
    }
    return 'base';
  },
  BUG: (tile) => {
    return tile.active > 0 ? `baseBug`:'base';
  },
  MURPHY: (tile) => {
    if (tile.pushing > 0) {
      return ['murphy', 'push', tile.facing].join('-');
    } else if (tile.moving > 0) {
      return ['murphy', tile.facingHorizontal].join('-');
    } else if (tile.snapping > 0) {
      return ['murphy', 'snap', tile.facing].join('-');
    }
    return 'murphy';
  }
};

export function renderWrap(ctrl, app, textures) {
  const container = pContainer();
  app.stage.addChild(container);

  const { tiles, measure } =  ctrl.data;

  const sprites = [];
  const lastByTile = {};

  allPos.forEach((pos) => {
    let offset = measure.offset,
        tilePos = [pos[0] + offset[0],
                   pos[1] + offset[1]];
    
    let tileKey = pos2key(tilePos);

    let tile = tiles[tileKey],
        sprite = asprite(tFrame(textures, tile),
                         tDuration(tile));

    sprites[pos2key(pos)] = sprite;

    sprite.position.set(pos[0] * 32,
                        pos[1] * 32);

    lastByTile[tileKey] = sprite.lastTime;

    container.addChild(sprite);

  });

  return () => {
    let { offset, edgeOffset } = measure;

    if (edgeOffset) {
      container.position.set(-32 + edgeOffset[0] * 32,
                             -32 + edgeOffset[1] * 32);
    }

    let viewTween = ctrl.data.viewTween,
        edgeTween = ctrl.data.edgeTween;

    if (edgeTween) {
      container.position.set(
        container.position.x - edgeTween[1][0],
        container.position.y - edgeTween[1][1]);
    }


    allPos.forEach((pos) => {
      let tilePos = [pos[0] + offset[0],
                     pos[1] + offset[1]];

      let tileKey = pos2key(tilePos);

      let tile = tiles[tileKey],
          sprite = sprites[pos2key(pos)];

      sprite.setTextures(tFrame(textures, tile),
                         tDuration(tile));

      sprite.position.set(pos[0] * 32,
                          pos[1] * 32);

      let tween = ctrl.data.tweens[tileKey];

      if (tween) {
        container.setChildIndex(sprite, container.children.length - 1);

        sprite.position.set(
          sprite.position.x + tween[1][0],
          sprite.position.y + tween[1][1]);
      }

      if (viewTween) {
        sprite.position.set(
          sprite.position.x + viewTween[1][0],
          sprite.position.y + viewTween[1][1]);
      }

      if (lastByTile[tileKey]) {
        sprite.lastTime = lastByTile[tileKey];
      }

      sprite.update();
      lastByTile[tileKey] = sprite.lastTime;
    });
  
  };
}
