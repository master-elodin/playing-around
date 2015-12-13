define(function (require) {
  var router = require('plugins/router');

  return {
     router: router,
     activate: function () {
       router.map([
         { route: '', title:'Home', moduleId: 'game', nav: true }
       ]).buildNavigationModel();

       return router.activate();
     }
   };
});
