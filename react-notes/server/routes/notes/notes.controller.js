/**
 * Using below standard naming convention for endpoints.
 * GET     /notes              ->  index
 * POST    /notes              ->  create
 * GET     /notes/:id          ->  show
 * PUT     /notes/:id          ->  update
 * DELETE  /notes/:id          ->  destroy
 */
'use strict';

var notesservice = require('../../services/notes-service.js');

exports.getNotes = function(req, res) {
	var returnStr = notesservice.getNotes();
	res.json(returnStr);
};

exports.createNote = function(req, res){
	var noteName = req.body.name;
	var isComplete = req.body.isComplete;
	var id = parseInt(req.body.id);
	res.json(notesservice.createNote(noteName,isComplete,id));
};

exports.updateNote = function(req, res){
	var noteName = req.body.name;
	var isComplete = req.body.isComplete;
	var id = parseInt(req.body.id);
	res.json(notesservice.updateNote(noteName,isComplete,id));
};

exports.deleteNote = function(req, res){
	var noteId = parseInt(req.params.note_id);
	res.json(notesservice.deleteNote(noteId));
};

exports.getNoteById = function(req, res) {
	var noteId = parseInt(req.params.note_id);
	var returnStr = notesservice.getNoteById(noteId);
	res.json(returnStr);
};
