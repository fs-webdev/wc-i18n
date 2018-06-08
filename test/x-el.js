/**
A comment describing this element

Example:

    <my-elem></my-elem>

Example:

    <my-elem>
      <h2>Hello my-elem</h2>
    </my-elem>

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '../wc-i18n.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
`,

  is: 'x-el',

  behaviors: [
    WCI18n()
  ]
});
