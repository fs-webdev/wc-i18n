import '@polymer/polymer/polymer-legacy.js';
import '../../wc-i18n-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <h1>[[i18n('baz', 'count', count)]]</h1>
    <h1>[[i18n('baz', countObj)]]</h1>
`,

  is: 'fancy-el',

  behaviors: [
    WCI18n(import.meta.url)
  ],

  properties: {
    count: {
      type: Number,
      value: 123
    },
    countObj: {
      type: Object,
      value: function() {
        return { count: 321 }
      }
    }
  }
});
