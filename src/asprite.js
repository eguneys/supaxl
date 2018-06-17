import * as PIXI from 'pixi.js';

export function pContainer() {

  return new PIXI.particles.ParticleContainer(1000, {
    vertices: false,
    position: false,
    uvs: false,
    tint: true
  });
  
}

export function asprite(textures, duration) {
  return new AnimatedSprite(textures, duration);
}

class AnimatedSprite extends PIXI.Sprite {

  constructor(textures, duration = 1000) {
    super(textures[0]);

    this._textures = textures;

    this.duration = duration;

    this.lastTime = Date.now();
  }

  update() {

    let now = Date.now(),
        lastTime = this.lastTime,
        elapsed = (now - lastTime) / this.duration;

    if (elapsed >= 1) {
      this.lastTime = now;
      elapsed = 0;
    }

    this.frame = Math.floor(elapsed * this._textures.length);
    this._texture = this._textures[this.frame];
  }

  setTextures(textures, duration, lastTime) {
    if (this._textures[0] === textures[0]) {
      return false;
    }

    this._textures = textures;

    this.duration = duration;

    this.lastTime = lastTime || Date.now();
    return true;
  }
}
