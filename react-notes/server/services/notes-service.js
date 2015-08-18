'use strict';
var _ = require('underscore');
var low = require('lowdb');
var db = low('server/data/notes.json');


exports.getNotes = function(){
	return db("notes").value();
};

exports.getNoteById = function(noteId){
	return db("notes").find({"id":parseInt(noteId)}).value();
};

exports.createNote = function(noteName,isComplete,id){
	 db("notes").push({"name": noteName , "isComplete": false , "id" : id});
	return db("notes").value();
};

exports.updateNote = function(noteName,isComplete,id){

	 db('notes').chain().find({ "id": id }).assign({ "name": noteName}).value();
	 db.save();
	 return db('notes').value();
};

exports.deleteNote = function(noteId){
	db("notes").remove({"id":noteId});
	return db("notes").value();
};
