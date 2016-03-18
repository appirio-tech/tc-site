/** @jsx React.DOM */
/*
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 * React component for Design Challenge Oportunities Listing Page
 */

window.Qtip = React.createClass({
  displayName: 'QtipTooltip',

  createQtip: function (elt, props) {
    elt.qtip({
      overwrite: true,
      prerender: false,
      content: {
        text: props.text,
        title: props.title
      },
      style: {
        classes: 'qtip-' + props.community + ' qtip-rounded qtip-shadow'
      },
      position: {
        my: props.my || 'bottom center',
        at: props.at || 'top center ',
        adjust: {
          y: -12
        }
      }
    });
  },

  componentDidMount: function () {
    var elt = $(ReactDOM.findDOMNode(this));
    var props = this.props;
    this.createQtip(elt, props);
  },

  componentDidUpdate: function () {
    var elt = $(ReactDOM.findDOMNode(this));
    var props = this.props;
    this.createQtip(elt, props);
  },

  componentWillUnmount: function () {
    $(ReactDOM.findDOMNode(this)).qtip('destroy', true);
  },

  render: function () {
    return this.props.children;
  }
});