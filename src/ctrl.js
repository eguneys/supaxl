import data from './data';
import { configure } from './config';
import * as roles from './roles';
import * as util from './util';
import * as anim from './anim';

export default function(levelData) {
  const WELCOME_MSG = '  WELCOME TO SUPAPLEX';
  this.data = data();

  const configLevels = window.localStorage.getItem('levels');
  if (configLevels) {
    try {
      configure(this.data, {
        levels: JSON.parse(configLevels)
      });
    } catch (e) {
      
    }
  }
  configure(this.data, {
    selectedLevel: this.data.levels.current
  });

  // debug
  // configure(this.data, { selectedLevel: 15 });


  this.data.levelData = levelData;

  // this.data.currentView = 'GAME';
  // roles.initGame(this.data);

  this.vm = {
    messageLine: WELCOME_MSG
  };

  this.skipLevel = () => {
    const data = this.data;

    if (data.levels.skipped.length >= 2) {
      return;
    }

    if (data.selectedLevel !== data.levels.current) {
      return;
    }

    data.levels.skipped.push(data.selectedLevel);
    if (data.selectedLevel === data.levels.current) {
      data.levels.current++;
    }
    data.selectedLevel++;

  };

  this.levelSelect = (delay = 1000) => {
    const data = this.data;
    roles.initGame(data);
    anim.fadeToView(data, 'GAME', 100, 100);
  };

  this.levelLine = (levelNo) => {
    const data = this.data;

    const levelIndex = levelNo;
    if (levelIndex < 0 || levelIndex >= data.levelData.levels.length) {
      return '';
    }

    const level = data.levelData.levels[levelIndex];

    const number = util.padZero(levelNo, 3);
    const name = level.title;

    let color = 'red';

    if (levelNo === data.levels.current) {
      color = 'yellow';
    }
    if (data.levels.passed.indexOf(levelNo) >= 0) {
      color = 'green';
    }
    if (data.levels.skipped.indexOf(levelNo) >= 0) {
      color = 'blue';
    }

    return {
      text: `${number} ${name}`,
      color: color
    };
  };

  this.updateMenu = () => {
    const data = this.data;
    const vm = this.vm;

    const selectedLevel = data.selectedLevel;

    vm.levelLine0 = this.levelLine(selectedLevel - 1);
    vm.levelLine1 = this.levelLine(selectedLevel);
    vm.levelLine2 = this.levelLine(selectedLevel + 1);
  };

  this.updateHUD = () => {
    const data = this.data;
    const vm = this.vm;

    vm.levelNo = util.padZero(data.levelNo, 3);
    vm.levelTitle = data.levelTitle;
    vm.infotronsNeeded = util.padZero(data.infotronsNeeded, 3);
  };

  this.move = (dir) => {
    const data = this.data;
    data.inputs[dir] = true;
  };

  this.clearMove = (dir) => {
    const data = this.data;
    data.inputs[dir] = false;
  };

  this.updateGame = () => {
    const data = this.data;
    const tiles = data.tiles;

    data.frame++;

    tiles.map((tile, pos) => {
      roles.clearTrail(data, pos);
    });

    tiles.map((tile, pos) => {
      if (data.frame === tile.frame) return;
      roles.actRole(data, pos);
    });
  };

  this.updateGameView = () => {
    const data = this.data;

    const now = Date.now();
    const rest = 1 - (now - data.lastUpdateTime) / data.updateDuration;

    if (rest <= 0) {
      data.lastUpdateTime = now;
      this.updateGame();
      this.updateHUD();
    }

    this.updateTweens();
  };

  this.update = () => {
    const data = this.data;
    if (data.currentView === 'GAME') {
      this.updateGameView();
    } else {
      this.updateMenu();
    }
  };

  this.updateTweens = () => {
    const data = this.data;
    const newTweens = {};

    const now = Date.now();

    Object.keys(data.tweens).map((key) => {
      const tween = data.tweens[key];
      const nowOrPause = tween.pause?tween.pause:now;
      const duration = tween.duration?tween.duration:data.updateDuration * 2;
      const rest = 1 - (nowOrPause - tween.start) / duration;
      tween[1] = [Math.round(tween[0][0] * rest),
                  Math.round(tween[0][1] * rest)];

      if (tween.pause || rest > 0) {
        newTweens[key] = tween;
      }
    });

    if (data.viewTween) {
      updateTween(data.viewTween, now, data.updateDuration * 2);
    }

    if (data.edgeTween) {
      updateTween(data.edgeTween, now, data.updateDuration * 2);
    }

    data.tweens = newTweens;
  };
}

function updateTween(tween, now, duration) {
  duration = (tween.duration)?tween.duration:duration;
  let rest = 1 - (now - tween.start) / duration;

  if (rest > 1) {
    rest = 1;
  }

  if (rest < 0) {
    rest = 0;
  }

  tween[1] = [Math.round(tween[0][0] * rest),
              Math.round(tween[0][1] * rest)];
}
