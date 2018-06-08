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
    <h1>[[i18n('foo')]]</h1>
`,

  is: 'test-comp',

  behaviors: [
    WCI18n()
  ]
});
