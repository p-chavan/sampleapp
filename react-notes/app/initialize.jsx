/* jshint node: true */
"use strict";

require("stores");

var React = require("react");
var ReactRouter = require("react-router");

var { Route, RouteHandler, Link } = ReactRouter;
var DefaultRoute = ReactRouter.DefaultRoute;

var App = React.createClass({
	render: function () {
		return (
     		 <RouteHandler/>
   		 );
	}
});

var Notes = require("pages/notes/index");


var Note = require("pages/notes/singleNote");

var routes = (	
  <Route handler={App} path="/">
      <DefaultRoute handler={Notes} />
    <Route name="note" path="/notes/:noteID" handler={Note}/>
  </Route>
);

ReactRouter.run(routes,function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});