import app from './app';
import WebFont from 'webfontloader';

export function boot(element) {
  WebFont.load({
    custom: {
      families: ['thin_pixel'],
      urls: ['images/fonts.css']
    },
    active: e => {
      app(element);
    }
  });
}
