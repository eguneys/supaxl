import * as decisions from './decisions';


export function decisionTerminal(data, pos) {
  const tile = data.tiles[pos];

  if (data.terminal) {
    explode(data, pos);
  }
}

function explode(data, pos) {
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
    .forEach((tile) => {
    
    tile.role = 'EXPLOSION';
    tile.nextDecision = decisionExplode2;
  });

}

function decisionExplode2(data, pos) {
  const tile = data.tiles[pos];

  tile.nextDecision = decisionExplodeEnd;
}

function decisionExplodeEnd(data, pos) {
  const tile = data.tiles[pos];

  tile.role = 'EMPTY';
}
