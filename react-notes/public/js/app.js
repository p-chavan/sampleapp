(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("actions/base", function(exports, require, module) {
module.exports = function(constants) {
	this.all = function(content) {
		return {
			type: constants.ALL,
			content: content
		};
	};
	
	this.create = function(content) {
		return {
			type: constants.CREATE,
			content: content
		};
	};
	
	this.update = function(content) {
		return {
			type: constants.UPDATE,
			content: content
		};
	};
	
	this.remove = function(content) {
		return {
			type: constants.REMOVE,
			content: content
		};
	};

	this.read = function(content) {
		return {
			type: constants.READ,
			content: content
		};
	};
	

};
});

require.register("actions/notes/all", function(exports, require, module) {
"use strict";

var constants = require("constants");

module.exports = {
      
};
});

require.register("components/notes/ErrorNotice", function(exports, require, module) {
var React = require('react');

var ErrorNotice = React.createClass({displayName: 'ErrorNotice',
  render: function() {
    return (
      React.createElement("div", {className: "error-notice"}, 
        "Error processing request."
      )
      );
  }
});

module.exports = ErrorNotice;
});

require.register("components/notes/list/index", function(exports, require, module) {
/* jshint node: true */
"use strict";

var _ = require("underscore"),
    Item = require("./item");


module.exports = React.createClass({displayName: 'exports',
   
    renderItems: function() {
        return this.props.notes.map(function(note) {
           return React.createElement(Item, {key: note.id, note: note});
        });
        
    },

    render: function() {
        return React.createElement("ul", {className: "list-group"}, 
            this.renderItems()
        );
    } 
});
});

require.register("components/notes/list/item", function(exports, require, module) {
/* jshint node: true */
"use strict";

var constants = require("constants").notes,
    dispatcher = require("dispatcher");



module.exports = React.createClass({displayName: 'exports',
	
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

        return React.createElement("li", {className: "list-group-item pointer"}, 
        React.createElement("span", {onClick: this.editContent, className: this.state.shouldHide ? 'hidden' : ''}, this.props.note.name), 
        React.createElement("input", {type: "text", className: this.state.shouldHide ? '' : 'hidden', ref: "inputText", onKeyDown: this.handleInput}), 
        React.createElement("span", {className: "pd10"}, React.createElement("a", {href: hash, className: this.state.shouldHide ? 'hidden' : ''}, "View")), 
        React.createElement("span", null, React.createElement("a", {href: "#", className: this.state.shouldHide ? 'hidden' : '', onClick: this.toggle}, "Delete"))
        ); 
    } 
});
});

require.register("components/notes/modal", function(exports, require, module) {
"use strict";

var React = require("react"),
    
    dispatcher = require("dispatcher"),
    emitter = require("emitter"),
    constants = require("constants").notes;

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
            visible: false,
            value: ""
        };
    },
    
    componentDidMount: function () {
        this.$el = $(this.getDOMNode());
        this.$el.on("hidden.bs.modal", this.reset);
        
        emitter.on(constants.changed, function() {
            this.$el.modal("hide");
        }.bind(this));       

    },
    
    componentWillUnmount: function() {
        emitter.off(constants.changed);
    },

    show: function () {
        this.$el.modal("show");
    },

    reset: function() {
        this.setState({ value: "" });
    },
    
    save: function() {
        dispatcher.dispatch({ type: constants.create, content: { name: this.state.value, isComplete: false }});
    },
    
    onChange: function(e) {
        this.setState({ value: e.target.value });
    },
    
    render: function() {
		return React.createElement("div", {className: "modal fade", tabIndex: "-1", role: "dialog", 'aria-hidden': "true"}, 
    
            React.createElement("div", {className: "modal-dialog modal-sm"}, 
                React.createElement("div", {className: "modal-content"}, 
                    React.createElement("div", {className: "modal-header"}, 
                        React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal"}, 
                            React.createElement("span", {'aria-hidden': "true"}, "×"), 
                            React.createElement("span", {className: "sr-only"}, "Close")
                        ), 
                        React.createElement("h3", {className: "modal-title"}, "New Note")
                    ), 
                    React.createElement("div", {className: "modal-body"}, 
                        React.createElement("input", {placeholder: "Note name...", type: "text", value: this.state.value, onChange: this.onChange})
                    ), 
                    React.createElement("div", {className: "modal-footer"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col col-md-12"}, 
								React.createElement("button", {type: "button", className: "btn btn-primary pull-right", onClick: this.save}, "Save"), 
                                React.createElement("button", {type: "button", className: "btn btn-default pull-right spacing-right", onClick: this.reset, 'data-dismiss': "modal"}, "Close")
							)
						)
                    )
                )
            )
        );
    }
});
});

require.register("config", function(exports, require, module) {
module.exports = {
	fixtures: true
};
});

require.register("constants/components", function(exports, require, module) {
"use strict";

module.exports = {
    notes: "notes-component"
};
});

require.register("constants/index", function(exports, require, module) {
"use strict";

module.exports = {
    components: require("./components"),
    notes: require("./notes")
};
});

require.register("constants/notes", function(exports, require, module) {
module.exports = {
    changed: "notes-changed",
    error: "error",
    
    all: "all-notes",
    create: "create-notes",
    update: "update-notes",
    remove: "remove-notes",
    read: "read-notes",

    api: "/api/notes/"
};
});

require.register("dispatcher", function(exports, require, module) {
/* jshint node: true */
"use strict";

var Dispatcher = require("flux").Dispatcher;

module.exports = new Dispatcher();
});

require.register("emitter", function(exports, require, module) {
var EventEmitter = require("eventEmitter");

module.exports = new EventEmitter();
});

require.register("initialize", function(exports, require, module) {
/* jshint node: true */
"use strict";

require("stores");

var React = require("react");
var ReactRouter = require("react-router");

var $__0=      ReactRouter,Route=$__0.Route,RouteHandler=$__0.RouteHandler,Link=$__0.Link;
var DefaultRoute = ReactRouter.DefaultRoute;

var App = React.createClass({displayName: 'App',
	render: function () {
		return (
     		 React.createElement(RouteHandler, null)
   		 );
	}
});

var Notes = require("pages/notes/index");


var Note = require("pages/notes/singleNote");

var routes = (	
  React.createElement(Route, {handler: App, path: "/"}, 
      React.createElement(DefaultRoute, {handler: Notes}), 
    React.createElement(Route, {name: "note", path: "/notes/:noteID", handler: Note})
  )
);

ReactRouter.run(routes,function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('app'));
});
});

require.register("pages/notes/index", function(exports, require, module) {
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
   
module.exports = React.createClass({displayName: 'exports',
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
        return React.createElement(List, {notes: _.filter(this.state.notes, function(x) { return x.isComplete === complete; })});
    },
    
    render: function() {
        var errors = (this.state.isError) ? React.createElement(ErrorNotice, null) : React.createElement("div", null);
        return React.createElement("div", {className: "container"}, 
            errors, 
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-8"}, 
                    React.createElement("h2", null, "Note List")
                ), 
                React.createElement("div", {className: "col-md-4"}, 
                    React.createElement("button", {type: "button", className: "btn btn-primary pull-right spacing-top", onClick: this.create}, "New Note")
                )
            ), 
                    
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-8"}, 
                    React.createElement("h4", {className: "spacing-bottom"}, "Below is the list of incomplete notes."), 
                    this.renderList(false)
                )
            ), 
            
            React.createElement(Modal, {ref: "create"})
            
        );
    }
});
});

require.register("pages/notes/singleNote", function(exports, require, module) {
/* jshint node: true */
"use strict";

var React = require("react"),
    _ = require("underscore"),
    
    dispatcher = require("dispatcher"),
    emitter = require("emitter"),
    constants = require("constants").notes;
  
   
module.exports = React.createClass({displayName: 'exports',

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
         return  ( React.createElement("div", null, React.createElement("h1", null, "Note id: ", this.state.note.id), 
          React.createElement("div", null, "Note:- ", this.state.note.name)) );
    },

  updateNote: function(note){
        if(!this.isMounted()){
           return; 
        }
       this.setState({ note: note });
    },

  render: function () {
    var $__0=    this.context,router=$__0.router;
    var errors = (this.state.isError) ? React.createElement(ErrorNotice, null) : React.createElement("div", null);
	  
    return (
      React.createElement("div", {className: "Notes"}, 
       errors, 
       React.createElement("div", null, this.renderContent())
      )
    );
  }
});
});

require.register("stores/base", function(exports, require, module) {
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
});

require.register("stores/index", function(exports, require, module) {
module.exports = {
    notes: require("stores/notes")
};
});

require.register("stores/notes", function(exports, require, module) {
var Base = require("./base"),
    constants = require("constants").notes;

module.exports = new Base(constants.api, constants);
});


//# sourceMappingURL=app.js.map