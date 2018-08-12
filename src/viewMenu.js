import { dContainer, sprite, asprite, pText } from './asprite';

function setDims(c, w, h, x = 0, y = 0) {
  c.width = w;
  c.height = h;
  c.position.set(x, y);
}

export function renderMenu(ctrl, textures) {
  const appContainer = dContainer();

  let tileHeight = 32 * (ctrl.data.viewHeight + 2),
      tileWidth = 32 * (ctrl.data.viewWidth + 2);

  const menu = sprite(textures['main_menu']);
  setDims(menu, tileWidth, tileHeight);
  appContainer.addChild(menu);

  const up = sprite(textures['button_up']);
  setDims(up, tileWidth * 0.52, tileHeight * 0.06,
          tileWidth * 0.44, tileHeight * 0.71);
  up.alpha = 0;
  appContainer.addChild(up);


  const down = sprite(textures['button_down']);
  setDims(down, tileWidth * 0.52, tileHeight * 0.06,
           tileWidth * 0.44,
           tileHeight * 0.90);
  down.alpha = 0;
  appContainer.addChild(down);
  

  const messageLine = pText(ctrl.vm.messageLine);
  messageLine.position.set(tileWidth * 0.52,
                           tileHeight * 0.63);
  appContainer.addChild(messageLine);

  const levelLine0 = pText(ctrl.vm.levelLine0);
  levelLine0.width = tileWidth * 0.5;
  levelLine0.position.set(tileWidth * 0.45,
                          tileHeight * 0.78);
  appContainer.addChild(levelLine0);

  const levelLine1 = pText(ctrl.vm.levelLine0, 'green');
  levelLine1.width = tileWidth * 0.5;
  levelLine1.position.set(tileWidth * 0.45,
                          tileHeight * 0.82);
  appContainer.addChild(levelLine1);

  const levelLine2 = pText(ctrl.vm.levelLine0, 'yellow');
  levelLine2.width = tileWidth * 0.5;
  levelLine2.position.set(tileWidth * 0.45,
                          tileHeight * 0.86);
  appContainer.addChild(levelLine2);

  const okButton = sprite(textures['button_up']);
  setDims(okButton, 
          tileWidth * 0.08, tileHeight * 0.12,
          tileWidth * 0.29, tileHeight * 0.7);
  okButton.alpha = 0;
  appContainer.addChild(okButton);

  const pointer = asprite(textures['pointer']);
  setDims(pointer, tileHeight * 0.05, tileHeight * 0.05);
  appContainer.addChild(pointer);

  const update = () => {
    pointer.update();

    levelLine0.text = ctrl.vm.levelLine0;
    levelLine1.text = ctrl.vm.levelLine1;
    levelLine2.text = ctrl.vm.levelLine2;
  };

  appContainer.interactive = true;
  appContainer.on('mousemove', function(e) {
    pointer.position.set(e.data.global.x, e.data.global.y);
  });

  function levelListUp(data) {
    data.selectedLevel = Math.max(1, data.selectedLevel - 1);
  }

  function levelListDown(data) {
    data.selectedLevel = Math.min(111, data.selectedLevel + 1);
  }


  const levelUpHold = holdit(levelListUp);
  const levelDownHold = holdit(levelListDown);


  up.interactive = true;
  up.on('mousedown', function() {
    up.alpha = 1;
    levelUpHold.mousedown(ctrl.data);
  });
  up.on('mouseup', function() {
    up.alpha = 0;
    levelUpHold.mouseup();
  });

  down.interactive = true;
  down.on('mousedown', function() {
    down.alpha = 1;

    levelDownHold.mousedown(ctrl.data);
  });
  down.on('mouseup', function() {
    down.alpha = 0;
    levelDownHold.mouseup();
  });

  okButton.interactive = true;
  okButton.on('mousedown', function() {
    ctrl.levelSelect();
  });

  return {
    appContainer,
    update
  };  
}

function holdit(action) {
  const start = 250;
  const delay = 12;

  let t, s = start, d = delay;
  const repeat = function(data) {
    action(data);
    t = window.setTimeout(repeat.bind(null, data), s);
    if (d < 0) {
      s = start / 8;
    } else if (d < delay / 2) {
      s = start / 4;
    }
    d--;
  };

  const stop = function() {
    s = start;
    d = delay;
    window.clearTimeout(t);
  };

  return {
    mousedown: function(data) {
      repeat(data);
    },
    mouseup: function() {
      stop();
    }
  };
}
