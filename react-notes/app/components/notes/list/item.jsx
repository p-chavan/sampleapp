/* jshint node: true */
"use strict";

var constants = require("constants").notes,
    dispatcher = require("dispatcher");



module.exports = React.createClass({
	
	getInitialState: function() {
        return { shouldHide: false };
    },
    toggle: function() {
        this.props.note.isComplete = !this.props.note.isComplete;
        dispatcher.dispatch({ type: constants.remove, content: this.props.note });
    },

    editContent: function() {
 		this.state.saveTxt = this.props.note.name;
    	this.setState({ shouldHide: true });
    },
    saveContent: function() {
    	this.props.note.name = this.refs.inputText.getDOMNode().value || this.state.saveTxt;
    	this.setState({ shouldHide: false });
    	dispatcher.dispatch({ type: constants.update, content: this.props.note });
    },
    handleInput: function(evt) {
        if (evt.keyCode == 13 ) {
             return this.saveContent();
        }
    },
    
    render: function() {
        var hash = '#/notes/' + this.props.note.id;

        return <li className="list-group-item pointer">
        <span onClick={this.editContent} className={this.state.shouldHide ? 'hidden' : ''}>{this.props.note.name}</span>
        <input type="text" className={this.state.shouldHide ? '' : 'hidden'} ref="inputText"  onKeyDown={this.handleInput}/>
        <span className="pd10"><a href={hash} className={this.state.shouldHide ? 'hidden' : ''} >View</a></span>
        <span><a href="#" className={this.state.shouldHide ? 'hidden' : ''} onClick={this.toggle}>Delete</a></span>
        </li>; 
    } 
});