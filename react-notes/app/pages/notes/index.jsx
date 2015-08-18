/* jshint node: true */
"use strict";

var React = require("react"),
    _ = require("underscore"),
    
    List = require("../../components/notes/list"),
    Modal = require("../../components/notes/modal"),
    ErrorNotice = require("../../components/notes/ErrorNotice"),
    dispatcher = require("dispatcher"),
    emitter = require("emitter"),
    constants = require("constants").notes;
   
module.exports = React.createClass({
    getInitialState: function() {
        return {
            notes: [],
            isError :false
        }  
    },

    componentWillMount: function() {
        emitter.on(constants.changed, function(notes) {
            if(this.isMounted())
                 this.setState({ notes: notes });
        }.bind(this));
        emitter.on(constants.error, function(notes) {
            if(this.isMounted())
                this.setState({ isError: true });
        }.bind(this));

    },
    
    componentDidMount: function() {
        dispatcher.dispatch({ type: constants.all });
    },
    
    componentsWillUnmount: function() {
        emitter.off(constants.all);
    },
    
    create: function() {
        this.refs.create.show();
    },
    
    renderList: function(complete) {
        return <List notes={_.filter(this.state.notes, function(x) { return x.isComplete === complete; })} />;
    },
    
    render: function() {
        var errors = (this.state.isError) ? <ErrorNotice /> : <div></div>;
        return <div className="container">
            {errors}
            <div className="row">
                <div className="col-md-8">
                    <h2>Note List</h2>
                </div>
                <div className="col-md-4">
                    <button type="button" className="btn btn-primary pull-right spacing-top" onClick={this.create}>New Note</button>    
                </div>
            </div>
                    
            <div className="row">
                <div className="col-md-8">
                    <h4 className="spacing-bottom">Below is the list of incomplete notes.</h4>
                    {this.renderList(false)}
                </div>        
            </div>
            
            <Modal ref="create" />
            
        </div>;
    }
});