let _language = 'en';
const _strings = {};
let _instances = [];

// Cache for functions to be defined as needed
var _i18nFxns = {};
var _errFxns = {};

/**
 * Utility function to compute the default location for locales
 *
 * @param  {String} localeDir The directory of the locales
 * @param  {String} component The name of the component to be translated
 * @param  {String} lang      The language of the locale to be fetched
 * @return {String}           The formatted path to the locales
 */
var _computeLocaleURI = function (localeDir, component, lang) {
  return localeDir + '/' + component + '_' + lang + '.json';
};

/**
 * Iterates through all components with the WCI18n behavior
 * and updates their language (triggering a refetch of locales)
 */
var _updateInstanceLanguages = function (instances, newLang) {
  instances.filter(function (el) {
    // Filter out those instances that already are using the
    // proper language
    return el.language !== newLang;
  }).forEach(function (el) {
    el.language = newLang;
    el.__updateLanguage(newLang);
    el.__skipGlobalLanguageUpdate = true;
  });
};

/**
 * Allow users to pre-set a language that will be used as the
 * default by doing the following:
 *
 * ```
 * window.WCI18n = { language: 'ko' };
 * ```
 */
window.WCI18n = window.WCI18n || {};

_language = window.WCI18n.language || _language;

export const WCI18n = (locales) => (baseElement) => class extends baseElement {
  constructor () {
    super();
    if (typeof locales === 'string') {
      this._componentPath = this.__getComponentPath(locales);
      locales = null;
    }

    this.__updateLanguage(_language);
    this.i18n = () => {};
    this.lanugage = _language;
  }

  connectedCallback () {
    if (!Array.isArray(_instances[this.__getComponentName()])) _instances[this.__getComponentName()] = [];
    _instances.push(this);

    if (super.connectedCallback) {
      super.connectedCallback();
    }
  }

  disconnectedCallback () {
    _instances = _instances.filter(function (instance) {
      return instance !== this;
    }.bind(this));

    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  __getComponentName () {
    return (typeof this.is === 'string') ? this.is : this.tagName.toLowerCase();
  }
  __getComponentPath (url) {
    if (!url) return;

    let urlArr = url.split('/');
    urlArr.pop();

    return urlArr.join('/');
  }

  /**
   * Fetches the locales from the file server, only used if a locales object
   * for the current language doesn't exist.
   *
   * @param  {String} newLang The language that should be fetched
   * @return {Promise}         A promise to get the data, it resolves
   * instantaneously if the data has been fetched before or if a pending
   * request for data exists
   */
  __fetchLocaleStrings (newLang) {
    return new Promise(resolve => {
      // If the strings already exist OR there is a promise for them
      if (_strings[this.__getComponentName()] && _strings[this.__getComponentName()][newLang]) return resolve(_strings[this.__getComponentName()][newLang]);

      var url = _computeLocaleURI(`${this._componentPath}/locales`, this.__getComponentName(), newLang);
      var promise = window.fetch(url).then(res => res.json());

      // Assign promise to data location to prevent duplicate
      // requests
      if (!_strings[this.__getComponentName()]) _strings[this.__getComponentName()] = {};
      _strings[this.__getComponentName()][newLang] = promise;

      // Resolve with the promise and set the proper data value
      // when the data comes back
      return resolve(promise.then(locales => {
        // Assign actual data for future requesters of these locales
        _strings[this.__getComponentName()][newLang] = locales;
        return locales;
      })
        .catch(err => {
          // Unset the promise to allow refetching of the data if
          // possible
          _strings[this.__getComponentName()][newLang] = null;
          throw err;
        }));
    });
  }

  /**
   * Triggered by a change in the value of the `language` prop.
   * This refreshes the value of the `i18n` function.
   *
   * @param  {String} newLang The new language
   */
  __updateLanguage (newLang) {
    if (_language !== newLang) _language = newLang;
    if (!_strings[this.__getComponentName()]) _strings[this.__getComponentName()] = locales;

    // Fetch the locale strings then
    // Create a translation function for the
    // component

    this.__fetchLocaleStrings(newLang)
      .then(locales => {
        var fxnKey = this.__getComponentName() + '.' + newLang;
        this.i18n = _i18nFxns[fxnKey] = _i18nFxns[fxnKey] || function (key) {
        // The user can pass an object as the second param or a series of sequential string values
          var formatObject = arguments[1] && typeof arguments[1] === 'object' ? arguments[1] : null;
          formatObject = formatObject || Array.prototype.reduce.call(arguments, function (container, value, index, array) {
            if (!index) return container;
            // The index is odd meaning
            // it is in the 2,4,6 slot indicating
            // a value whose key is the index before
            if (!(index % 2)) {
              container[array[index - 1]] = value;
            }
            return container;
          }, {});
          var string = locales[key];

          Object.keys(formatObject)
            .forEach(function (key) {
              var placeholder = new RegExp('{' + key + '}', 'g');
              string = string.replace(placeholder, formatObject[key]);
            });
          return string || 'KEY: ' + key + ' (' + newLang + ')';
        };
        /**
       * Fired when the component locales have succesfully loaded.
       *
       * @event wc-i18n-translations-loaded
       */
        this.dispatchEvent(new CustomEvent('wc-i18n-translations-loaded', {bubbles: false}));
      })
    // If there is an error in fetching/parsing translations
    // create a function for that returns the key and use it as
    // the translation function for this component
      .catch(function () {
        this.i18n = _errFxns[newLang] = _errFxns[newLang] || function (key) {
          return 'KEY: ' + key + ' (' + newLang + ')';
        };
        /**
       * Fired when the component locales have failed to load.
       *
       * @event wc-i18n-translations-error
       */
        this.dispatchEvent(new CustomEvent('wc-i18n-translations-error', {bubbles: false}));
      }.bind(this));

    // Iterate through all of the translatable components and trigger
    // a language update if not already set
    if (this.__skipGlobalLanguageUpdate) {
      this.__skipGlobalLanguageUpdate = false;
    } else {
      _updateInstanceLanguages(_instances, newLang);
    }
  }
};

// this supports either having wc-i18n.html on/off the page
window.WCI18n.setLanguage = window.WCI18n.setLanguage || function () {};

// new way to update the language
window.addEventListener('wc-i18n-set-language', ({detail}) => {
  _language = detail;
  _updateInstanceLanguages(_instances, detail);
});
