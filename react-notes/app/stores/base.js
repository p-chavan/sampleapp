"use strict";

var _ = require("underscore"),
    emitter = require("emitter"),
    dispatcher = require("dispatcher"),
    constants = require("constants");

module.exports = function(url, constants) {
    this._url = url;
    this._collection = [];
    
    $.get(this._url).then(function(data) {
        this._collection = data;
        _notify.call(this);
    }.bind(this));
    
    dispatcher.register(function(payload) {
        switch (payload.type) {
            case constants.all:
                this._all();
                break;
                
            case constants.update:
                this._update(payload.content);
                break;
                
            case constants.create:
                this._create(payload.content);
                break

            case constants.remove:
                this._remove(payload.content);
                break; 

            case constants.read:
                this._read(payload.content);
                break;        
            }
    }.bind(this));
    
    this._all = function() {
        _notify.call(this);
    };
    
    this._update = function(content) {
       
        _ajaxCall(content,constants.api+content.id,'POST').done(function(result) {
             this._collection = result;
             _notify.call(this);

        }).fail(function() {
            _notifyError.call(this);
        });
    };
    
    this._create = function(content) {
        content.id = _.max(this._collection, function(x) { return x.id; }).id + 1;
        _ajaxCall(content,constants.api,'POST').done(function(result) {
             this._collection = result;
             _notify.call(this);
           
        }).fail(function() {
            _notifyError.call(this);
        });
    };


    this._remove = function(content) {
        
       _ajaxCall('',constants.api+content.id,'DELETE').done(function(result) {
             this._collection = result;
             _notify.call(this);

        }).fail(function() {
            _notifyError.call(this);
        });
    };

    this._read = function(content) {

       _ajaxCall('',constants.api+content,'GET').done(function(result) {
             this._collection = result;
             _notify.call(this);

        }).fail(function() {
            _notifyError.call(this);
        });
        
    };

    function _ajaxCall(content,url,type){
        return $.ajax({
            url:  url,
            type: type,
            data: content       
        });
    }
   
    function _notify() {
        emitter.emit(constants.changed, this._collection);
    }
    function _notifyError() {
        emitter.emit(constants.error,"");
    }
};