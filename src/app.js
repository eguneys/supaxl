import * as PIXI from 'pixi.js';
import { sprites } from './sprites';

import controller from './ctrl';
import { render }  from './view';
import keyboard from './keyboard';

export default function app(element) {

  const app = new PIXI.Application({
    width: 32 * (20 + 1 + 1),
    height: 32 * (12 + 1 + 1) + 32 * 1.5
  });


  PIXI.loader
    .add("images/Supaplex32.png")
    .add("images/SupaplexSprites.png")
    .add("images/SupaplexBorder.png")
    .add("images/hud.png")
    .add("images/pointer2.png")
    .add("images/button_up.png")
    .add("images/button_down21.png")
    .add("images/main_menu21.png")
    .add("levels", "build/levels.json")
    .load(() => {
      const ctrl = new controller(
        PIXI.loader.resources.levels.data);

      const textures = sprites();

      const update = render(ctrl, app, textures);

      keyboard(ctrl);


      app.ticker.add((delta) => {
        ctrl.update();
        update();
      });
    });
  
  element.appendChild(app.view);
}
