import * as PIXI from 'pixi.js';
import { sprites } from './sprites';

import controller from './ctrl';
import { renderWrap }  from './view';
import keyboard from './keyboard';

export default function app(element) {

  const app = new PIXI.Application({
    width: 32 * (20 + 1),
    height: 32 * (12 + 1)
  });


  PIXI.loader
    .add("images/Supaplex32.png")
    .add("levels", "build/levels.json")
    .load(() => {
      const ctrl = new controller(
        PIXI.loader.resources.levels.data);

      const textures = sprites();
      const render = renderWrap(ctrl, app, textures);

      keyboard(ctrl);


      app.ticker.add((delta) => {
        ctrl.update();
        render();
      });
    });
  
  element.appendChild(app.view);
}
