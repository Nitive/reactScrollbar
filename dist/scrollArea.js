(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', 'react', './scrollBar', 'object-assign'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('react'), require('./scrollBar'), require('object-assign'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.React, global.Scrollbar, global.objectAssign);
        global.scrollArea = mod.exports;
    }
})(this, function (exports, module, _react, _scrollBar, _objectAssign) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var _React = _interopRequireDefault(_react);

    var _Scrollbar = _interopRequireDefault(_scrollBar);

    var _objectAssign2 = _interopRequireDefault(_objectAssign);

    var ScrollArea = (function (_React$Component) {
        _inherits(ScrollArea, _React$Component);

        function ScrollArea(props) {
            _classCallCheck(this, ScrollArea);

            _get(Object.getPrototypeOf(ScrollArea.prototype), 'constructor', this).call(this, props);
            this.state = {
                topPosition: 0,
                leftPosition: 0,
                realHeight: 0,
                containerHeight: 0,
                realWidth: 0,
                containerWidth: 0,
                scrollableX: false,
                scrollableY: false
            };

            this.bindedHandleWindowResize = this.handleWindowResize.bind(this);
        }

        _createClass(ScrollArea, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                window.addEventListener("resize", this.bindedHandleWindowResize);
                this.setSizesToState();
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                window.removeEventListener("resize", this.bindedHandleWindowResize);
            }
        }, {
            key: 'componentDidUpdate',
            value: function componentDidUpdate() {
                this.setSizesToState();
            }
        }, {
            key: 'render',
            value: function render() {
                var style = (0, _objectAssign2['default'])(this.props.contentStyle || {}, {
                    marginTop: this.state.topPosition,
                    marginLeft: this.state.leftPosition
                });

                var scrollbarY = this.canScrollY() ? _React['default'].createElement(_Scrollbar['default'], {
                    realSize: this.state.realHeight,
                    containerSize: this.state.containerHeight,
                    position: -this.state.topPosition,
                    onMove: this.handleMove.bind(this),
                    type: 'vertical' }) : null;

                var scrollbarX = this.canScrollX() ? _React['default'].createElement(_Scrollbar['default'], {
                    realSize: this.state.realWidth,
                    containerSize: this.state.containerWidth,
                    position: -this.state.leftPosition,
                    onMove: this.handleMove.bind(this),
                    type: 'horizontal' }) : null;

                var classes = 'scrollarea ' + this.props.className;
                var contentClasses = 'scrollarea-content ' + this.props.contentClassName;
                return _React['default'].createElement(
                    'div',
                    { className: classes, onWheel: this.handleWheel.bind(this) },
                    _React['default'].createElement(
                        'div',
                        { ref: 'content', style: style, className: contentClasses },
                        this.props.children
                    ),
                    scrollbarY,
                    scrollbarX
                );
            }
        }, {
            key: 'handleMove',
            value: function handleMove(deltaY, deltaX) {
                var newState = this.computeSizes();
                if (this.canScrollY(newState)) {
                    newState.topPosition = this.computeTopPosition(deltaY, newState);
                }
                if (this.canScrollX(newState)) {
                    newState.leftPosition = this.computeLeftPosition(deltaX, newState);
                }
                this.setState(newState);
            }
        }, {
            key: 'handleWheel',
            value: function handleWheel(e) {
                var newState = this.computeSizes();
                var deltaY = e.deltaY * this.props.speed;
                var deltaX = e.deltaX * this.props.speed;

                if (this.canScrollY(newState)) {
                    newState.topPosition = this.computeTopPosition(-deltaY, newState);
                }

                if (this.canScrollX(newState)) {
                    newState.leftPosition = this.computeLeftPosition(-deltaX, newState);
                }

                if (this.state.topPosition !== newState.topPosition || this.state.leftPosition !== newState.leftPosition) {
                    e.preventDefault();
                }

                this.setState(newState);
            }
        }, {
            key: 'computeTopPosition',
            value: function computeTopPosition(deltaY, sizes) {
                var newTopPosition = this.state.topPosition + deltaY;

                if (-newTopPosition > sizes.realHeight - sizes.containerHeight) {
                    newTopPosition = -(sizes.realHeight - sizes.containerHeight);
                }
                if (newTopPosition > 0) {
                    newTopPosition = 0;
                }
                return newTopPosition;
            }
        }, {
            key: 'computeLeftPosition',
            value: function computeLeftPosition(deltaX, sizes) {
                var newLeftPosition = this.state.leftPosition + deltaX;
                if (-newLeftPosition > sizes.realWidth - sizes.containerWidth) {
                    newLeftPosition = -(sizes.realWidth - sizes.containerWidth);
                } else if (newLeftPosition > 0) {
                    newLeftPosition = 0;
                }

                return newLeftPosition;
            }
        }, {
            key: 'handleWindowResize',
            value: function handleWindowResize() {
                var newState = this.computeSizes();
                var bottomPosition = newState.realHeight - newState.containerHeight;
                if (-this.state.topPosition >= bottomPosition) {
                    newState.topPosition = this.canScrollY(newState) ? -bottomPosition : 0;
                }

                var rightPosition = newState.realWidth - newState.containerWidth;
                if (-this.state.leftPosition >= rightPosition) {
                    newState.leftPosition = this.canScrollX(newState) ? -rightPosition : 0;
                }

                this.setState(newState);
            }
        }, {
            key: 'computeSizes',
            value: function computeSizes() {
                var realHeight = _React['default'].findDOMNode(this.refs.content).offsetHeight;
                var containerHeight = _React['default'].findDOMNode(this).offsetHeight;
                var realWidth = _React['default'].findDOMNode(this.refs.content).offsetWidth;
                var containerWidth = _React['default'].findDOMNode(this).offsetWidth;
                var scrollableY = realHeight > containerHeight || this.state.topPosition != 0;
                var scrollableX = realWidth > containerWidth || this.state.leftPosition != 0;

                return {
                    realHeight: realHeight,
                    containerHeight: containerHeight,
                    realWidth: realWidth,
                    containerWidth: containerWidth,
                    scrollableX: scrollableX,
                    scrollableY: scrollableY
                };
            }
        }, {
            key: 'setSizesToState',
            value: function setSizesToState() {
                var sizes = this.computeSizes();
                if (sizes.realHeight !== this.state.realHeight || sizes.realWidth !== this.state.realWidth) {
                    this.setState(sizes);
                }
            }
        }, {
            key: 'scrollTop',
            value: function scrollTop() {
                this.setState({ topPosition: 0 });
            }
        }, {
            key: 'scrollBottom',
            value: function scrollBottom() {
                this.setState({ topPosition: -(this.state.realHeight - this.state.containerHeight) });
            }
        }, {
            key: 'canScrollY',
            value: function canScrollY() {
                var state = arguments.length <= 0 || arguments[0] === undefined ? this.state : arguments[0];

                return state.scrollableY && this.props.vertical;
            }
        }, {
            key: 'canScrollX',
            value: function canScrollX() {
                var state = arguments.length <= 0 || arguments[0] === undefined ? this.state : arguments[0];

                return state.scrollableX && this.props.horizontal;
            }
        }]);

        return ScrollArea;
    })(_React['default'].Component);

    ScrollArea.propTypes = {
        className: _React['default'].PropTypes.string,
        speed: _React['default'].PropTypes.number,
        contentClassName: _React['default'].PropTypes.string,
        contentStyle: _React['default'].PropTypes.object,
        vertical: _React['default'].PropTypes.bool,
        horizontal: _React['default'].PropTypes.bool
    };

    ScrollArea.defaultProps = {
        speed: 1,
        vertical: true,
        horizontal: true
    };

    module.exports = ScrollArea;
});