var React = require('react');

var ErrorNotice = React.createClass({
  render: function() {
    return (
      <div className="error-notice">
        Error processing request.
      </div>
      );
  }
});

module.exports = ErrorNotice;