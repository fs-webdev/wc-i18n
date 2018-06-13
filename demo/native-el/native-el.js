import {WCI18n} from '../../wc-i18n.js';


class NativeEl extends WCI18n()(HTMLElement) {
  constructor(){
    super();
    this.addEventListener('wc-i18n-translations-loaded', e=>this._render());
    this.addEventListener('wc-i18n-translations-error', e=>this._render());
  }

  _render() {
    this.innerHTML = `
      <h3>Native Element</h3>
      ${this.i18n('bar')}
    `
  }
}

window.customElements.define('native-el', NativeEl);
