/* jshint node: true */
"use strict";

var _ = require("underscore"),
    Item = require("./item");


module.exports = React.createClass({
   
    renderItems: function() {
        return this.props.notes.map(function(note) {
           return <Item key={note.id} note={note}/>;
        });
        
    },

    render: function() {
        return <ul className="list-group">
            {this.renderItems()}
        </ul>;
    } 
});