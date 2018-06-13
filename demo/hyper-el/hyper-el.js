import {WCI18n} from '../../wc-i18n.js';
import HyperHTMLElement from 'hyperhtml-element/esm/index.js';


class HyperEl extends WCI18n()(HyperHTMLElement) {
  constructor(){
    super();
    this.addEventListener('wc-i18n-translations-loaded', e=>this.render());
    this.addEventListener('wc-i18n-translations-error', e=>this.render());
  }

  render() {
    return this.html`
      <h3>Hyper Element</h3>
      ${this.i18n('bar')}
    `
  }
}

window.customElements.define('hyper-el', HyperEl);
