;(function() {
  var doc = $(document);
  var docRoot = $('html');
  var docBody = $('body');
  var defaultOptions = {};

  var TEMPL_UI = [
   '<div class="pi-mask" style="display:none;">',
   '<div class="pi-x"></div>                   ',
   '<div class="pi-container">                 ',
   '  <div class="hd"></div>                   ',
   '  <div class="bd"></div>                   ',
   '</div>                                     ',
   '</div>                                     '
  ].join('');

  var TEMPL_ANCHOR = '<div class="pi-anchor"></div>';

  function Previewer() {
    this.init();
  };

  Previewer.prototype = {
    init: function() {
      var o = this;
      this.mask = $(TEMPL_UI).appendTo(docBody);
      this.anchor = $(TEMPL_ANCHOR).prependTo(docBody); 
      this.container = this.mask.find('.pi-container');
      this.header = this.mask.find('.pi-container > .hd');
      this.body = this.mask.find('.pi-container > .bd');

      doc.delegate('.pi-mask', 'click', function(e) {
        if (e.target == o.container[0]
          || $.contains(o.container[0], e.target)) {
          return;
        }
        o.close();
      });

      doc.bind('keyup', function(e) {
        if (!(/input|textarea/i.test(e.target.tagName))
          && e.keyCode === 27) {
          o.close();
        }
      });
    },

    open: function(options) {
      this.options = $.extend({}, defaultOptions, options || {});
      var top = this.docTop = doc.scrollTop();
      this.anchor.show().css({
        marginTop: -top
      });
      docRoot.addClass('pi-show');
      this.mask.show();
    },

    close: function() {
      docRoot.removeClass('pi-show');
      this.anchor.hide();
      doc.scrollTop(this.docTop);
      this.mask.hide();
    },

    setContent: function() {}
  };

  if (!$.previewImage) {
    $.previewImage = new Previewer();
  }
})();
