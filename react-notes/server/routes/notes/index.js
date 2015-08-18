'use strict';

var express = require('express');
var controller = require('./notes.controller');

var router = express.Router();


router.get('/', controller.getNotes);
router.post('/', controller.createNote);
router.delete('/:note_id', controller.deleteNote);
router.get('/:note_id', controller.getNoteById);
router.post('/:note_id', controller.updateNote);


module.exports = router;