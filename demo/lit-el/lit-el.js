import {WCI18n} from '../../wc-i18n.js';
import {LitElement, html} from '@polymer/lit-element/lit-element.js';


class LitEl extends WCI18n(import.meta.url)(LitElement) {
  constructor(){
    super();
    this.addEventListener('wc-i18n-translations-loaded', e=>this._invalidateProperties());
    this.addEventListener('wc-i18n-translations-error', e=>this._invalidateProperties());
  }

  _render() {
    return html`
      <h3>Lit Element</h3>
      ${this.i18n('bar')}
    `;
  }
}

window.customElements.define('lit-el', LitEl);
