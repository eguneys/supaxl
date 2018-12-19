import { asprite, dContainer } from './asprite';

export function renderDebug(ctrl, app, textures) {
  const container = dContainer();
  app.stage.addChild(container);

  const aSprite = asprite(textures['explode']);
  container.addChild(aSprite);

  const update = () => {
    aSprite.update();
  };

  return update;
}
