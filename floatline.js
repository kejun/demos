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
  line = floatLine.getLine().show();

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
   TRANS_FUNC
   );
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
        timeout && win.clearTimeout(timeout);
        timeout = win.setTimeout(function(){
           floatLine.currentItem = floatLine.getCurrentItem();
        }, 500);
    });
}
};

win.floatLine = floatLine;


var keyTimer,
    keyMap = {
      74: 'j',
      75: 'k',
      71: 'g',
      13: 'return'
    },
    keyHandler = {
      'j': function() {
        floatLine.next();
      },
      'k': function() {
        floatLine.prev();
      },
      'return': function() {
        floatLine.currentItem.trigger('click');
      }
    };

$doc.bind('keydown', function(e){
    if (e.target.tagName.search(/input|textarea/i) + 1) {
      return;
    }
    var keyName = keyMap[e.keyCode]; 
    win.clearTimeout(keyTimer);
    if (typeof keyHandler[keyName] === 'function') {
      keyTimer = win.setTimeout(keyHandler[keyName], 20);
    }
}).
bind('keyup', function(){
    win.clearInterval(keyTimer);
});

floatLine.init();

}(window, document);
