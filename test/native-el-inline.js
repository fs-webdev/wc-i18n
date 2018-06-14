import './srcLocales.js';
import {WCI18n} from '../wc-i18n.js';


class NativeElInline extends WCI18n(window.srcLocales)(HTMLElement) {
  constructor(){
    super();
    this.addEventListener('wc-i18n-translations-loaded', e=>this._render());
    this.addEventListener('wc-i18n-translations-error', e=>this._render());
  }

  _render() {
    this.innerHTML = `
      <h3>Native Element</h3>
    `
  }
}

window.customElements.define('native-el-inline', NativeElInline);
