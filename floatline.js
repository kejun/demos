!function(win, doc){

jQuery.extend(jQuery.easing, {
  easeOutExpo: function (x, t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  }
});

var $win = $(win),
    $doc = $(doc),
    CSS_ITEM = '.stream-item',
    CSS_LINE = '.float-line',
    NODE_LINE = '<div class="float-line" style="display:none;position:absolute;top:0;left:50%;margin-left:-475px;z-index:999;width:1px;height:100px;background-color:blue;overflow:hidden;"></div>',
    TRANS_TIME = 1000,
    TRANS_FUNC = 'easeOutExpo',
    timeout,
    hideLineTimer,

floatLine = {

currentItem: null,

getLine: function(){
  var line = $(CSS_LINE);
  if (line.length === 0) {
    line = $(NODE_LINE).appendTo('body');
  }
  return line;
},

moveTo: function(targetNode, interval) {
  var targetPos = targetNode.offset(),
  line = floatLine.getLine().css('opacity', 1).show();

  floatLine.currentItem = targetNode;
  $('html,body').stop().animate({
      scrollTop: targetPos.top - 50
  },
  interval,
  TRANS_FUNC);

  line.stop().animate({
    top: targetPos.top,
    height: targetNode.height() 
   },
   interval,
   TRANS_FUNC,
   function() {
     hideLineTimer = win.setTimeout(function(){
       line.fadeOut();
     }, 3000);
   });
},

getCurrentItem: function(){
  var items = $(CSS_ITEM), index = 0, item, itemPos, t = $win.scrollTop();
  for (; item = items.eq(index++); ) {
    itemPos = item.offset();
    if (itemPos.top > t) {
      return item;
    }
  }
},

prev: function(speed){
  var targetNode = floatLine.currentItem.prev();
  if (targetNode.length === 0) {
    return;
  }
  setTimeout(function(){
    floatLine.moveTo(targetNode, typeof speed === 'undefined'? TRANS_TIME : speed );
  }, 0);
},

top: function(){
  $('html,body').stop().animate({
      scrollTop: 0
  },
  100,
  TRANS_FUNC);
},

next: function(speed){
  var targetNode = floatLine.currentItem.next();
  if (targetNode.length === 0) {
    return;
  }
  setTimeout(function(){
    floatLine.moveTo(targetNode, typeof speed === 'undefined'? TRANS_TIME : speed);
  }, 0);
},

init: function(){
    floatLine.currentItem = floatLine.getCurrentItem();
    $win.bind('scroll', function(){
        hideLineTimer && win.clearTimeout(hideLineTimer);
        timeout && win.clearTimeout(timeout);
        timeout = win.setTimeout(function(){
           floatLine.currentItem = floatLine.getCurrentItem();
        }, 500);
    });
}
};

var keys = [],
    keyTimer,
    specialKeys = {
      13: 'return'
    },
    abc = [
      'a','b','c','d','e','f','g',
      'h','i','j','k','l','m','n',
      'o','p','q','r','s','t','u',
      'v','w','x','y','z'
    ],
    num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    getKeyName = function(code) {
      if (code > 64 && code < 91) {
        return abc[code - 65];
      }
      if (code > 47 && code < 58) {
        return num[code - 48];
      }
      return specialKeys[code];
    },
    keyHandler = {
      'j': function() {
        floatLine.next();
        $doc.trigger('shortcuts:j');
      },
      'k': function() {
        floatLine.prev();
        $doc.trigger('shortcuts:k');
      },
      'return': function() {
        floatLine.currentItem.trigger('click');
        $doc.trigger('shortcuts:return');
      },
      'gh': function() {
        floatLine.top();
        $doc.trigger('shortcuts:gh');
      },
      'gp': function() {
        $doc.trigger('shortcuts:gp');
      },
      'gs': function() {
        $doc.trigger('shortcuts:gs');
      }
    };

$doc.bind('keydown', function(e){
    if (e.target.tagName.search(/input|textarea/i) + 1) {
       if (e.keyCode === 27) {
         e.target.blur();
       }
      return;
    }

    var keyName = getKeyName(e.keyCode); 

    if (keyName === 'g') {
       keys = ['g'];
       return;
    }

    if (keys.length) {
       keys.push(keyName);
       if (typeof keyHandler[keys.join('')] === 'function') {
          keyHandler[keys.join('')]();
       }
       keys = [];
       return;
    }

    win.clearTimeout(keyTimer);
    if (typeof keyHandler[keyName] === 'function') {
      keyTimer = win.setTimeout(keyHandler[keyName], 20);
    }
}).
bind('keyup', function(){
    win.clearInterval(keyTimer);
});

floatLine.init();

floatLine.shortcuts = {
  setHandler:  function(keys, func) {
    keyHandler[keys] = func;
  }
};

win.floatLine = floatLine;

}(window, document);
