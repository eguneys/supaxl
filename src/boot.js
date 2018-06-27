import app from './app';
import WebFont from 'webfontloader';

WebFont.load({
  custom: {
    families: ['thin_pixel'],
    urls: ['images/fonts.css']
  },
  active: e => {
    app(document.getElementById('elCanvas'));
  }
});
