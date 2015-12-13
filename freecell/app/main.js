requirejs.config({
  paths: {
    'text': 		'../lib/require/text',
    'durandal':		'../lib/durandal/js',
    'plugins' : 	'../lib/durandal/js/plugins',
    'transitions' : '../lib/durandal/js/transitions',
    'knockout': 	'../lib/knockout/knockout-3.1.0',
	  'koMapping': 	'../lib/knockout/knockout.mapping-2.4.1.min',
    'jquery': 		['//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min', '../lib/jquery/jquery-1.9.1'],
    'accounting':	'../lib/accounting/accounting.min'
    }
});

define([ 'durandal/system', 'durandal/app', 'knockout' ], function ( system, app, ko ) {

   system.debug( true );

   if( system.debug() ){
	   window.ko = ko;
   }

   app.title = 'Free Cell';

   app.configurePlugins({
     router:true,
     dialog: true
   });

   app.start().then(function() {
     app.setRoot('shell');
   });
});
