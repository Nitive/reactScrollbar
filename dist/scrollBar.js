(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', 'react', 'classnames'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('react'), require('classnames'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.React, global.classNames);
        global.scrollBar = mod.exports;
    }
})(this, function (exports, module, _react, _classnames) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var _React = _interopRequireDefault(_react);

    var _classNames = _interopRequireDefault(_classnames);

    var ScrollBar = (function (_React$Component) {
        _inherits(ScrollBar, _React$Component);

        function ScrollBar(props) {
            _classCallCheck(this, ScrollBar);

            _get(Object.getPrototypeOf(ScrollBar.prototype), 'constructor', this).call(this, props);
            var newState = this.calculateState(props);
            this.state = {
                position: newState.position,
                scrollSize: newState.scrollSize,
                isDragging: false,
                lastClientPosition: 0
            };

            if (props.type === 'vertical') {
                this.bindedHandleMouseMove = this.handleMouseMoveForVertical.bind(this);
            } else {
                this.bindedHandleMouseMove = this.handleMouseMoveForHorizontal.bind(this);
            }

            this.bindedHandleMouseUp = this.handleMouseUp.bind(this);
        }

        _createClass(ScrollBar, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                document.addEventListener("mousemove", this.bindedHandleMouseMove);
                document.addEventListener("mouseup", this.bindedHandleMouseUp);
            }
        }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                this.setState(this.calculateState(nextProps));
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                document.removeEventListener("mousemove", this.bindedHandleMouseMove);
                document.removeEventListener("mouseup", this.bindedHandleMouseUp);
            }
        }, {
            key: 'calculateState',
            value: function calculateState(props) {
                var scrollSize = props.containerSize * props.containerSize / props.realSize;
                var multiplier = props.containerSize / props.realSize;
                var position = props.position * multiplier;

                return {
                    scrollSize: scrollSize,
                    position: position
                };
            }
        }, {
            key: 'render',
            value: function render() {
                var scrollStyle = this.createScrollStyles();

                var scrollbarClasses = (0, _classNames['default'])(['scrollbar-container', {
                    'active': this.state.isDragging,
                    'horizontal': this.props.type === 'horizontal',
                    'vertical': this.props.type === 'vertical'
                }]);

                return _React['default'].createElement(
                    'div',
                    { className: scrollbarClasses },
                    _React['default'].createElement('div', { className: 'scrollbar',
                        style: scrollStyle,
                        onMouseDown: this.handleMouseDown.bind(this)
                    })
                );
            }
        }, {
            key: 'handleMouseMoveForHorizontal',
            value: function handleMouseMoveForHorizontal(e) {
                var multiplier = this.props.containerSize / this.props.realSize;
                if (this.state.isDragging) {
                    e.preventDefault();
                    var deltaX = this.state.lastClientPosition - e.clientX;
                    this.setState({ lastClientPosition: e.clientX });
                    this.props.onMove(0, deltaX / multiplier);
                }
            }
        }, {
            key: 'handleMouseMoveForVertical',
            value: function handleMouseMoveForVertical(e) {
                var multiplier = this.props.containerSize / this.props.realSize;
                if (this.state.isDragging) {
                    e.preventDefault();
                    var deltaY = this.state.lastClientPosition - e.clientY;
                    this.setState({ lastClientPosition: e.clientY });
                    this.props.onMove(deltaY / multiplier, 0);
                }
            }
        }, {
            key: 'handleMouseDown',
            value: function handleMouseDown(e) {
                var lastClientPosition = this.props.type === 'vertical' ? e.clientY : e.clientX;
                this.setState({ isDragging: true, lastClientPosition: lastClientPosition });
            }
        }, {
            key: 'handleMouseUp',
            value: function handleMouseUp(e) {
                this.setState({ isDragging: false });
            }
        }, {
            key: 'createScrollStyles',
            value: function createScrollStyles() {
                if (this.props.type === 'vertical') {
                    return {
                        height: this.state.scrollSize,
                        marginTop: this.state.position
                    };
                } else {
                    return {
                        width: this.state.scrollSize,
                        marginLeft: this.state.position
                    };
                }
            }
        }]);

        return ScrollBar;
    })(_React['default'].Component);

    ScrollBar.propTypes = {
        onMove: _React['default'].PropTypes.func,
        realSize: _React['default'].PropTypes.number,
        containerSize: _React['default'].PropTypes.number,
        position: _React['default'].PropTypes.number,
        type: _React['default'].PropTypes.oneOf(['vertical', 'horizontal'])
    };

    ScrollBar.defaultProps = {
        type: 'vertical'
    };
    module.exports = ScrollBar;
});