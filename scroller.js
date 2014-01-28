;(function($) {
var scroller = function(root, options) {
  if (root.length == 0) {
    return;
  }

  options = $.extend({
    displayControls: true, 
    displayIndicator: true, 
    duration: 500,
    selectorContent: '.bd',
    selectorItem: 'li',
    cssButtonNext: 'bn-scroller-next',
    cssButtonPrev: 'bn-scroller-prev',
    cssButtonDisable: 'bn-scroller-disable',
    cssIndicatorDot: 'bn-scroller-dot',
    cssIndicatorSelected: 'bn-scroller-dot-selected'
  }, options);

  var supportTransition = (function() {
    var d = document.createElement('div');
    var pre = ['webkit', 'moz', 'ms', 'o'];
    while (d.style[pre.shift() + 'Transition'] !== undefined) return true;
    return d.style.transition !== undefined;
  })();

  var content = root.find(options.selectorContent);
  var items = root.find(options.selectorItem);
  var frames = [];
  var frame = [];

  root.css({
    'position': 'relative',
    'width': options.width || root.width(), 
    'height': options.height || root.height() 
  });

  content.css({
    'position': 'absolute',
    'left': 0,
    'webkitTransition': 'left ' + options.duration / 1000 + 's',
       'mozTransition': 'left ' + options.duration / 1000 + 's',
        'msTransition': 'left ' + options.duration / 1000 + 's',
         'oTransition': 'left ' + options.duration / 1000 + 's',
          'transition': 'left ' + options.duration / 1000 + 's',
    'white-space': 'nowrap'
  });

  var limitWidth = root.width();
  var w = 0;
  var offset = 0;
  $.each(items, function(i) {
    var itm = items.eq(i);
    var itemWidth = itm.outerWidth()
                  + parseInt(itm.css('margin-left'), 10)
                  + parseInt(itm.css('margin-right'), 10)
                  + parseInt(itm.css('padding-left'), 10)
                  + parseInt(itm.css('padding-right'), 10)
    itm.data('index', i);
    itm.data('offset', offset);
    offset += itemWidth;
    if (w + itemWidth > limitWidth) {
      if (frame.length) {
        frames.push(frame);
      }
      frame = [itm];
      w = itemWidth;
    } else {
      w += itemWidth;
      frame.push(itm);
    }

    if (i == items.length - 1) {
      frames.push(frame);
    }
  });

  (frames[frames.length - 1][0]).data('offset', content.width() - root.width());

  var bnNext = root.find('.' + options.cssButtonNext);
  var bnPrev = root.find('.' + options.cssButtonPrev);
  if (options.displayControls) {
    if (bnNext.length == 0) {
      bnNext = $('<a href="#" class="' + options.cssButtonNext + '">&gt;</a>');
      bnNext.appendTo(root);
    } else {
      bnNext.show();
    }
    if (bnPrev.length == 0) {
      bnPrev = $('<a href="#" class="' + options.cssButtonPrev + '">&lt;</a>');
      bnPrev.appendTo(root);
    } else {
      bnPrev.show();
    }
  }

  if (!options.displayControls || frames.length == 1) {
    bnNext.hide();
    bnPrev.hide();
  } else {
    bnNext.show();
    bnPrev.hide();
  }

  var current = 0;

  bnNext.unbind().bind('click', function(e) {
    e.preventDefault();
    current += 1;
    root.trigger('scroller:change', {index: current});
  });

  bnPrev.unbind().bind('click', function(e) {
    e.preventDefault();
    current -= 1;
    root.trigger('scroller:change', {index: current});
  });


  root.bind('scroller:change', function(e, o) {
    bnNext.show();
    bnPrev.show();
    if (o.index + 1 > frames.length - 1) {
      bnNext.hide();
    }
    if (o.index - 1 < 0) {
      bnPrev.hide();
    }
    if (supportTransition) {
      content.css('left', -(frames[o.index][0]).data('offset'));
    } else {
      content.animate({'left': -(frames[o.index][0]).data('offset')}, options.duration);
    }
  });

}

$.fn.scroller = function(options) {
  $.each(this, function() {
    scroller($(this), options || {});
  });
};

})(jQuery);
