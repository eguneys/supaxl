import * as levels from './levels';
import * as rolls from './rolls';
import * as explosions from './explosions';
import * as Constants from './data';
import * as util from './util';
import * as anim from './anim';

import { bounds } from './bounds';

const { MAP_HEIGHT, MAP_WIDTH } = Constants;

function emptyTile(data, pos, toPos) {
  if (data.tiles[pos].role === 'INFOTRON') {
    data.infotronsNeeded--;
  }

  if (toPos && data.tiles[toPos].vomitted) {
    data.tiles[pos] = levels.makeRole(0x28);
    data.tiles[pos].nextDecision = explosions.decisionExplodeWait;

    data.tiles[toPos].vomitted = false;
    data.tiles[toPos].bombs--;
  } else {
    data.tiles[pos] = levels.makeRole(0);
  }
}

/* // vanish 1
     // vanish 2
   // vanish 2
     // clear
 */

function decisionVanish2(data, pos) {
  vanish2(data, pos);
}

function decisionVanishClear(data, pos) {
  vanishClear(data, pos);
}

function vanish1(data, pos) {
  const tile = data.tiles[pos];

  tile.vanishing = 1;
  tile.nextDecision = decisionVanish2;
}

function vanish2(data, pos) {
  const tile = data.tiles[pos];
  tile.vanishing = 2;
  tile.nextDecision = decisionVanishClear;
}

function vanishClear(data, pos) {
  const tile = data.tiles[pos];
  // tile.vanishing = 0;
  // delete tile.nextDecision;
  emptyTile(data, pos);
}

/*
   // port 1
     // port 2
   // port 2
     // clear
 */

function decisionPort2(data, pos) {
  port2(data, pos);
}

function decisionPortClear(data, pos) {
  portClear(data, pos);
}

function port1(data, pos, dir, portPos) {
  const tile = data.tiles[pos];
  const portTile = data.tiles[portPos];

  tile.frame = data.frame;
  tile.porting = 1;
  tile.portTile = portTile;
  addTween(data, `port${tile.key}`, Move[dir].a);

  tile.nextDecision = decisionPort2;
}

function port2(data, pos) {
  const tile = data.tiles[pos];

  tile.porting = 2;
  tile.nextDecision = decisionPortClear;
}

function portClear(data, pos) {
  const tile = data.tiles[pos];

  tile.porting = 0;
  delete tile.nextDecision;
}

/*
   // morphyStand // move 2 // push 2 // push move 2 // eat move 2
     // switch input
       // move
       // push
       // stand
   // move
     // move 2
   // push
     // push 2
   // push move
     // push move 2
   // eat move
     // eat move 2
 */


function decisionInput(data, pos) {
  const tile = data.tiles[pos];

  const inputs = data.inputs;

  const dirs = ['left', 'right', 'up', 'down'];
  const space = 'space';
  const enter = 'enter';
  const escape = 'escape';
  const currentLevel = data.levelData.levels[data.selectedLevel];

  if (inputs[enter]) {
    toggleHUD(data);
  }

  if (inputs[escape]) {
    // explode
    // transition
    // anim.fadeToView(data, 'MENU', 0, 1);
    explosions.explode(data, pos);
    return;
  }

  let handled =
  dirs.some((dir) => {
    if (inputs[dir]) {
      if (inputs[space]) {
        if(canSnap(data, pos, dir)) {
          morphySnap(data, pos, dir);
        } else {
          return false;
        }
      } else if (canEat(data, pos, dir)) {
        morphyEatMove(data, pos, dir);
      } else if (canGo(data, pos, dir)) {

        if (currentLevel.gravity && canFall(data, pos)) {
          morphyFall(data, pos);
        } else {
          morphyMove(data, pos, dir);
       }
      } else if (canPort(data, pos, dir)) {
        const portPos = posNeighbor(pos, dir);
        const nextPos = posNeighbor(portPos, dir);
        morphyMove(data, pos, dir, nextPos);

        port1(data, portPos, dir, nextPos);
      } else if (canPush(data, pos, dir)) {
        if (canPushMove(data, pos, dir)) {
          morphyPushMove(data, pos, dir);
        } else {
          morphyPush(data, pos, dir);
        }
      } else if (canRoundClash(data, pos, dir)) {
        explosions.explode(data, pos);
      } else if (canTerminal(data, pos, dir)) {
        morphyTerminal(data, pos, dir);
      } else if (canExit(data, pos, dir)) {
        morphyExit(data, pos);
      } else {
        return false;
      }
      return true;
    }
    return false;
  });

  if (!handled) {
    if (currentLevel.gravity && canFall(data, pos)) {
      handled = true;
      morphyFall(data, pos);
    }
    if (inputs[space]) {
      if (canVomit(data, pos)) {
        handled = true;
        morphyVomit(data, pos);
      } else if (canBeginVomit(data, pos)) {
        handled = true;
        morphyBeginVomit(data, pos);
      }
    }
  }

  if (!handled) {
    morphyStand(data, pos);
  }
}

function decisionMurphyVomit2(data, pos) {
  morphyVomit2(data, pos);
}

function decisionMurphyFall2(data, pos) {
  morphyFall2(data, pos);
}

function decisionMurphyFall(data, pos) {
  morphyFall(data, pos);
}

function decisionMurphyMove2(data, pos) {
  morphyMove2(data, pos);
}

function decisionMurphyPushMove2(data, pos) {
  morphyPushMove2(data, pos);
}

function decisionMurphyPush2(data, pos) {
  morphyPush2(data, pos);
}

function decisionMurphySnap2(data, pos) {
  morphySnap2(data, pos);
}

function morphyStand(data, pos) {
  const tile = data.tiles[pos];

  tile.pushing = 0;
  tile.terminal = 0;
  tile.vomiting = 0;

  tile.nextDecision = decisionInput;
}

function morphyMoveBase(data, pos, facing, nextPos) {
  const dir = Move[facing];
  nextPos = nextPos || (pos + dir.v);

  emptyTile(data, nextPos, pos);

  moveChar(data, pos, facing, nextPos);

  data.morphyPosKey = nextPos;

  const morphyPos = util.key2pos(nextPos);

  // viewportCenter(data, morphyPos, util.key2pos(pos));
  murphyCenter(data, morphyPos, util.key2pos(pos));
}

function morphyMove(data, pos, dir, nextPos) {
  const tile = data.tiles[pos];

  morphyMoveBase(data, pos, dir, nextPos);

  setMorphyFace(tile, dir);
  tile.pushing = 0;
  tile.terminal = 0;
  tile.moving = 1;
  tile.nextDecision = decisionMurphyMove2;
}

function morphyTerminal(data, pos, dir) {
  const tile = data.tiles[pos];

  setMorphyFace(tile, dir);
  tile.terminal = 1;
  data.terminal = 1;
  tile.nextDecision = decisionInput;  
}

function morphyExit(data, pos) {
  const tile = data.tiles[pos];

  tile.exiting = 1;

  data.levels.passed.push(data.selectedLevel);
  if (data.levels.skipped.indexOf(data.selectedLevel) === -1) {
    data.levels.current++;
  } else {
    data.levels.skipped
      .splice(data.levels.skipped
              .indexOf(data.selectedLevel), 1);

  }
  data.selectedLevel = data.levels.current;

  window.localStorage
    .setItem('levels', JSON.stringify(data.levels));

  anim.fadeToView(data, 'MENU', 1000, 1);
}

function morphyVomit(data, pos) {
  const tile = data.tiles[pos];

  tile.vomiting = 0;
  tile.vomitted = true;
}

function morphyBeginVomit(data, pos) {
  const tile = data.tiles[pos];

  tile.vomiting++;
  tile.nextDecision = decisionMurphyVomit2;
}

function morphyPush(data, pos, dir) {
  const tile = data.tiles[pos];

  setMorphyFace(tile, dir);
  tile.pushing = 1;
  tile.nextDecision = decisionMurphyPush2;
}

function morphyPushMove(data, pos, dir) {
  const tile = data.tiles[pos];

  const pushPos = posNeighbor(pos, dir);

  rolls.roll1(data, pushPos, dir);
  morphyMoveBase(data, pos, dir);

  setMorphyFace(tile, dir);
  tile.pushing = 3;
  tile.moving = 1;
  tile.nextDecision = decisionMurphyPushMove2;
}

function morphyEatMove(data, pos, dir) {
  const tile = data.tiles[pos];

  const eatPos = posNeighbor(pos, dir);
  const eatTile = data.tiles[eatPos];
  const eatRole = eatTile.role;

  // emptyTile(data, eatPos, pos);

  if (eatRole === 'FLOPPY_RED') {
    tile.bombs++;
  }

  if (eatRole === 'BUG' && eatTile.active > 0) {
    explosions.explode(data, pos);
    return;
  }

  morphyMoveBase(data, pos, dir);

  setMorphyFace(tile, dir);
  tile.pushing = 0;
  tile.moving = 1;
  tile.eatingRole = eatRole;
  tile.nextDecision = decisionMurphyMove2;
}

function morphySnap(data, pos, dir) {
  const tile = data.tiles[pos];

  const snapPos = posNeighbor(pos, dir);
  const snapTile = data.tiles[snapPos];

  if (snapTile.role === 'FLOPPY_RED') {
    tile.bombs++;
  }

  vanish1(data, snapPos);

  setMorphyFace(tile, dir);

  tile.snapping = 1;
  tile.pushing = 0;
  tile.nextDecision = decisionMurphySnap2;
}

function morphyVomit2(data, pos) {
  const tile = data.tiles[pos];

  tile.vomiting++;
  tile.nextDecision = decisionInput;
}

function morphyFall(data, pos) {
  const tile = data.tiles[pos];

  if (canGo(data, pos, 'down')) {

    morphyMoveBase(data, pos, 'down');
    setMorphyFace(tile, 'down');
    tile.pushing = 0;
    tile.terminal = 0;
    tile.falling = 1;
    tile.moving = 1;
    tile.nextDecision = decisionMurphyFall2;
  } else {
    tile.nextDecision = decisionInput;
  }
}

function morphyFall2(data, pos) {
  const tile = data.tiles[pos];

  tile.moving = 2;
  tile.nextDecision = decisionMurphyFall;
}

function morphyMove2(data, pos) {
  const tile = data.tiles[pos];

  tile.moving = 2;
  tile.nextDecision = decisionInput;
}

function morphyPush2(data, pos) {
  const tile = data.tiles[pos];

  tile.pushing = 2;
  tile.nextDecision = decisionInput;
}

function morphyPushMove2(data, pos) {
  const tile = data.tiles[pos];

  tile.pushing = 4;
  tile.moving = 2;
  tile.nextDecision = decisionInput;
}

function morphySnap2(data, pos) {
  const tile = data.tiles[pos];
  tile.snapping = 2;
  tile.nextDecision = decisionInput;
}

function toggleHUD(data) {
  data.showHUD = !data.showHUD;

  if (data.showHUD) {
    data.topEdgeOffset = 1;
  } else {
    data.topEdgeOffset = (1 / 3);
  }
  centerScroll(data);
};

function centerScroll(data) {
  data.tiles.map((tile, pos) => {
    if (tile.role === 'MURPHY') {
      //viewportCenter(data, util.key2pos(pos));
      murphyCenter(data, util.key2pos(pos));
    }
  });
};



function setMorphyFace(tile, facing) {
  if (isHorizontal(facing)) {
    tile.facingHorizontal = facing;
  }
  tile.facing = facing;
}


function inBetween(min, max, val) {
  return Math.max(Math.min(max, val), min);
}

function applyBounds(data, edgeOffset) {
  const tileSize = data.tileSize;
  const renderHeight = Constants.RENDER_HEIGHT * tileSize;
  const renderWidth = Constants.RENDER_WIDTH * tileSize;
  const viewHeight = data.viewHeight;
  const viewWidth = data.viewWidth;

  const topEdgeOffset = data.topEdgeOffset;
  const borderHeight = (tileSize / 2);
  const borderWidth = (tileSize / 2);


  const hudHeight = data.showHUD?(tileSize * 3 / 2):0;

  const defaultEdgeTop = borderHeight + tileSize +
          (tileSize * topEdgeOffset);

  const defaultEdgeLeft = 2 * tileSize;

  let edgeLeft = -defaultEdgeLeft + (-1 * edgeOffset[0]) * tileSize;
  let edgeTop = -defaultEdgeTop + (-1 * edgeOffset[1]) * tileSize;

  edgeLeft = inBetween(viewWidth - (renderWidth + borderWidth * 2),
                       0, edgeLeft);
  edgeTop = inBetween(viewHeight - hudHeight -
                      (renderHeight + borderHeight * 2),
                      0, edgeTop);

  return [edgeLeft, edgeTop];
}

function viewportCenter(data, morphyPos, prePos) {
  const tileSize = data.tileSize;
  const mapHeight = data.mapHeight;
  const mapWidth = data.mapWidth;
  const renderHeight = Constants.RENDER_HEIGHT;
  const renderWidth = Constants.RENDER_WIDTH;

  const halfRenderWidth = Math.floor(renderWidth / 2);
  const halfRenderHeight = Math.floor(renderHeight / 2);

  const leftEdge = morphyPos[0] - halfRenderWidth;
  const rightEdge = morphyPos[0] - (mapWidth - halfRenderWidth);
  const topEdge = morphyPos[1] - halfRenderHeight;
  const bottomEdge = morphyPos[1] - (mapHeight - halfRenderHeight);

  const edgeValue = 3;

  let edgeOffset = [inBetween(-edgeValue, 0, leftEdge) +
                    inBetween(0, edgeValue, rightEdge + 1),
                    inBetween(-edgeValue, 0, topEdge) +
                    inBetween(0, edgeValue, bottomEdge + 1)];

  edgeOffset = applyBounds(data, edgeOffset);

  const edgeDiff = [(data.edgeOffset[0] - edgeOffset[0]),
                    (data.edgeOffset[1] - edgeOffset[1])];

  data.edgeOffset = edgeOffset;

  if (prePos) {
    data.edgeTween = [edgeDiff, edgeDiff];
    data.edgeTween.start = data.lastUpdateTime;

    const tweenDuration = (Math.abs(edgeDiff[1]) / (tileSize / 2));

    if (tweenDuration > 0 && tweenDuration < 2) {
      const duration = tweenDuration * data.updateDuration;
      data.edgeTween.duration = duration;

      // bad
      if ((prePos[1] === 18 && morphyPos[1] === 17) ||
          (prePos[1] === 19 && morphyPos[1] === 18) ||
          (prePos[1] === 4 && morphyPos[1] === 5) ||
          (prePos[1] === 5 && morphyPos[1] === 6)) {
        data.edgeTween.start += (2 * data.updateDuration) - duration;
      }
    }
  }

  const viewOffset = [inBetween(0, mapWidth - renderWidth, leftEdge),
                      inBetween(0, mapHeight - renderHeight, topEdge)];

  const viewDiff = [(viewOffset[0] - data.viewOffset[0]) * tileSize,
                    (viewOffset[1] - data.viewOffset[1]) * tileSize];

  data.viewOffset = viewOffset;

  data.viewTween = [viewDiff, viewDiff];
  data.viewTween.start = data.lastUpdateTime;
}

function murphyCenter(data, morphyPos, prePos) {
  const { world, screen } = data.measure;

  let { offset, edgeOffset } = bounds(world, screen, morphyPos),
      preOffset = data.measure.offset,
      preEdgeOffset = data.measure.edgeOffset;
  
  data.measure.offset = offset;
  data.measure.edgeOffset = edgeOffset;

  if (preEdgeOffset) {
    let diff = [(edgeOffset[0] - preEdgeOffset[0]) * 32,
                (edgeOffset[1] - preEdgeOffset[1]) * 32];
    
    data.edgeTween = [diff, diff];
    data.edgeTween.start = data.lastUpdateTime;
  }

  if (preOffset) {
    let diff = [(offset[0] - preOffset[0]) * 32,
                (offset[1] - preOffset[1]) * 32];
    
    data.viewTween = [diff, diff];
    data.viewTween.start = data.lastUpdateTime;
  }

}

/*
   // debug // debug start
     // can bug
       // bug start
       // debug
   // bug  // bug start
     // can debug
       // debug start
       // bug
 */
function decisionDebug(data, pos) {
  const tile = data.tiles[pos];

  if (canBug(tile)) {
    bugStart(tile);
  } else {
    debug(tile);
  }
}

function decisionBugStart(data, pos) {
  const tile = data.tiles[pos];
  bug(tile);
}

function decisionBug(data, pos) {
  const tile = data.tiles[pos];

  if (canDebug(tile)) {
    debugStart(tile);
  } else {
    bug(tile);
  }
}

function decisionDebugStart(data, pos) {
  const tile = data.tiles[pos];
  debug(tile);
}

function bug(tile) {
  tile.active--;
  tile.nextDecision = decisionBug;
}

function debug(tile) {
  tile.deactive--;
  tile.nextDecision = decisionDebug;
}

function bugStart(tile) {
  tile.active = 16;
  tile.nextDecision = decisionBug;
}

function debugStart(tile) {
  tile.deactive = (Math.round(Math.random() * 4) + 1) * 16;
  tile.nextDecision = decisionDebug;
}

function canBug(tile) {
  return tile.deactive <= 0;
}

function canDebug(tile) {
  return tile.active <= 0;
}

/*
  // still // move 2
    // can left
      // turn left
    // can ahead
      // move 1
    // can right
      // turn right
    // turn left
  // turn
    // can ahead
      // move 1
      // still
  // move 1
    // move 2
 */
function decisionTurn(data, pos) {
  const tile = data.tiles[pos];

  const dirLeft = ofLeft(tile.facing);
  const dirAhead = tile.facing;
  const dirRight = ofRight(tile.facing);

  if (canGo(data, pos, dirLeft)) {
    turn(data, pos, dirLeft);
  } else if (canGo(data, pos, dirAhead)) {
    move1(data, pos);
  } else if (canGo(data, pos, dirRight)) {
    turn(data, pos, dirRight);
  } else if (isMurphy(data, pos, dirAhead)) {
    const posAhead = posNeighbor(pos, dirAhead);
    explosions.explode(data, posAhead);
  } else {
    turn(data, pos, dirLeft);
  }
}

function decisionMove(data, pos) {
  const tile = data.tiles[pos];

  const dirAhead = tile.facing;

  if (canGo(data, pos, dirAhead)) {
    move1(data, pos);
  } else {
    still(data, pos);
  }
}

function decisionMove2(data, pos) {
  move2(data, pos);
}

function still(data, pos) {
  const tile = data.tiles[pos];
  const facing = tile.facing;


  tile.moving = 0;
  tile.preFace = facing;
  tile.nextDecision = decisionTurn;
}

function move1(data, pos) {
  const tile = data.tiles[pos];
  const facing = tile.facing;

  moveChar(data, pos, tile.facing);

  tile.moving = 1;
  tile.nextDecision = decisionMove2;
}

function move2(data, pos) {
  const tile = data.tiles[pos];

  tile.moving = 2;
  tile.nextDecision = decisionTurn;
}

function turn(data, pos, dir) {
  const tile = data.tiles[pos];
  const facing = tile.facing;

  tile.moving = 0;
  tile.preFace = facing;
  tile.facing = dir;

  tile.nextDecision = decisionMove;
}

function isMurphy(data, pos, dir) {
  const rows = data.mapWidth;
  const cols = data.mapHeight;
  const mapLength = rows * cols;

  const neighbor = posNeighbor(pos, dir);


  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
        return false;
  }

  const tile = data.tiles[neighbor];
  return tile.role === 'MURPHY';
}

export function canVomit(data, pos) {
  const tile = data.tiles[pos];

  if (tile.vomiting > 18) {
    return true;
  }

  return false;
}

export function canBeginVomit(data, pos) {
  const tile = data.tiles[pos];
  
  return tile.bombs > 0;
}

export function canExplode(data, pos, dir) {
  const rows = data.mapWidth;
  const cols = data.mapHeight;
  const mapLength = rows * cols;

  const neighbor = posNeighbor(pos, dir);


  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
        return false;
  }

  const tile = data.tiles[pos],
        nTile = data.tiles[neighbor];

  return tile.falling > 1 && nTile.explodable;
}

export function canDiskplode(data, pos, dir) {
  const tile = data.tiles[pos];

  return tile.falling > 1 && tile.role === 'FLOPPY_ORANGE';
}

function canRoundClash(data, pos, dir) {
  const rows = data.mapWidth;
  const cols = data.mapHeight;
  const mapLength = rows * cols;

  const neighbor = posNeighbor(pos, dir);


  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
        return false;
  }

  const tile = data.tiles[neighbor];
  console.log(tile);
  return tile.falling > 1 ||
    // tile.rolling > 1  ||
    tile.moving > 1;
}

function canExit(data, pos, dir) {
  const rows = data.mapWidth;
  const cols = data.mapHeight;
  const mapLength = rows * cols;

  const tile = data.tiles[pos];

  const neighbor = posNeighbor(pos, dir);
  const exitTile = data.tiles[neighbor];

  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
        return false;
  }

  if (tile.exiting) {
    return false;
  }

  if (data.infotronsNeeded !== 0) {
    return false;
  }

  const levelIndex = data.selectedLevel;
  const levelData = data.levelData.levels[levelIndex];

  return exitTile.role === 'EXIT';
}

function canGo(data, pos, dir) {
  const rows = data.mapWidth;
  const cols = data.mapHeight;
  const mapLength = rows * cols;

  const neighbor = posNeighbor(pos, dir);

  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
        return false;
  }

  const tile = data.tiles[neighbor];
  return tile.role === 'EMPTY' && !tile.isTrail;
}


function canPort(data, pos, dir) {
  const neighbor = posNeighbor(pos, dir);

  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
        return false;
  }

  const tile = data.tiles[neighbor];
  if (!tile.portable || !tile.portable[dir]) {
    return false;
  }

  return canGo(data, neighbor, dir);
}

function canFall(data, pos) {
  return canGo(data, pos, 'down');
}

function canRoll(data, pos, dir) {
  const belowPos = posNeighbor(pos, 'down');
  const rollPos = posNeighbor(pos, dir);

  if (!isLegitNeighbor(data, pos, dir, rollPos) ||
      !isLegitNeighbor(data, pos, 'down', belowPos)) {
        return false;
  }

  const tile = data.tiles[pos];
  const belowTile = data.tiles[belowPos];

  if (!belowTile.round ||
      tile.nonRound ||
      belowTile.falling > 0 ||
      belowTile.rolling > 0) {
    return false;
  }

  return canGo(data, pos, dir) && canGo(data, rollPos, 'down');
}

function canPushMove(data, pos, dir) {
  const tile = data.tiles[pos];

  return tile.pushing === 2;
}

function canTerminal(data, pos, dir) {
    const neighbor = posNeighbor(pos, dir);
  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
    return false;
  }

  const tile = data.tiles[neighbor];

  if (tile.terminal) {
    return true;
  }
  return false;
}

function canPush(data, pos, dir) {
  const neighbor = posNeighbor(pos, dir);
  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
    return false;
  }

  if (dir === 'down' || dir === 'up') {
    return false;
  }

  const tile = data.tiles[neighbor];

  if (!tile.pushable) {
    return false;
  }

  return canGo(data, neighbor, dir);
}

function canEat(data, pos, dir) {
  const neighbor = posNeighbor(pos, dir);
  if (!isLegitNeighbor(data, pos, dir, neighbor)) {
    return false;
  }

  const tile = data.tiles[neighbor];

  return tile.eatable && !tile.moving;
}

function canSnap(data, pos, dir) {
  return canEat(data, pos, dir);
}

function isHorizontal(dir) {
  return dir === 'left' || dir === 'right';
}

function isSameRow(rows, pos1, pos2) {
  return row(rows, pos1) === row(rows, pos2);
}

function row(rows, pos) {
  return Math.floor(pos / rows);
}

function isLegitNeighbor(data, pos, dir, neighbor) {
  const rows = data.mapWidth;
  const cols = data.mapHeight;
  const mapLength = rows * cols;

  return !(neighbor < 0 || neighbor >= mapLength ||
           (isHorizontal(dir) && !isSameRow(rows, pos, neighbor)));
}

export function posNeighbor(pos, dir) {
  return pos + Move[dir].v;
}

function ofLeft(dir) {
  return moves[(Move[dir].i + 1) % 4];
}

function ofRight(dir) {
  return moves[(Move[dir].i + 3) % 4];
}

function setChar(frame, tiles, pos, char) {
  tiles[pos] = char;
  char.frame = frame;
}

function addTween(data, key, arr) {
  data.tweens[key] = [arr, arr];
  data.tweens[key].start = data.lastUpdateTime;
}

function tweenCharBase(data, pos, arr) {
  addTween(data, pos, arr);
}

function moveCharBase(frame, tiles, srcPos, dstPos) {
  const srcTile = tiles[srcPos];
  const dstTile = tiles[dstPos];
  setChar(frame, tiles, dstPos, srcTile);
  setChar(frame, tiles, srcPos, dstTile);

  srcTile.trailPos = srcPos;
  dstTile.isTrail = true;
}

function moveChar(data, pos, dirS, nextPos) {
  const dir = Move[dirS];
  nextPos = nextPos || pos + dir.v;

  moveCharBase(data.frame, data.tiles, pos, nextPos);
  tweenCharBase(data, nextPos, dir.a);
}

const Move = {
  left: {
    i: 0,
    a: [32, 0],
    v: -1
  },
  down: {
    i: 1,
    a: [0, -32],
    v: +MAP_WIDTH
  },
  right: {
    i: 2,
    a: [-32, 0],
    v: +1
  },
  up: {
    i: 3,
    a: [0, +32],
    v: -MAP_WIDTH
  }
};

const moves = ['left', 'down', 'right', 'up'];

export {
  centerScroll,
  moveChar,
  canFall,
  canRoll,
  decisionTurn,
  decisionBug,
  decisionInput
};
