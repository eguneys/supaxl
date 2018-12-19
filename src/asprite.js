import * as PIXI from 'pixi.js';

export function pText(text, fill = 'red') {
  return new PIXI.Text(text, {
    fontFamily: "thin_pixel",
    fontSize: '36px',
    fill: fill
  });
}

export function pContainer() {

  return new PIXI.particles.ParticleContainer(1000, {
    vertices: true,
    position: true,
    uvs: true,
    tint: true
  });
  
}

export function dContainer() {
  return new PIXI.Container();
}

export function sprite(texture) {
  return new PIXI.Sprite(texture);
}

export function asprite(textures, duration) {
  return new AnimatedSprite(textures, duration);
}

class AnimatedSprite extends PIXI.Sprite {

  constructor(textures, duration = 1000, loop = true) {
    super(textures[0]);

    this.loop = loop;

    this._textures = textures;

    this.duration = duration;

    this.lastTime = Date.now();
  }

  update() {

    if (!this.playing) {
      return;
    }

    let now = Date.now(),
        lastTime = this.lastTime,
        elapsed = (now - lastTime) / this.duration;

    if (elapsed >= 1) {
      if (this.loop) {
        this.lastTime = now;
      }
      elapsed = 0.9;
    }

    this.frame = Math.floor(elapsed * this._textures.length);
    this._texture = this._textures[this.frame];
  }

  setTextures(textures, duration, loop, lastTime) {
    if (this._textures[0] === textures[0]) {
      return false;
    }

    this.loop = loop;

    // let now = Date.now(),
    //     lastTime2 = this.lastTime,
    //     elapsed = (now - lastTime2) / this.duration;
    // if (elapsed > 1) {
    //   lastTime = Date.now();
    // }
    lastTime = Date.now();

    this.playing = true;

    this._textures = textures;

    this.duration = duration;

    this.lastTime = lastTime || Date.now();
    return true;
  }
}
