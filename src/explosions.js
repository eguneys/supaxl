import * as decisions from './decisions';
import * as anim from './anim';


export function decisionTerminal(data, pos) {
  const tile = data.tiles[pos];

  if (data.terminal) {
    explode(data, pos);
  }
}

export function decisionExplodeExit(data, pos) {
  explode(data, pos);
}

export function explode(data, pos) {
  const { posNeighbor } = decisions;
  const tile = data.tiles[pos];

  const explosions = [
    pos,
    posNeighbor(pos, 'up'),
    posNeighbor(pos, 'down'),
    posNeighbor(pos, 'left'),
    posNeighbor(pos, 'right'),

    posNeighbor(posNeighbor(pos, 'up'), 'right'),
    posNeighbor(posNeighbor(pos, 'up'), 'left'),
    posNeighbor(posNeighbor(pos, 'down'), 'right'),
    posNeighbor(posNeighbor(pos, 'down'), 'left'),
];

  explosions
    .map((key) => data.tiles[key])
    .forEach((etile) => {
      if (!etile) return;

      etile.prevRole = etile.prevRole || etile.role;
      etile.cause = tile.prevRole;
      etile.role = 'EXPLOSION';
      etile.explosion = 0;
      etile.nextDecision = decisionExplode2;
  });

}

function decisionExplode2(data, pos) {
  const tile = data.tiles[pos];

  tile.explosion++;

  if (tile.explosion === 3) {
    if (tile.chainExplode) {
      tile.chainExplode = false;
      explode(data, pos);
    }
  }

  if (tile.explosion === 6) {
    if (tile.prevRole === 'MURPHY') {
      anim.fadeToView(data, 'MENU', 1000, 1);
    }
    tile.nextDecision = decisionExplodeEnd;
  }
}

function decisionExplodeEnd(data, pos) {
  const tile = data.tiles[pos];

  if (tile.cause === 'ELECTRON') {
    tile.role = 'INFOTRON';
    tile.eatable = true;
    tile.round = true;
    tile.explodable = false;
    tile.chainExplode = true;
    delete tile.nextDecision;
    tile.decision = 'decisionFall';
    tile.isTrail = false;
    tile.moving = 0;
    tile.falling = 0;
  } else {
    tile.role = 'EMPTY';
    tile.isTrail = false;
  }
}
