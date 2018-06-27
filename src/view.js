import { dContainer } from './asprite';

import { renderWrap }  from './viewGame';
import { renderMenu }  from './viewMenu';

export function render(ctrl, app, textures) {

  const container = dContainer();

  const gameWrap = renderWrap(ctrl, textures);
  const menuWrap = renderMenu(ctrl, textures);

  container.addChild(gameWrap.appContainer);
  container.addChild(menuWrap.appContainer);

  app.stage.addChild(container);

  const update = () => {
    if (ctrl.data.currentView === 'GAME') {
      menuWrap.appContainer.visible = false;
      gameWrap.appContainer.visible = true;
      gameWrap.update();
    } else {
      menuWrap.appContainer.visible = true;
      gameWrap.appContainer.visible = false;
      menuWrap.update();      
    }
  };

  return update;
}
