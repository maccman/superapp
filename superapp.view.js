
if (typeof jQuery.support.CSSAnimation == "undefined")
  jQuery.support.CSSAnimation = (typeof WebKitTransitionEvent != "undefined");
  
SuperApp.view = new SuperClass();

SuperApp.view.extend({
  current: null,
  elementSelector: "#views",
  animations: jQuery.support.CSSAnimation,
  observers: [],

  findAnimation: function(fview, tview) { },
  
  element: function(){
    return jQuery(this.elementSelector);
  },
  
  elements: function(){
    return this.element().find("[data-view=*]");
  },
  
  findView: function(name){
    return this.element().find("[data-view='" + name + "']:first");
  },
  
  equal: function(fview, tview){
    return(fview[0] == tview[0]);
  },
  
  callback: function(fromView, toView, animation){
    if (animation){
      toView.removeClass("in " + animation);
      if(fromView) fromView.removeClass("current out " + animation);
    } else {
      if(fromView) fromView.removeClass("current");
    }
    this.current = toView;
  },
  
  change: function(name){
    var fromView = this.current;
    var toView   = this.findView(name);
    
    if (fromView && this.equal(fromView, toView)) return;
    
    var animation;
    if ( this.animations ) 
  		animation = this.findAnimation(fromView, toView);
  			
    if (animation){
      var self = this;
      var callback = function(){
        self.callback(fromView, toView, animation);
      };
      toView.one("webkitAnimationEnd", callback);
      toView.addClass(animation + " in current");
      if (fromView) fromView.addClass(animation + " out");
    } else {
      toView.addClass("current");
      this.callback(fromView, toView);
    }
    
    for (var i in this.observers) {
      this.observers[i](toView);
    }
  },
  
  onChange: function(cb){
    this.observers.push(cb);
  }
});

if (typeof SuperApp != "undefined") {
  
  SuperApp.include({
    initWithView: function(){
      jQuery(jQuery.proxy(this.viewLoad, this));
      this.initWithoutView.apply(this, arguments);
    },
    
    viewLoad: function(){
      if ( !this.view ) return;
      this.viewElement = this.findView();
      this.setupElements();      
    },
    
    findView: function(){
      return this._class.view.findView(this.name);
    },
    
    elementNames: function(){
      var self = this;
      var elements = self.viewElement.find("[data-element]");
      return jQuery.map(elements, function(item, i){ 
        return jQuery(item).attr("data-element");
      });
    },

    setupElements: function(){
      var self = this;
      // We're doing it in this convoluted way, so live events still work.
      jQuery.each(this.elementNames(), function(i, name){
        self[name] = self.viewElement.find("[data-element='" + name + "']");
      });
    }
  });
  
  SuperApp.fn.aliasMethodChain("init", "View");
  
  SuperApp.onChange(function(name){
    var view = SuperApp.current.view;
    if (view == true) view = SuperApp.current.name;
    if (view) SuperApp.view.change(view);
  });
}