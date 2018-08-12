import * as Constants from './data';
import * as util from './util';

const { MAP_HEIGHT, MAP_WIDTH } = Constants;

const RoleCode = {
  0x00: 'EMPTY',
  0x01: 'ZONK',
  0x02: 'BASE',
  0x03: 'MURPHY',
  0x04: 'INFOTRON',
  0x05: 'CHIP',
  0x06: 'WALL',
  0x07: 'EXIT',
  0x08: 'FLOPPY_ORANGE',
  0x09: 'PORT_RIGHT',
  0x0A: 'PORT_DOWN',
  0x0B: 'PORT_LEFT',
  0x0C: 'PORT_UP',
  0x0D: 'GPORT_RIGHT',
  0x0E: 'GPORT_DOWN',
  0x0F: 'GPORT_LEFT',
  0x10: 'GPORT_UP',
  0x11: 'SNIKSNAK',
  0x12: 'FLOPPY_YELLOW',
  0x13: 'TERMINAL',
  0x14: 'FLOPPY_RED',
  0x15: 'PORT_VERTICAL',
  0x16: 'PORT_HORIZONTAL',
  0x17: 'PORT_ALL',
  0x18: 'ELECTRON',
  0x19: 'BUG',
  0x1A: 'CHIP_LEFT',
  0x1B: 'CHIP_RIGHT',
  0x1C: 'HARDWARE1',
  0x1D: 'HARDWARE2',
  0x1E: 'HARDWARE3',
  0x1F: 'HARDWARE4',
  0x20: 'HARDWARE5',
  0x21: 'HARDWARE6',
  0x22: 'HARDWARE7',
  0x23: 'HARDWARE8',
  0x24: 'HARDWARE9',
  0x25: 'HARDWARE10',
  0x26: 'CHIP_TOP',
  0x27: 'CHIP_BOTTOM'
};


const Role = {
  SNIKSNAK: {
    facing: 'left',
    preFace: 'left',
    moving: 0,
    decision: 'decisionTurn'
  },
  ZONK: {
    moving: 0,
    round: true,
    pushable: true,
    decision: 'decisionFall'
  },
  INFOTRON: {
    moving: 0,
    round: true,
    eatable: true,
    decision: 'decisionFall'
  },
  BASE: {
    eatable: true
  },
  CHIP: {
    round: true
  },
  CHIP_LEFT: {
    round: true
  },
  CHIP_RIGHT: {
    round: true
  },
  CHIP_TOP: {
    round: true
  },
  CHIP_BOTTOM: {
    round: true
  },
  ELECTRON: {
    facing: 'left',
    preFace: 'left',
    moving: 0,
    decision: 'decisionTurn'
  },
  BUG: {
    active: 1000 / Constants.UPDATE_DURATION,
    decision: 'decisionBug',
    eatable: true
  },
  MURPHY: {
    facingHorizontal: 'left',
    facing: 'left',
    moving: 0,
    decision: 'decisionInput'
  },
  PORT_ALL: {
    portable: {left: true, right: true, up: true, down: true }
  },
  PORT_LEFT: {
    portable: {left: true }
  },
  PORT_TOP: {
    portable: { up: true }
  },
  PORT_RIGHT: {
    portable: { right: true }
  },
  PORT_DOWN: {
    portable: { down: true }
  },
  PORT_HORIZONTAL: {
    portable: {left: true, right: true }
  },
  PORT_VERTICAL: {
    portable: { up: true, down: true }
  },
  TERMINAL: {
    terminal: true
  },
  FLOPPY_YELLOW: {
    decision: 'decisionTerminal'
  },

};

function roleMaker() {
  let id = 1;

  return function(roleCode) {
    id++;
    const result = {key: id};

    const role = RoleCode[roleCode];
    const obj = Role[role] || {};

    obj.role = role;

    Object.keys(obj).map((key) => {
      result[key] = obj[key];
    });

    return result;
  };
}

const makeRole = roleMaker();

const _initial = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  39, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                  0, 19, 0, 0, 9, 2, 24, 0, 0, 0,
                  24, 0, 21, 0, 0, 10, 25, 0, 0, 0,
                  0, 0, 0, 0, 0, 1, 0, 11, 0, 0,
                  0, 4, 7, 21, 0, 0, 0, 0, 13, 39,
                  0, 30, 18, 8, 13, 0, 0, 0, 0, 20,
                  26, 31, 35, 0, 0, 0, 0, 0, 0, 0,
                  27, 32, 36, 0, 0, 0, 0, 0, 0, 0,
                  28, 33, 37, 0, 0, 0, 0, 0, 0, 0,
                  29, 34, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const _spriteTest =
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       1, 2, 3, 4, 5, 6, 7, 8, 0, 0,
       9, 10, 11, 12, 13, 14, 15, 16, 0, 0,
       17, 18, 19, 20, 21, 22, 23, 24, 0, 0,
       25, 26, 27, 28, 29, 30, 31, 32, 0, 0,
       33, 34, 35, 36, 37, 38, 39, 40, 0, 0,
       41, 41, 18, 8, 13, 0, 0, 0, 0, 20,
       26, 31, 35, 0, 0, 0, 0, 0, 0, 0,
       27, 32, 36, 0, 0, 0, 0, 0, 0, 0,
       28, 33, 37, 0, 0, 0, 0, 0, 0, 0,
       29, 34, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const _edgeTest = [
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  4, 2, 2, 2, 2, 2, 2, 0x17, 2, 4,
  2, 2, 2, 2, 2, 1, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 1, 2, 2, 2,
  4, 2, 2, 2, 2, 2, 0x17, 1, 2, 4,
  2, 2, 0x17, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 0x17, 2,
  2, 2, 2, 2, 2, 0x17, 2, 2, 2, 2,
  4, 4, 2, 4, 2, 4, 2, 2, 4, 2];

const _exTest = [
  0x19, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 0x12, 2, 2, 2, 2,
  4, 2, 0x12, 2, 2, 2, 2, 0x17, 2, 4,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 0x13, 2, 2, 2,
  4, 2, 2, 2, 2, 2, 2, 1, 2, 4,
  2, 2, 0x17, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 0x17, 2,
  2, 2, 2, 2, 2, 0x17, 2, 2, 2, 2,
  4, 4, 2, 4, 2, 4, 2, 2, 4, 2];

const initial = enhance(_initial);
const spriteTest = enhance(_spriteTest);
const edgeTest = enhance(_edgeTest);
const exTest = enhance(_exTest);

function enhance2(arr) {
  var by = 24;

  var result = [];

  while (by--) {
    result = result.concat(arr);
  }

  return result;
}

function enhance(arr) {
  var result = [];

  function cloneAt(I, J) {
    for (var i = 0; i<10; i++) {
      for (var j = 0; j < 12; j++) {
        var dstKey = (j + J) * 60 + i + I;
        var srcKey = j * 10 + i;

        result[dstKey] = arr[srcKey];
      }
    }
  }

  for (var i = 0; i<60; i+=10) {
    for (var j = 0; j<24;j+= 12) {
      cloneAt(i, j);
    }
  }

  result[util.pos2key([1, 7])] = 3;

  return result;
}

function read(tiles) {
  const result = [];

  for (var i = 0; i < MAP_HEIGHT; i++) {
    for (var j = 0; j < MAP_WIDTH; j++) {
      const dstKey = util.pos2key([j, i]);
      const srcKey = (i + 1) * 60 + (j + 1);
      result[dstKey] = makeRole(tiles[srcKey]);
    }
  }

  // tiles = tiles.map((tile) => {
  //   return makeRole(tile);
  // });

  return result;
}

export {
  read,
  makeRole,
  initial,
  spriteTest,
  edgeTest,
  exTest
};
