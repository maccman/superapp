var SuperApp = new SuperClass();

SuperApp.extend({
  states: {},
  current: null,
  observers: [],
  
  addState: function(name, options){
    var state = new this(name, options);
    this.states[name] = state;
  },
  
  change: function(){
    var args = jQuery.makeArray(arguments);  
    var name = args.shift();
    
    var previous = this.current;
    var state    = this.states[name];
    
    if ( !state ) throw "Unknown state: " + name;
    
    // if ( state == previous ) return;
    
    state.runSetup();
    previous.beforeExit();
    state.beforeEnter.apply(state, args);
    
    this.current = state;
    
    state.afterEnter();
    previous.afterExit();
    
    for (var i in this.observers) {
      this.observers[i](name);
    }
  },
  
  setup: function(){
    this.current = new this;
  },
  
  onChange: function(cb){
    this.observers.push(cb);
  }
});

SuperApp.include({
  load:        function(){},
  setup:       function(){},
  beforeEnter: function(){},
  afterEnter:  function(){},
  beforeExit:  function(){},
  afterExit:   function(){},
  
  init: function(name, options){
    this.name = name;
    jQuery.extend(this, options || {});
    jQuery(this.proxy(this.load));
  },
  
  runSetup: function(){
    if ( !this.hasSetup ) {
      this.hasSetup = true;
      this.setup();
    }
  },
  
  async: function(callback){
    setTimeout(this.proxy(callback), 20);
  }
});

SuperApp.setup();