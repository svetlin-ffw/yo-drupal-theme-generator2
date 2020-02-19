(function () {
  var KssStateGenerator;

  KssStateGenerator = (function () {
    function KssStateGenerator() {
      var idx; var idxs; var pseudos; var replaceRule; var rule; var stylesheet; var _i; var _len; var _len2; var _ref; var _ref2;
      pseudos = /(\:hover|\:disabled|\:active|\:visited|\:focus)/g;
      // Try {
      _ref = document.styleSheets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stylesheet = _ref[_i];
        idxs = [];
        _ref2 = stylesheet.cssRules || [];
        for (idx = 0, _len2 = _ref2.length; idx < _len2; idx++) {
          rule = _ref2[idx];
          if ((rule.type === CSSRule.STYLE_RULE) && pseudos.test(rule.selectorText)) {
            replaceRule = function (matched, stuff) {
              return '.pseudo-class-' + matched.replace(':', '');
            };

            this.insertRule(rule.cssText.replace(pseudos, replaceRule));
          }
        }
      }
      // } catch (_error) {console.log(_error.message);}
    }

    KssStateGenerator.prototype.insertRule = function (rule) {
      var headEl; var styleEl;
      headEl = document.getElementsByTagName('head')[0];
      styleEl = document.createElement('style');
      styleEl.type = 'text/css';
      if (styleEl.styleSheet) {
        styleEl.styleSheet.cssText = rule;
      } else {
        styleEl.appendChild(document.createTextNode(rule));
      }

      return headEl.appendChild(styleEl);
    };

    return KssStateGenerator;
  })();

  new KssStateGenerator();
}).call(this);
