'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ScrollClassName = function (_Component) {
  (0, _inherits3.default)(ScrollClassName, _Component);

  function ScrollClassName(props) {
    (0, _classCallCheck3.default)(this, ScrollClassName);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ScrollClassName.__proto__ || (0, _getPrototypeOf2.default)(ScrollClassName)).call(this, props));

    var _props$sections = props.sections,
        sections = _props$sections === undefined ? [] : _props$sections,
        _props$curSection = props.curSection,
        curSection = _props$curSection === undefined ? 0 : _props$curSection,
        _props$curPhrase = props.curPhrase,
        curPhrase = _props$curPhrase === undefined ? 0 : _props$curPhrase;

    _this.state = {
      sections: sections,
      curSection: 0,
      curPhrase: 0,
      locked: false
    };

    _this._timers = [];
    return _this;
  }

  (0, _createClass3.default)(ScrollClassName, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (typeof window == 'undefined') {
        return;
      }

      //绑定滚轮、滑动事件
      var startY;
      this._toClean = {
        mousewheel: function mousewheel(e) {
          if (event.wheelDelta >= 0) {
            _this2.scrollUp();
          } else {
            _this2.scrollDown();
          }
        },
        touchstart: function touchstart(e) {
          startY = e.originalEvent.touches[0].clientY;
        },
        touchmove: function touchmove(e) {
          if (e.originalEvent.touches[0].clientY < startY) {
            _this2.scrollUp();
          } else if (e.originalEvent.touches[0].clientY > startY) {
            _this2.scrollDown();
          }
        }
      };
      (0, _keys2.default)(this._toClean).map(function (k) {
        (0, _jquery2.default)(window).bind(k, _this2._toClean[k]);
      });
    }
  }, {
    key: 'scrollUp',
    value: function scrollUp() {
      var auto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _state = this.state,
          locked = _state.locked,
          sections = _state.sections,
          curSection = _state.curSection,
          curPhrase = _state.curPhrase;

      if (locked) return;

      var nextSection = curSection,
          nextPhrase = curPhrase;
      if (curPhrase > 0) {
        nextPhrase = curPhrase - 1;
      } else if (curSection > 0) {
        nextSection = curSection - 1;
        nextPhrase = sections[nextSection].length - 1;
      } else {
        return;
      }
      this.doScroll('up', curSection, curPhrase, nextSection, nextPhrase, auto);
    }
  }, {
    key: 'scrollDown',
    value: function scrollDown() {
      var auto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _state2 = this.state,
          locked = _state2.locked,
          sections = _state2.sections,
          curSection = _state2.curSection,
          curPhrase = _state2.curPhrase;

      if (locked) return;

      var nextSection = curSection,
          nextPhrase = curPhrase;
      if (curPhrase < sections[curSection].length - 1) {
        nextPhrase = curPhrase + 1;
      } else if (curSection < sections.length - 1) {
        nextSection = curSection + 1;
        nextPhrase = 0;
      } else {
        return;
      }
      this.doScroll('down', curSection, curPhrase, nextSection, nextPhrase, auto);
    }
  }, {
    key: 'doScroll',
    value: function doScroll(direction, fromSection, fromPhrase, nextSection, nextPhrase, auto) {
      var _this3 = this;

      var _props = this.props,
          onScroll = _props.onScroll,
          sections = _props.sections;

      this.setState({
        curPhrase: nextPhrase,
        curSection: nextSection,
        locked: true
      });

      var _ref = direction == 'up' ? sections[nextSection][nextPhrase] : sections[fromSection][fromPhrase],
          duration = _ref.duration;

      var _sections$nextSection = sections[nextSection][nextPhrase],
          autoPrev = _sections$nextSection.autoPrev,
          autoNext = _sections$nextSection.autoNext;

      this._timers.push(setTimeout(function () {
        _this3.setState({
          locked: false
        });
        if (autoPrev && direction == 'up') {
          setTimeout(function () {
            return _this3.scrollUp(true);
          });
        }
        if (autoNext && direction == 'down') {
          setTimeout(function () {
            return _this3.scrollDown(true);
          });
        }
      }, duration));

      //trigger out
      if (onScroll) {
        onScroll({
          direction: direction,
          fromSection: fromSection,
          fromPhrase: fromPhrase,
          toSection: toSection,
          toPhrase: toPhrase
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          _props2$sectionPrifix = _props2.sectionPrifix,
          sectionPrifix = _props2$sectionPrifix === undefined ? 'section-' : _props2$sectionPrifix,
          _props2$phrasePrifix = _props2.phrasePrifix,
          phrasePrifix = _props2$phrasePrifix === undefined ? 'phrase-' : _props2$phrasePrifix,
          _props2$spPrifix = _props2.spPrifix,
          spPrifix = _props2$spPrifix === undefined ? 'sp-' : _props2$spPrifix,
          children = _props2.children,
          style = _props2.style;
      var _state3 = this.state,
          curSection = _state3.curSection,
          curPhrase = _state3.curPhrase;

      return _react2.default.createElement(
        'div',
        { style: style, className: '' + sectionPrifix + curSection + ' ' + phrasePrifix + curPhrase + ' ' + spPrifix + curSection + '-' + curPhrase },
        children
      );
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this4 = this;

      if (typeof window == 'undefined') {
        return;
      }

      //清理绑定事件
      (0, _keys2.default)(this._toClean).map(function (k) {
        (0, _jquery2.default)(window).unbind(k, _this4._toClean[k]);
      });
      this._timers.forEach(clearTimeout);
    }
  }]);
  return ScrollClassName;
}(_react.Component);

exports.default = ScrollClassName;