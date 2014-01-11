var contextPath = "/topping/";
var mediator = _.extend({}, Backbone.Events);

//Model og Collection
var Reservasjon = Backbone.Model.extend({
  urlRoot: contextPath + 'reservasjoner/',
  validation: false
});

var Reservasjoner = Backbone.Collection.extend({
  url: contextPath + 'reservasjoner/',
  model: Reservasjon,
  sort: false
});

// View
var NavigationView = Backbone.View.extend({
  el: '#reservasjonerNavigering',

  initialize: function(options){
    this.mediator = options.vent;
    _.bindAll(this, "render");
    options.vent.bind("romValgt", this.render);

  }

});

var navigationView = new NavigationView({vent: mediator});


//Router, her starter applikasjonen.
var Router = Backbone.Router.extend({
  routes: {
    "": "home"
  }
});

var router = new Router;

router.on('route:home', function () {
});

Backbone.history.start();

