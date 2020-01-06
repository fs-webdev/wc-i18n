[![Code Climate](https://codeclimate.com/repos/58fe0ed05ac14b027b001bab/badges/cbb0f80a573d30d6eee8/gpa.svg)](https://codeclimate.com/repos/58fe0ed05ac14b027b001bab/feed) [![Test Coverage](https://codeclimate.com/repos/58fe0ed05ac14b027b001bab/badges/cbb0f80a573d30d6eee8/coverage.svg)](https://codeclimate.com/repos/58fe0ed05ac14b027b001bab/coverage) [![Issue Count](https://codeclimate.com/repos/58fe0ed05ac14b027b001bab/badges/cbb0f80a573d30d6eee8/issue_count.svg)](https://codeclimate.com/repos/58fe0ed05ac14b027b001bab/feed) [![Build Status](https://travis-ci.org/fs-webdev/wc-i18n.svg?branch=master)](https://travis-ci.org/fs-webdev/wc-i18n)

# WCI18n

`WCI18n` is a lightweight `i18n` solution for web components, in API it is quite similar to [`Polymer.AppLocalizeBehavior`](https://github.com/PolymerElements/app-localize-behavior) but it is approaching the problem from a different angle.

`WCI18n` assumes native support for the following two APIs:

- `Promise`
- `fetch`

If you don't have access to these two APIs in your target browser you will need to load them. Some quality polyfills can be found below:

- `Promise` - https://github.com/taylorhakes/promise-polyfill
- `fetch` - https://github.com/github/fetch

There are a couple of distinct design differences between `WCI18n` and [`Polymer.AppLocalizeBehavior`](https://github.com/PolymerElements/app-localize-behavior)

Specifically:

- There is only 1 language allowed across the **entire** application
- Each registered custom element defines (and fetches) its own locales, there is no support for a single locale file
- Each component will fetch **only** the locales it needs for the current language (meaning that for production, inlining a formatted locale object is advisable)

## Example Usage

### Basic Usage

`WCI18n` is included and used in your component as follows:

#### Polymer 2

```html
<dom-module id='custom-el'>
  <template>
    <!-- Use the provided `i18n` function -->
    <p>i18n('key')</p>
  </template>
  <script>
    class CustomEl extends Polymer.mixinBehaviors([WCI18n()], Polymer.Element) {
      static get is() {
        return 'custom-el';
      }
      /* ... */
    }
    customElements.define(CustomEl.is, CustomEl);
  </script>
</dom-module>
```

#### Polymer 1

```html
<dom-module id='custom-el'>
  <template>
    <!-- Use the provided `i18n` function -->
    <p>i18n('key')</p>
  </template>
  <script>
    Polymer({
      is: 'custom-el',
      behaviors: [
        WCI18n() // <-- Include the behavior
      ]
    });
  </script>
</dom-module>
```

You can inject a translation object by passing a formatted locales object to the `WCI18n` function.

_Formatted Object_

```
{
  "en": {
    "key": "value"
  },
  "fr": {
    "key": "valeur"
  }
}
```
_Example Injection_

```html
<dom-module id='custom-el'>
  <template>
    <!-- Use the provided `i18n` function -->
    <p>i18n('key')</p>
  </template>
  <script>
    Polymer({
      is: 'custom-el',
      behaviors: [
        WCI18n({ en: { key: "value"}, fr: { key: "valeur" }}) // <-- Injected translations
      ]
    });
  </script>
</dom-module>
```
### String Interpolation

Currently this component **does not** use the native `Intl` object and the `IntlMessageFormat` standards for legacy browser support. However
basic string interpolation is supported via 2 means:

- `key` -> `val` sequential string params
- String format object

**For example**, if you take the following format string:

```
I love to take my {noun} to the {place}
```

You could do interpolation either of the following ways:

```
i18n('key', 'noun', 'cat', 'place', 'groomer');
```

```
i18n('key', { "noun": "cat", "place": "groomer" })
```

Both will create the following string:

```
I love to take my cat to the groomer
```

## Global Config

### Language

In addition to the typical component setup `wc-i18n` provides some addition functions that you can use to configure the language of your application

#### Global Preset

By pre-defining the `window.WCI18n` object you can create a new default language for your application.
This can be an easy way to set consistent global languages across multiple pages

_Example:_

```html
<!DOCTYPE html>
<html>
<head>
  <title>Define WCI18n</title>

  <script>
    // By predefining this object the language
    // will default to 'ko' not 'en'
    window.WCI18n = { language: 'ko' };
  </script>

  <!-- Web Components -->
  <link rel='import' href="my/component/bundle.html">
 </head>
 <body>
   ...
 </body>
 </html>
```

#### Global Setter

The `WCI18n` object now also exposes a `setLanguage` function that can be called to set the language to a given locale.

_Example:_

```javascript
window.WCI18n.setLanguage('ko'); //- Sets language to 'ko'
```

## Running the Component

<details>

1. (Once) Install or update the [Polymer CLI](https://www.npmjs.com/package/polymer-cli): ```npm i -g polymer-cli```
1. (Once) Install the [frontier-cli](https://github.com/fs-webdev/frontier-cli): ```npm i -g https://github.com/fs-webdev/frontier-cli```
1. Run `npm install` to get dependencies needed to set up the unit testing framework, useful commit hooks, and standards tools (`bower install` is also run as a post-install step).
1. Or (if you want to live dangerously) just run `bower install` to load all of the component's primary dependencies.
1. Run `polymer analyze > analysis.json` to initialize the docs page.

This component's auto-generated documentation is viewable by running:

```bash
frontier element serve
```

> NOTE: If you attempt to `frontier element serve` on a clean install, you will get an error, stating that the analysis.json file (used to populate the documentation page) does not exist. You can fix this by either running `frontier element serve -a`, or by auto-loading the demo page via:

```bash
frontier element serve -d
```

This component's demo page is viewable by running the above command.

</details>

## Online Docs & Demo

The FamilySearch Element Catalog is located at: [https://www.familysearch.org/frontier/catalog/](https://www.familysearch.org/frontier/catalog/), with access granted to members of the `fs-webdev` GitHub organization. [How to create a shared component of your own](https://www.familysearch.org/frontier/ui-components/creating-a-new-web-component/).

## Build, Commit, Test, and Standards Tools

For detail about automatic releases, test plugins, pre-commit hooks, and standards enforcement, see: [fs-common-build-scripts](https://github.com/fs-webdev/fs-common-build-scripts#)

> IMPORTANT NOTE: When running package dependency commands (i.e. `wct`), you need to prefix the command with [`npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

## Running Tests

<details>

This component is set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester).

To run tests locally (skipping sauce), run:

```bash
npm test
```

which will run unit tests locally via `wct`.

To run against sauce (skipping local), run:

```bash
npm run test:ci
```

If you need to debug locally (keeping the browser open), run:

```bash
npm run test:persistent
```

or

```bash
polymer test --skip-plugin sauce --local chrome -p
```

If you want to run the full suite of SauceLabs browser tests, run:

```bash
npx wct test/index.html --configFile wct.conf.json  --sauce-username {USERNAME} --sauce-access-key {ACCESS_KEY}
```

> NOTE: You can export `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` in your `.bash_profile` to be able to simply run `npx wct` without needing additional options.

</details>
