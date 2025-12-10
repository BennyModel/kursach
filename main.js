;

(function ($) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-feedback-whatsapp-link').forEach(function (link) {
      var message = link.dataset.message;

      if (!message) {
        return;
      }

      var url = new URL(link.href);
      message = message.replace('{roistat_visit}', getCookie('roistat_visit') ? "\u0412\u0430\u0448 \u043D\u043E\u043C\u0435\u0440: ".concat(getCookie('roistat_visit')) : '');
      url.searchParams.append('text', message);
      link.href = url.toString();
    });
    $('.js-showcase-cat-radio').on('change', function (e) {
      var categoryId = $(this).val();

      if (e.target.checked) {
        $('.js-showcase-block').hide();
        $(".js-showcase-block[data-category=\"".concat(categoryId, "\"]")).show();

        if (categoryId === 'all') {
          $('.js-showcase-block').show();
        }
      }
    });
    var loadMoreBtn = $('.btn-loadmore');
    loadMoreBtn.on('click', function (event) {
      event.preventDefault();
      var method = loadMoreBtn.attr('data-method'),
          href = loadMoreBtn.attr('href'),
          paged = loadMoreBtn.attr('data-paged'),
          maxPages = loadMoreBtn.attr('data-max'),
          type = loadMoreBtn.attr('data-post');
      $.ajax({
        type: method,
        url: href,
        data: {
          paged: loadMoreBtn.attr('data-paged'),
          type: loadMoreBtn.attr('data-post'),
          action: loadMoreBtn.attr('data-action'),
          month: loadMoreBtn.attr('data-month')
        },
        success: function success(data) {
          paged++;
          loadMoreBtn.parent().prev().append(data);
          loadMoreBtn.attr('data-paged', paged);

          if (Number(paged) === Number(maxPages)) {
            loadMoreBtn.hide();
            $('.js-more-wrapper').addClass('all-posts-display');
          }
        }
      });
    });
  });
  saveMarketingTags();

  function saveMarketingTags() {
    var cookieLifetimeDays = 90;
    var yclid = getUrlParam('yclid');

    if (yclid) {
      setCookie('yclid', yclid, cookieLifetimeDays);
    }

    ;
    var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmParams.forEach(function (param) {
      var value = getUrlParam(param);

      if (value) {
        setCookie(param, value, cookieLifetimeDays);
      }

      ;
    });
  }

  function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name + "=" + value + expires + ";path=/";
  }

  function getUrlParam(p) {
    var match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  $(document).ready(function () {
    setTimeout(function () {
      $('.js-support-btn').trigger('click');
    }, 19000);
    addUtmToTelegramLinks();

    function addUtmToTelegramLinks() {
      var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      var utmParts = [];

      for (var i = 0; i < keys.length; i++) {
        var val = getCookie(keys[i]);

        if (val) {
          utmParts.push(encodeURIComponent(keys[i]) + '=' + encodeURIComponent(val));
        }
      }

      if (utmParts.length === 0) return;
      $('a[href^="https://t.me/"]').each(function () {
        if (!/utm_/.test(this.href)) {
          this.href += (this.href.indexOf('?') >= 0 ? '&' : '?') + utmParts.join('&');
        }
      });
    }

    $('.js-cookie-bar').each(function () {
      var $bar = $(this);
      var $btn = $bar.find('.js-cookie-btn');
      var cookieName = $bar.data('cookie-name');

      if (!getCookie(cookieName)) {
        $bar.removeClass('is-hide');
      }

      $btn.on('click', function () {
        var expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = "".concat(cookieName, "=true; expires=").concat(expires.toUTCString(), "; path=/; SameSite=Lax");
        $bar.addClass('is-hide');
      });
    });
    var previousUrl = null;
    $(document).on('click', '.js-open-popup', function (e) {
      e.preventDefault();
      var $popupTrigger = $(this);
      var popupId = $popupTrigger.data('clzm-popup');
      var $popup = $(popupId);
      if (!$popup.length) return;
      var popupType = $popupTrigger.data('popup-type');
      var bodyClass = $popupTrigger.data('body-class');
      var customUrl = $popupTrigger.data('url');
      var $contentContainer = $popup.find('.js-popup-content');

      if (popupType === 'blog-post') {
        $contentContainer.html('<div class="loader text h1 black">Loading...</div>');
        $.ajax({
          url: trbd_clzm_params.ajax_url,
          data: {
            'post_id': $popupTrigger.data('post-id'),
            'action': 'get_popup_post',
            'nonce': trbd_clzm_params.nonce
          },
          type: 'POST',
          success: function success(response) {
            if (response.success && response.data.post_content) {
              $contentContainer.html(response.data.post_content);
            } else {
              $contentContainer.html('Ошибка загрузки контента');
            }
          }
        });
      } else if (popupType === 'video') {
        var $popupVideoIframe = $popup.find('#popup-video-iframe');
        if (!$popupVideoIframe.length) return;
        var videoUrl = $popupTrigger.attr('href');
        $popupVideoIframe.attr('src', videoUrl);
        $popup.on('clzm-popup-closed', function () {
          $popupVideoIframe.attr('src', '');
        });
      } else if (popupType === 'form') {
        var formTitleElem = $popup.find('.js-popup-form-title');
        var formSubjectInput = $popup.find('.js-hidden-subject');
        var formTypeInput = $popup.find('.js-hidden-form-type');
        var formSource = $popupTrigger.data('form-source');
        var formType = formSource === 'vacancy' ? 'vacancy' : 'franchise';

        if (formTypeInput.length) {
          formTypeInput.val(formType);
        }

        if (formTitleElem.length && trbd_clzm_params.form_settings && trbd_clzm_params.form_settings.title && trbd_clzm_params.form_settings.title[formType]) {
          formTitleElem.html(trbd_clzm_params.form_settings.title[formType]);
        }

        if (formSubjectInput.length) {
          var subject = formType === 'vacancy' ? 'Вакансия' : 'Франшиза';
          var subjectContext = $popupTrigger.text().replace(/\s+/g, ' ').trim();

          if (formSource === 'franchise-configurator') {
            var franchisePlan = $popupTrigger.closest('.js-franchise-configurator').find('.js-franchise-plan-title').text().replace(/\s+/g, ' ').trim();

            if (franchisePlan) {
              subjectContext = franchisePlan;
            }
          } else if (formSource === 'vacancy') {
            var vacancyTitle = $popupTrigger.closest('.js-vacancy-card').find('.js-vacancy-title').text().replace(/\s+/g, ' ').trim();

            if (vacancyTitle) {
              subjectContext = vacancyTitle;
            }
          } else if (formSource === 'franchise-premium') {
            subjectContext = 'Premium';
            formTitleElem.html('<span>COLIZEUM</span> PREMIUM');
          }

          formSubjectInput.val(subjectContext ? "".concat(subject, ": ").concat(subjectContext) : subject);
        }
      } else if (popupType === 'cart') {
        var $miniCartContainer = $('#mini-cart-items');
        var cart = [];

        try {
          var cartData = localStorage.getItem('cart');
          cart = cartData ? JSON.parse(cartData) : [];
          if (!Array.isArray(cart)) cart = [];
        } catch (e) {
          cart = [];
        }

        var productIds = cart.map(function (item) {
          return item.id;
        }).filter(function (id) {
          return id !== undefined;
        });
        $.ajax({
          url: trbd_clzm_params.ajax_url,
          data: {
            'product_ids': productIds,
            'action': 'get_mini_cart',
            'nonce': trbd_clzm_params.nonce
          },
          type: 'POST',
          beforeSend: function beforeSend() {
            $miniCartContainer.html('<div class="loader text h1 black">Loading...</div>');
          },
          success: function success(response) {
            if (response.success && response.data.cart) {
              $miniCartContainer.html(response.data.cart);
            } else {
              $miniCartContainer.html('<div class="error-message">Error loading cart</div>');
              console.error('Error loading cart:', response);
            }
          },
          error: function error(xhr, status, _error) {
            $miniCartContainer.html('<div class="error-message">Connection error</div>');
            console.error('AJAX ошибка:', _error);
          }
        });
      }

      showPopup($popup, bodyClass, customUrl);
    });
    var $articlePopup = $('#clzm-popup-post[data-show="true"]');

    if ($articlePopup.length) {
      showPopup($articlePopup, 'bg-gray');
    }

    var $qrPopup = $('#clzm-popup-qr');

    if ($qrPopup.length) {
      var cookieName = $qrPopup.data('cookie-name');

      if (cookieName && !getCookie(cookieName)) {
        setTimeout(function () {
          showPopup($qrPopup, 'bg-qr-popup');
        }, 11000);
      }
    }

    function showPopup($popup, bodyClass, customUrl) {
      if (customUrl) {
        previousUrl = window.location.href;
        history.pushState(null, '', customUrl);
      }

      $popup.addClass('popup_show');
      $('html').addClass('has-active-popup');
      $('html').addClass('lock');

      if (bodyClass) {
        $('body').addClass(bodyClass);
      }

      var $closeBtn = $popup.find('.js-close-popup');

      if ($closeBtn.length) {
        setTimeout(function () {
          return $closeBtn.addClass('open');
        }, 400);
      }
    }

    function closePopup($popupElement) {
      if (!$popupElement || !$popupElement.length) return;
      var bodyClass = $popupElement.data('body_class');
      var $closeBtn = $popupElement.find('.js-close-popup');

      if ($closeBtn.length) {
        $closeBtn.removeClass('open');
      }

      setTimeout(function () {
        $popupElement.removeClass('popup_show');
        $('html').removeClass('has-active-popup');
        $('html').removeClass('lock');

        if (bodyClass) {
          $('body').removeClass(bodyClass);
        }

        if (previousUrl) {
          history.pushState(null, '', previousUrl);
          previousUrl = null;
        }
      }, 300);
      $popupElement.trigger('clzm-popup-closed');
    }

    $(document).on('click', function (e) {
      if ($(e.target).closest('.js-close-popup').length) {
        closePopup($(e.target).closest('.popup_show'));
        return;
      }

      var $popup = $(e.target).closest('.popup_show');

      if ($popup.length && !$popup.hasClass('js-cookie-bar') && !$(e.target).closest('.js-popup-content').length) {
        closePopup($popup);
      }
    });
    $(window).on('popstate', function () {
      var $activePopup = $('.popup_show');

      if ($activePopup.length) {
        closePopup($activePopup);
      }
    });
    $('body').on('change', '.js-consent-checkbox', function () {
      var form = $(this).closest('.js-form');
      var consentCheckboxes = form.find('.js-consent-checkbox');
      var submitBtn = form.find('.js-form-submit-btn');
      var allChecked = consentCheckboxes.length === consentCheckboxes.filter(':checked').length;
      submitBtn.prop('disabled', !allChecked);
    });
    $('body').on('keypress', '.js-number', function (e) {
      var charCode = e.which ? e.which : e.keyCode;

      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
    });

    function getFormData(formData, data, previousKey) {
      if (data instanceof Object) {
        Object.keys(data).forEach(function (key) {
          var value = data[key];

          if (value instanceof Object && !Array.isArray(value)) {
            return getFormData(formData, value, key);
          }

          if (previousKey) {
            key = "".concat(previousKey, "[").concat(key, "]");
          }

          if (Array.isArray(value)) {
            value.forEach(function (val) {
              formData.append("".concat(key, "[]"), val);
            });
          } else {
            formData.append(key, value);
          }
        });
      }
    }

    var formValidate = function formValidate() {
      var form = $('.js-form');
      form.each(function () {
        var thisForm = $(this);
        var validationConfig = {
          focusInvalid: false,
          highlight: function highlight(element) {
            $(element).closest(".form-field").addClass('form-field--error');
          },
          unhighlight: function unhighlight(element) {
            $(element).closest(".form-field").removeClass('form-field--error');
          },
          submitHandler: function submitHandler(form, event) {
            event.preventDefault();
            thisForm.find('button').prop('disabled', 'disabled');
            var data = new FormData(),
                formParams = thisForm.serializeArray();
            $.each(thisForm.find('.js-input-file'), function (i, tag) {
              $.each($(tag)[0].files, function (i, file) {
                data.append(tag.name, file);
              });
            });
            $.each(formParams, function (i, val) {
              if (val.name === 'phone' || val.name === 'pho_ne') {
                var iti = window.intlTelInput.getInstance(thisForm.find('input[type="tel"]')[0]);
                data.append(val.name, "+".concat(iti.getSelectedCountryData().dialCode, " ").concat(val.value));
              } else {
                data.append(val.name, val.value);
              }
            });
            data.append('key', 'value');

            if (thisForm.parents('[data-block="basket"]').length) {
              var products = JSON.parse(localStorage.getItem('cart'));
              products.forEach(function (product, i) {
                getFormData(data, product, "products[".concat(i, "]"));
              });
            }

            var robots = thisForm.find('[name="robots"]');
            var captcha = thisForm.find('[name="h-captcha-response"]');
            var valid = robots.length && captcha.length ? !robots.val().length && captcha.val().length : true;

            if (valid) {
              $.ajax({
                url: thisForm[0].action,
                type: 'POST',
                processData: false,
                contentType: false,
                data: data,
                beforeSend: function beforeSend(data) {
                  thisForm.find('button').prop('disabled', false);
                  thisForm[0].reset();

                  if (thisForm.parents('[data-block="basket"]').length) {
                    localStorage.removeItem('cart');
                  }

                  var $currentPopup = thisForm.closest('.js-popup');

                  if ($currentPopup.length && $currentPopup.hasClass('popup_show')) {
                    closePopup($currentPopup);
                  }

                  var $thankPopup = $('#clzm-popup-thank');

                  if ($thankPopup.length) {
                    showPopup($thankPopup);
                  }

                  var $select2 = $('.js-select:not(.js-filter-input)');

                  if ($select2.length) {
                    $select2.each(function () {
                      $(this).val('').trigger('change');
                    });
                  }
                },
                success: function success(data) {
                  if (data.data && data.data.ym_counter && data.data.ym_goal_id) {
                    ym(data.data.ym_counter, 'reachGoal', data.data.ym_goal_id);
                  }

                  if (data.data && data.data.tg_event_id && typeof window.tgp === 'function') {
                    window.tgp('event', data.data.tg_event_id);
                    console.log("[Telegram Pixel] Sent event: ".concat(data.data.tg_event_id));
                  }

                  if (data['error']) {
                    console.log('error');
                  }
                },
                error: function error(xhr, ajaxOptions, thrownError) {
                  console.log(xhr.status);
                  console.log(thrownError);
                }
              });
              return false;
            } else {
              thisForm.find('button').prop('disabled', false);
              captcha.before('<div class="captcha-error">Подтвердите что вы не робот!</div>');
            }
          }
        };
        var smartToken = thisForm.find('[name="smart-token"]');
        var validateFormArgs = {
          ignore: ".hidden:not([name='smart-token'])",
          rules: {
            'smart-token': 'required'
          },
          messages: {
            'smart-token': '* Вы должны выполнить антиспам проверку'
          }
        };

        if (smartToken) {
          Object.assign(validationConfig, validateFormArgs);
        }

        thisForm.validate(validationConfig);
      });
    };

    formValidate();
    window.formValidate = formValidate;
    $('body').on('click', 'label.error', function () {
      $(this).hide().siblings('input,textarea').focus();
    });
    $('body').on('keyup', 'input', function () {
      $(this).siblings('label.error').hide();
    });
    var $telegramInput = $('input[name="telegram"]');
    var TELEGRAM_REGEX = /[^a-zA-Z0-9@_\-]/g;
    $telegramInput.on('input', function () {
      $(this).val($(this).val().replace(TELEGRAM_REGEX, ''));
    });
    $telegramInput.on('paste', function (e) {
      e.preventDefault();
      var clipboardData = e.originalEvent.clipboardData || window.clipboardData;
      var pastedText = clipboardData.getData('text');
      var filteredText = pastedText.replace(TELEGRAM_REGEX, '');
      document.execCommand('insertText', false, filteredText);
    });
  });
})(jQuery);