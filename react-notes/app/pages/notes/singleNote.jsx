/* jshint node: true */
"use strict";

var React = require("react"),
    _ = require("underscore"),
    
    dispatcher = require("dispatcher"),
    emitter = require("emitter"),
    constants = require("constants").notes;
  
   
module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
  
        dispatcher.dispatch({ type: constants.read, content: this.context.router.getCurrentParams().noteID });
        return {
            note: "",
            isError: false
        }  
    },

  componentDidMount: function() {
        
        emitter.on(constants.changed, function(note) {
        	this.updateNote(note);
        }.bind(this));
        emitter.on(constants.error, function(notes) {
            if(this.isMounted())
                this.setState({ isError: true });
        }.bind(this));
    },

    
  componentsWillUnmount: function() {
        
        emitter.off(constants.read);
    },
  componentWillReceiveProps: function(nextProps) {
      if(this.isMounted())
        this.setState(this.getInitialState(nextProps));
    },
  
  renderContent: function() {
         return  ( <div><h1>Note id: {this.state.note.id}</h1> 
          <div>Note:- {this.state.note.name}</div></div> );
    },

  updateNote: function(note){
        if(!this.isMounted()){
           return; 
        }
       this.setState({ note: note });
    },

  render: function () {
    var { router } = this.context;
    var errors = (this.state.isError) ? <ErrorNotice /> : <div></div>;
	  
    return (
      <div className="Notes">
       {errors}
       <div>{this.renderContent()}</div>
      </div>
    );
  }
});