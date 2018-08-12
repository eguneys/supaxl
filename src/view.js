import { dContainer } from './asprite';

import { renderWrap }  from './viewGame';
import { renderMenu }  from './viewMenu';

export function render(ctrl, app, textures) {

  const container = dContainer();
  
  let gameWrap;
  const menuWrap = renderMenu(ctrl, textures);
  container.addChild(menuWrap.appContainer);

  app.stage.addChild(container);

  const update = () => {
    if (ctrl.data.currentView === 'GAME') {
      if (!ctrl.data.currentViewInitialized) {
        ctrl.data.currentViewInitialized = true;

        if (gameWrap) {
          container.removeChild(gameWrap.appContainer);
        }
        gameWrap = renderWrap(ctrl, textures);
        container.addChild(gameWrap.appContainer);
        menuWrap.appContainer.visible = false;
        gameWrap.appContainer.visible = true;
      }

      gameWrap.update();
    } else {
      if (gameWrap) {
        gameWrap.appContainer.visible = false;
      }
      menuWrap.appContainer.visible = true;
      ctrl.data.currentViewInitialized = false;
      menuWrap.update();      
    }
  };

  return update;
}
