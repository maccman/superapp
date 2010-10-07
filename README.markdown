#Introduction

SuperApp is a basic framework for building JavaScript web applications. 
It's comprised of a class abstraction, state machine and view manager.

SuperApp's main goal is to be simple and flexible - yet still provide structure to your code.

Also check out [SuperModel](http://github.com/maccman/supermodel-js) for managing data.


#SuperClass

SuperClass is a class abstraction. It provides:

* Inheritance
* Easy class/instance function extension
* Context Proxy (see example)

Example: 

    var Menu = new SuperClass;
    
    // Add class functions
    Menu.extend({
      key: value,
      
      foo: function(){
        
      }
    });
    
    // Add instance functions
    Menu.include({
      init: function(foo){
        $("#menu").click(this.proxy(this.click));
      }
    });
    
    new Menu("foo");
    

#SuperApp

SuperApp is a state machine, the callbacks available are documented below.

    var App = new SuperClass;
    App.extend(SuperEvent);

    App.extend({
      state: new SuperApp,
    });
    
    
    (function($){

    var state = App.state.add("search");

    state.load(function(){
      // On page load
    });

    state.setup(function(){
      // When first entered
    });

    state.beforeEnter(function(query){
    });
    
    state.afterEnter(function(){
      
    });

    })(jQuery);
    
    App.state.change("search", "query");

    
    App.state.change(function(to, state){
      // change callback
    })
    
#SuperApp.view

This does two things for you:

* Switches view when state changes
* Automatically populates data-element variables

Example:

    <style type="text/css" media="screen">
      #views > *:not(.current) {
        visibility: hidden !important;
      }
    </style>

    <script src="jquery.js" type="text/javascript" charset="utf-8"></script>
    <script src="superclass.js" type="text/javascript" charset="utf-8"></script>
    <script src="superapp.js" type="text/javascript" charset="utf-8"></script>
    <script src="superapp.view.js" type="text/javascript" charset="utf-8"></script>

    <script type="text/javascript" charset="utf-8">
      var app = new SuperApp;
      
    
      var state = app.add("view1");
      
      state.beforeEnter(function(){
        // #view1 div
        this.viewElement.height(100);
        
        // variable automatically populated from
        // data-element span in the view
        this.userName.text("wem");
      });
      
      state.hasView = true;
      
      var state2 = app.add("view2");
      state2.hasView = true;
  
      var state2 = app.add("view2");
      state2.hasView = true;
    
      jQuery(function(){
        app.view = new SuperApp.View($("#views"));
        app.change("view1");
      })
    </script>

    <div id="views">
      <div data-view="view1">
        <span data-element="userName"></span>
      </div>
      <div data-view="view2">
      </div>
    </div>