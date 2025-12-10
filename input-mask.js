jQuery(function ($) {
  var inputMask = function inputMask() {
    var iti;
    var input = document.querySelectorAll('input[type="tel"]');
    var iti_el = $('.iti.iti--allow-dropdown.iti--separate-dial-code');

    if (iti_el.length) {
      iti.destroy();
    }

    for (var i = 0; i < input.length; i++) {
      iti = window.intlTelInput(input[i], {
        autoHideDialCode: false,
        autoPlaceholder: "aggressive",
        initialCountry: "auto",
        separateDialCode: true,
        searchCountry: true,
        countryOrder: ['ru'],
        customPlaceholder: function customPlaceholder(selectedCountryPlaceholder, selectedCountryData) {
          return '' + selectedCountryPlaceholder.replace(/[0-9]/g, '_').replace(/\s/g, '-');
        },
        geoIpLookup: function geoIpLookup(callback) {
          $.ajax({
            url: "https://get.geojs.io/v1/ip/geo.js",
            dataType: "jsonp",
            jsonpCallback: "geoip",
            success: function success(data) {
              callback(data.country_code);
            },
            error: function error() {
              callback('ru');
            }
          });
        },
        loadUtilsOnInit: function loadUtilsOnInit() {
          return 'https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/utils.js';
        }
      });
      $('input[type="tel"]').on("focus click countrychange", function (e, countryData) {
        var pl = $(this).attr('placeholder') + '';
        pl = pl.replaceAll('_', '9');

        if (pl !== 'undefined') {
          new Inputmask({
            mask: pl,
            placeholder: "_",
            clearMaskOnLostFocus: true
          }).mask(this);
        }

        if (!$(this).val()) {
          this.setSelectionRange(0, 0);
        }
      });
    }
  };

  inputMask();
  window.inputMask = inputMask;
});