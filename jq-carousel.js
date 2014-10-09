/**
 ** jq-carousel
 ** Author    : fsbeta(154274174@qq.com)
 ** Date      : 2013-04-03
 ** Arguments :
 ** tab       : String(jquery css selector)
 **             when user acts on the tab, the items scroll
 ** container : String(jquery css selector)
 **             the box that contains the items
 ** item      : String(jquery css selector)
 **             the item that scroll in the container
 ** interval  : Number(default 0)
 **             if it's greater than 0, the items will scroll every interval ms
 ** prev      : String(jquery css selector)
 **             when user acts on the prev button, it scroll to the previous item
 ** next      : String(jquery css selector)
 **             when user acts on the next button, it scroll to the next item
 ** next      : String(jquery css selector)
 **             when user acts on the next button, it scroll to the next item
 ** direction : "h" || "v" || "no"
 **             "h"   : scroll horizontally(default)
 **             "v"   : scroll vertically
 **             "no"  : no scroll
 ** duration  : Number
 **             the scroll animation duration
 ** trigger   : String(jQuery Event String, "click"/"mouseover"/"dblclick" etc.)
 **             the event that triggers the scroll or other actions on tabs and prev/next buttons.
 ** onClass   : String
 **             the class name that attach to the active tab.
 ** hoverStop : Boolean
 **             Stop playing animation when mouse over if hoverStop = true
 ** callback  : Function
 **             Triggers when an animation end
 **/
$.fn.jqCarousel = function(param){
    var param = param || {};
    this.each(function(){
      var elem = $(this);
      var p = {
        tab : elem.find(param.tab),
        ctn : elem.find(param.container),
        itm : elem.find(param.item),
        itv : param.interval,
        prev : elem.find(param.prev),
        next : elem.find(param.next),
        dir : param.direction || "h",
        dura : param.duration || 500,
        trig : param.trigger || "mouseover",
        oncls : param.onClass || "on",
        hoverStop : param.hoverStop===true ? false : true,
        callback: typeof(param.callback) === 'function' ? param.callback : (function () {})
      };
      
      //initialize the properties
      elem.currentIndex = 0;
      elem.timer;
      
      //Set the style
      elem.css({
        "zoom" : 1
      }).show();
      p.ctn.css({
        "position" : "relative",
        "overflow" : "hidden"
      }).show();
      p.itm.css({
        "position" : "absolute"
      }).show();
      for(var j=0;j<p.itm.length;j++){
        if(p.dir=="v"){
          (function(jj){
            var totalHeight = 0;
            for(var i=1;i<=jj;i++){
              totalHeight += p.itm.eq(i-1).outerHeight(true);
            }
            p.itm.eq(jj).css("top",totalHeight).attr("oriTop",totalHeight);
          })(j);
        }else{
          (function(jj){
            var totalWidth = 0;
            for(var i=1;i<=jj;i++){
              totalWidth += p.itm.eq(i-1).outerWidth(true);
            }
            p.itm.eq(jj).css("left",totalWidth).attr("oriLeft",totalWidth);
          })(j);
        }
      }

      //Define Methods
      elem.go = function(idx){
        p.tab.removeClass(p.oncls);
        p.tab.eq(idx).addClass(p.oncls);
        if(p.dir=="v"){
          var totalHeight = 0;
          for(var i=1;i<=idx;i++){
            totalHeight += p.itm.eq(i-1).outerHeight(true);
          }
          p.itm.each(function(){
            var oriTop = $(this).attr("oriTop");
            $(this).stop().animate({
              "top" : oriTop-totalHeight
            },p.dura, callback.call(this));
          });
        }else{
          var totalWidth = 0;
          for(var i=1;i<=idx;i++){
            totalWidth += p.itm.eq(i-1).outerWidth(true);
          }
          p.itm.each(function(){
            var oriLeft = $(this).attr("oriLeft");
            if(p.dir=="no"){
              $(this).stop().css({
                "left" : oriLeft-totalWidth
              });
            }else{
              $(this).stop().animate({
                "left" : oriLeft-totalWidth
              },p.dura, callback.call(this));
            }
          });
        }
        elem.currentIndex = idx;
      };
      elem.next = function(){
        var idx = elem.currentIndex;
        idx++;
        if(idx>=p.itm.length) idx = 0;
        elem.go(idx);
      };
      elem.prev = function(){
        var idx = elem.currentIndex;
        idx--;
        if(idx<0) idx = p.itm.length-1;
        elem.go(idx);
      };
      elem.play = function(){
        if(p.itv>0){
          elem.timer = window.setInterval(function(){
            elem.next();
          },p.itv+p.dura);
        }
      };
      elem.stop = function(){
        window.clearInterval(elem.timer);
      };
      
      //Define Actions
      for(var ii = 0; ii < p.itm.length; ii++){
        (function(idx){
          p.tab.eq(idx).mouseover(function () {
            elem.stop();
          })[p.trig](function () {
            elem.go(idx);
          });
        })(ii);
      }

      p.tab.mouseout(function () {
        elem.play();
      });

      if (p.hoverStop === true) {
        p.itm.hover(function () {
          elem.stop();
        }, function () {
          elem.play();
        });
      }

      p.prev[p.trig](function () { elem.prev(); });
      p.next[p.trig](function () { elem.next(); });

      elem.go(0);
      elem.play();
    });
  return this;
};
