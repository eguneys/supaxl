import { dContainer, sprite, asprite, pText } from './asprite';

export function renderMenu(ctrl, textures) {
  const appContainer = dContainer();

  let tileHeight = 32 * (ctrl.data.viewHeight + 2),
      tileWidth = 32 * (ctrl.data.viewWidth + 2);

  const menu = sprite(textures['main_menu']);
  menu.height = tileHeight;
  menu.width = tileWidth;
  appContainer.addChild(menu);

  const up = sprite(textures['button_up']);
  up.width = tileWidth * 0.52;
  up.height = tileHeight * 0.06;

  up.position.set(tileWidth * 0.44,
                  tileHeight * 0.71);
  appContainer.addChild(up);


  const down = sprite(textures['button_down']);
  down.width = tileWidth * 0.52;
  down.height = tileHeight * 0.06;

  down.position.set(tileWidth * 0.44,
                  tileHeight * 0.90);
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

  const pointer = asprite(textures['pointer']);
  pointer.width = tileHeight * 0.05;
  pointer.height = tileHeight * 0.05;
  appContainer.addChild(pointer);

  const update = () => {
    pointer.update();

    levelLine0.text = ctrl.vm.levelLine0;
    levelLine1.text = ctrl.vm.levelLine1;
    levelLine2.text = ctrl.vm.levelLine2;
  };

  return {
    appContainer,
    update
  };  
}
