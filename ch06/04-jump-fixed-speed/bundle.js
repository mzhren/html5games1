(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Anim = function () {
  function Anim(frames, rate) {
    _classCallCheck(this, Anim);

    this.frames = frames;
    this.rate = rate;
    this.reset();
  }

  _createClass(Anim, [{
    key: "reset",
    value: function reset() {
      this.frame = this.frames[0];
      this.curFrame = 0;
      this.curTime = 0;
    }
  }, {
    key: "update",
    value: function update(dt) {
      var rate = this.rate,
          frames = this.frames;

      if ((this.curTime += dt) > rate) {
        this.curFrame++;
        this.frame = frames[this.curFrame % frames.length];
        this.curTime -= rate;
      }
    }
  }]);

  return Anim;
}();

var AnimManager = function () {
  function AnimManager() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { x: 0, y: 0 };

    _classCallCheck(this, AnimManager);

    this.anims = {};
    this.running = false;
    this.frameSource = e.frame || e;
    this.current = null;
  }

  _createClass(AnimManager, [{
    key: "add",
    value: function add(name, frames, speed) {
      this.anims[name] = new Anim(frames, speed);
      return this.anims[name];
    }
  }, {
    key: "update",
    value: function update(dt) {
      var current = this.current,
          anims = this.anims,
          frameSource = this.frameSource;

      if (!current) {
        return;
      }
      var anim = anims[current];
      anim.update(dt);

      // Sync the tileSprite frame
      frameSource.x = anim.frame.x;
      frameSource.y = anim.frame.y;
    }
  }, {
    key: "play",
    value: function play(anim) {
      var current = this.current,
          anims = this.anims;

      if (anim === current) {
        return;
      }
      this.current = anim;
      anims[anim].reset();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.current = null;
    }
  }]);

  return AnimManager;
}();

exports.default = AnimManager;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Container2 = require("./Container.js");

var _Container3 = _interopRequireDefault(_Container2);

var _math = require("./utils/math.js");

var _math2 = _interopRequireDefault(_math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Camera = function (_Container) {
  _inherits(Camera, _Container);

  function Camera(subject, viewport) {
    var worldSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : viewport;

    _classCallCheck(this, Camera);

    var _this = _possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this));

    _this.w = viewport.w;
    _this.h = viewport.h;
    _this.worldSize = worldSize;
    _this.setSubject(subject);
    return _this;
  }

  _createClass(Camera, [{
    key: "setSubject",
    value: function setSubject(e) {
      this.subject = e ? e.pos || e : this.pos;
      this.offset = { x: 0, y: 0 };

      // Center on the entity
      if (e && e.w) {
        this.offset.x += e.w / 2;
        this.offset.y += e.h / 2;
      }
      if (e && e.anchor) {
        this.offset.x -= e.anchor.x;
        this.offset.y -= e.anchor.y;
      }
      this.focus();
    }
  }, {
    key: "focus",
    value: function focus() {
      var pos = this.pos,
          w = this.w,
          h = this.h,
          worldSize = this.worldSize,
          subject = this.subject,
          offset = this.offset;


      var centeredX = subject.x + offset.x - w / 2;
      var maxX = worldSize.w - w;
      var x = -_math2.default.clamp(centeredX, 0, maxX);

      var centeredY = subject.y + offset.y - h / 2;
      var maxY = worldSize.h - h;
      var y = -_math2.default.clamp(centeredY, 0, maxY);

      pos.x = x;
      pos.y = y;
    }
  }, {
    key: "update",
    value: function update(dt, t) {
      _get(Camera.prototype.__proto__ || Object.getPrototypeOf(Camera.prototype), "update", this).call(this, dt, t);

      if (this.subject) {
        this.focus();
      }
    }
  }]);

  return Camera;
}(_Container3.default);

exports.default = Camera;

},{"./Container.js":3,"./utils/math.js":18}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = function () {
  function Container() {
    _classCallCheck(this, Container);

    this.pos = { x: 0, y: 0 };
    this.children = [];
  }

  _createClass(Container, [{
    key: "add",
    value: function add(child) {
      this.children.push(child);
      return child;
    }
  }, {
    key: "remove",
    value: function remove(child) {
      this.children = this.children.filter(function (c) {
        return c !== child;
      });
      return child;
    }
  }, {
    key: "map",
    value: function map(f) {
      return this.children.map(f);
    }
  }, {
    key: "update",
    value: function update(dt, t) {
      var _this = this;

      this.children = this.children.filter(function (child) {
        if (child.update) {
          child.update(dt, t, _this);
        }
        return child.dead ? false : true;
      });
    }
  }]);

  return Container;
}();

exports.default = Container;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Container = require("./Container.js");

var _Container2 = _interopRequireDefault(_Container);

var _CanvasRenderer = require("./renderer/CanvasRenderer.js");

var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

var _screenCapture = require("./utils/screenCapture.js");

var _screenCapture2 = _interopRequireDefault(_screenCapture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STEP = 1 / 60;
var MULTIPLIER = 2; // Change this value!
var SPEED = STEP * MULTIPLIER;
var MAX_FRAME = SPEED * 5;

var Game = function () {
  function Game(w, h) {
    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#board";

    _classCallCheck(this, Game);

    this.w = w;
    this.h = h;
    this.renderer = new _CanvasRenderer2.default(w, h);
    document.querySelector(parent).appendChild(this.renderer.view);
    (0, _screenCapture2.default)(this.renderer.view);

    this.scene = new _Container2.default();
  }

  _createClass(Game, [{
    key: "run",
    value: function run() {
      var _this = this;

      var gameUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      var dt = 0;
      var last = 0;
      var loopy = function loopy(ms) {
        requestAnimationFrame(loopy);

        var t = ms / 1000; // Let's work in seconds
        dt += Math.min(t - last, MAX_FRAME);
        last = t;

        while (dt >= SPEED) {
          _this.scene.update(STEP, t / MULTIPLIER);
          gameUpdate(STEP, t / MULTIPLIER);
          dt -= SPEED;
        }
        _this.renderer.render(_this.scene);
      };
      requestAnimationFrame(loopy);
    }
  }]);

  return Game;
}();

exports.default = Game;

},{"./Container.js":3,"./renderer/CanvasRenderer.js":16,"./utils/screenCapture.js":19}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rect = function Rect(w, h) {
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { fill: "#333" };

  _classCallCheck(this, Rect);

  this.pos = { x: 0, y: 0 };
  this.w = w;
  this.h = h;
  this.style = style;
};

exports.default = Rect;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = function Sprite(texture) {
  _classCallCheck(this, Sprite);

  this.texture = texture;
  this.pos = { x: 0, y: 0 };
  this.anchor = { x: 0, y: 0 };
  this.scale = { x: 1, y: 1 };
  this.pivot = { x: 0, y: 0 };
  this.rotation = 0;
};

exports.default = Sprite;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = function () {
  function State(state) {
    _classCallCheck(this, State);

    this.set(state);
  }

  _createClass(State, [{
    key: "set",
    value: function set(state) {
      this.last = this.state;
      this.state = state;
      this.time = 0;
      this.justSetState = true;
    }
  }, {
    key: "get",
    value: function get() {
      return this.state;
    }
  }, {
    key: "update",
    value: function update(dt) {
      this.first = this.justSetState;
      this.time += this.first ? 0 : dt;
      this.justSetState = false;
    }
  }, {
    key: "is",
    value: function is(state) {
      return this.state === state;
    }
  }, {
    key: "isIn",
    value: function isIn() {
      var _this = this;

      for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
        states[_key] = arguments[_key];
      }

      return states.some(function (s) {
        return _this.is(s);
      });
    }
  }]);

  return State;
}();

exports.default = State;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Text = function Text() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _classCallCheck(this, Text);

  this.pos = { x: 0, y: 0 };
  this.text = text;
  this.style = style;
};

exports.default = Text;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Texture = function Texture(url) {
  _classCallCheck(this, Texture);

  this.img = new Image();
  this.img.src = url;
};

exports.default = Texture;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Container2 = require("./Container.js");

var _Container3 = _interopRequireDefault(_Container2);

var _TileSprite = require("./TileSprite.js");

var _TileSprite2 = _interopRequireDefault(_TileSprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileMap = function (_Container) {
  _inherits(TileMap, _Container);

  function TileMap(tiles, mapW, mapH, tileW, tileH, texture) {
    _classCallCheck(this, TileMap);

    var _this = _possibleConstructorReturn(this, (TileMap.__proto__ || Object.getPrototypeOf(TileMap)).call(this));

    _this.mapW = mapW;
    _this.mapH = mapH;
    _this.tileW = tileW;
    _this.tileH = tileH;
    _this.w = mapW * tileW;
    _this.h = mapH * tileH;

    // Add all tile sprites
    _this.children = tiles.map(function (frame, i) {
      var s = new _TileSprite2.default(texture, tileW, tileH);
      s.frame = frame;
      s.pos.x = i % mapW * tileW;
      s.pos.y = Math.floor(i / mapW) * tileH;
      return s;
    });
    return _this;
  }

  _createClass(TileMap, [{
    key: "pixelToMapPos",
    value: function pixelToMapPos(pos) {
      var tileW = this.tileW,
          tileH = this.tileH;

      return {
        x: Math.floor(pos.x / tileW),
        y: Math.floor(pos.y / tileH)
      };
    }
  }, {
    key: "mapToPixelPos",
    value: function mapToPixelPos(mapPos) {
      var tileW = this.tileW,
          tileH = this.tileH;

      return {
        x: mapPos.x * tileW,
        y: mapPos.y * tileH
      };
    }
  }, {
    key: "tileAtMapPos",
    value: function tileAtMapPos(mapPos) {
      return this.children[mapPos.y * this.mapW + mapPos.x];
    }
  }, {
    key: "tileAtPixelPos",
    value: function tileAtPixelPos(pos) {
      return this.tileAtMapPos(this.pixelToMapPos(pos));
    }
  }, {
    key: "setFrameAtMapPos",
    value: function setFrameAtMapPos(mapPos, frame) {
      var tile = this.tileAtMapPos(mapPos);
      tile.frame = frame;
      return tile;
    }
  }, {
    key: "setFrameAtPixelPos",
    value: function setFrameAtPixelPos(pos, frame) {
      return this.setFrameAtMapPos(this.pixelToMapPos(pos), frame);
    }
  }, {
    key: "tilesAtCorners",
    value: function tilesAtCorners(bounds, xo, yo) {
      var _this2 = this;

      return [[bounds.x, bounds.y], // Top-left
      [bounds.x + bounds.w, bounds.y], // Top-right
      [bounds.x, bounds.y + bounds.h], // Bottom-left
      [bounds.x + bounds.w, bounds.y + bounds.h] // Bottom-right
      ].map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            x = _ref2[0],
            y = _ref2[1];

        return _this2.tileAtPixelPos({
          x: x + xo,
          y: y + yo
        });
      });
    }
  }]);

  return TileMap;
}(_Container3.default);

exports.default = TileMap;

},{"./Container.js":3,"./TileSprite.js":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sprite2 = require("./Sprite.js");

var _Sprite3 = _interopRequireDefault(_Sprite2);

var _AnimManager = require("./AnimManager.js");

var _AnimManager2 = _interopRequireDefault(_AnimManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileSprite = function (_Sprite) {
  _inherits(TileSprite, _Sprite);

  function TileSprite(texture, w, h) {
    _classCallCheck(this, TileSprite);

    var _this = _possibleConstructorReturn(this, (TileSprite.__proto__ || Object.getPrototypeOf(TileSprite)).call(this, texture));

    _this.tileW = w;
    _this.tileH = h;
    _this.frame = { x: 0, y: 0 };
    _this.anims = new _AnimManager2.default(_this);
    return _this;
  }

  _createClass(TileSprite, [{
    key: "update",
    value: function update(dt) {
      this.anims.update(dt);
    }
  }, {
    key: "w",
    get: function get() {
      return this.tileW * Math.abs(this.scale.x);
    }
  }, {
    key: "h",
    get: function get() {
      return this.tileH * Math.abs(this.scale.y);
    }
  }]);

  return TileSprite;
}(_Sprite3.default);

exports.default = TileSprite;

},{"./AnimManager.js":1,"./Sprite.js":6}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeyControls = function () {
  function KeyControls() {
    var _this = this;

    _classCallCheck(this, KeyControls);

    this.keys = {};

    // Bind event handlers
    document.addEventListener("keydown", function (e) {
      if ([37, 38, 39, 40, 32].indexOf(e.which) >= 0) {
        e.preventDefault();
      }
      _this.keys[e.which] = true;
    }, false);

    document.addEventListener("keyup", function (e) {
      _this.keys[e.which] = false;
    }, false);
  }

  _createClass(KeyControls, [{
    key: "key",
    value: function key(_key, value) {
      if (value !== undefined) {
        this.keys[_key] = value;
      }
      return this.keys[_key];
    }
  }, {
    key: "reset",
    value: function reset() {
      for (var key in this.keys) {
        this.keys[key] = false;
      }
    }

    // Handle key actions

  }, {
    key: "action",
    get: function get() {
      return this.keys[32];
    }
  }, {
    key: "x",
    get: function get() {
      if (this.keys[37] || this.keys[65]) {
        return -1;
      }
      if (this.keys[39] || this.keys[68]) {
        return 1;
      }
      return 0;
    }
  }, {
    key: "y",
    get: function get() {
      if (this.keys[38] || this.keys[87]) {
        return -1;
      }
      if (this.keys[40] || this.keys[83]) {
        return 1;
      }
      return 0;
    }
  }]);

  return KeyControls;
}();

exports.default = KeyControls;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MouseControls = function () {
  function MouseControls(container) {
    var _this = this;

    _classCallCheck(this, MouseControls);

    this.el = container || document.body;

    this.pos = { x: 0, y: 0 };
    this.isDown = false;
    this.pressed = false;
    this.released = false;

    // Handlers
    document.addEventListener("mousedown", function (e) {
      return _this.down(e);
    }, false);
    document.addEventListener("mouseup", function (e) {
      return _this.up(e);
    }, false);
    document.addEventListener("mousemove", function (e) {
      return _this.move(e);
    }, false);
  }

  _createClass(MouseControls, [{
    key: "mousePosFromEvent",
    value: function mousePosFromEvent(_ref) {
      var clientX = _ref.clientX,
          clientY = _ref.clientY;
      var el = this.el,
          pos = this.pos;

      var rect = el.getBoundingClientRect();
      var xr = el.width / el.clientWidth;
      var yr = el.height / el.clientHeight;
      pos.x = (clientX - rect.left) * xr;
      pos.y = (clientY - rect.top) * yr;
    }
  }, {
    key: "down",
    value: function down(e) {
      this.isDown = true;
      this.pressed = true;
      this.mousePosFromEvent(e);
    }
  }, {
    key: "up",
    value: function up() {
      this.isDown = false;
      this.released = true;
    }
  }, {
    key: "move",
    value: function move(e) {
      this.mousePosFromEvent(e);
    }
  }, {
    key: "update",
    value: function update() {
      this.released = false;
      this.pressed = false;
    }
  }]);

  return MouseControls;
}();

exports.default = MouseControls;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Camera = require("./Camera.js");

var _Camera2 = _interopRequireDefault(_Camera);

var _CanvasRenderer = require("./renderer/CanvasRenderer.js");

var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

var _Container = require("./Container.js");

var _Container2 = _interopRequireDefault(_Container);

var _entity = require("./utils/entity.js");

var _entity2 = _interopRequireDefault(_entity);

var _Game = require("./Game.js");

var _Game2 = _interopRequireDefault(_Game);

var _KeyControls = require("./controls/KeyControls.js");

var _KeyControls2 = _interopRequireDefault(_KeyControls);

var _math = require("./utils/math.js");

var _math2 = _interopRequireDefault(_math);

var _MouseControls = require("./controls/MouseControls.js");

var _MouseControls2 = _interopRequireDefault(_MouseControls);

var _Rect = require("./Rect.js");

var _Rect2 = _interopRequireDefault(_Rect);

var _Sprite = require("./Sprite.js");

var _Sprite2 = _interopRequireDefault(_Sprite);

var _State = require("./State.js");

var _State2 = _interopRequireDefault(_State);

var _Text = require("./Text.js");

var _Text2 = _interopRequireDefault(_Text);

var _Texture = require("./Texture.js");

var _Texture2 = _interopRequireDefault(_Texture);

var _TileMap = require("./TileMap.js");

var _TileMap2 = _interopRequireDefault(_TileMap);

var _TileSprite = require("./TileSprite.js");

var _TileSprite2 = _interopRequireDefault(_TileSprite);

var _wallslide = require("./movement/wallslide.js");

var _wallslide2 = _interopRequireDefault(_wallslide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Camera: _Camera2.default,
  CanvasRenderer: _CanvasRenderer2.default,
  Container: _Container2.default,
  entity: _entity2.default,
  Game: _Game2.default,
  KeyControls: _KeyControls2.default,
  math: _math2.default,
  MouseControls: _MouseControls2.default,
  Rect: _Rect2.default,
  Sprite: _Sprite2.default,
  State: _State2.default,
  Text: _Text2.default,
  Texture: _Texture2.default,
  TileMap: _TileMap2.default,
  TileSprite: _TileSprite2.default,
  wallslide: _wallslide2.default
};

},{"./Camera.js":2,"./Container.js":3,"./Game.js":4,"./Rect.js":5,"./Sprite.js":6,"./State.js":7,"./Text.js":8,"./Texture.js":9,"./TileMap.js":10,"./TileSprite.js":11,"./controls/KeyControls.js":12,"./controls/MouseControls.js":13,"./movement/wallslide.js":15,"./renderer/CanvasRenderer.js":16,"./utils/entity.js":17,"./utils/math.js":18}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _entity = require("../utils/entity.js");

var _entity2 = _interopRequireDefault(_entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Expects:
  * an entity (with pos vector, w & h)
  * a Pop TileMap
  * The x and y amount *requesting* to move (no checks if 0)
*/

function wallslide(ent, map) {
  var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  var tiles = void 0;
  var tileEdge = void 0;
  var bounds = _entity2.default.bounds(ent);
  var hits = { up: false, down: false, left: false, right: false };

  // Final amounts of movement to allow
  var xo = x;
  var yo = y;

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo);

    var _tiles$map = tiles.map(function (t) {
      return t && t.frame.walkable;
    }),
        _tiles$map2 = _slicedToArray(_tiles$map, 4),
        tl = _tiles$map2[0],
        tr = _tiles$map2[1],
        bl = _tiles$map2[2],
        br = _tiles$map2[3];

    // Hit your head


    if (y < 0 && !(tl && tr)) {
      hits.up = true;
      tileEdge = tiles[0].pos.y + tiles[0].h;
      yo = tileEdge - bounds.y;
    }
    // Hit your feet
    if (y > 0 && !(bl && br)) {
      hits.down = true;
      tileEdge = tiles[2].pos.y - 1;
      yo = tileEdge - (bounds.y + bounds.h);
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo);

    var _tiles$map3 = tiles.map(function (t) {
      return t && t.frame.walkable;
    }),
        _tiles$map4 = _slicedToArray(_tiles$map3, 4),
        _tl = _tiles$map4[0],
        _tr = _tiles$map4[1],
        _bl = _tiles$map4[2],
        _br = _tiles$map4[3];

    // Hit left tile


    if (x < 0 && !(_tl && _bl)) {
      hits.left = true;
      tileEdge = tiles[0].pos.x + tiles[0].w;
      xo = tileEdge - bounds.x;
    }
    // Hit right tile
    if (x > 0 && !(_tr && _br)) {
      hits.right = true;
      tileEdge = tiles[1].pos.x - 1;
      xo = tileEdge - (bounds.x + bounds.w);
    }
  }

  // xo & yo contain the amount we're allowed to move by, and any hit tiles
  return { x: xo, y: yo, hits: hits };
}

exports.default = wallslide;

},{"../utils/entity.js":17}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasRenderer = function () {
  function CanvasRenderer(w, h) {
    _classCallCheck(this, CanvasRenderer);

    var canvas = document.createElement("canvas");
    this.w = canvas.width = w;
    this.h = canvas.height = h;
    this.view = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.textBaseline = "top";
  }

  _createClass(CanvasRenderer, [{
    key: "render",
    value: function render(container) {
      var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (container.visible == false) {
        return;
      }
      var ctx = this.ctx;


      function renderRec(container) {
        // Render the container children
        container.children.forEach(function (child) {
          if (child.visible == false) {
            return;
          }
          ctx.save();

          // Handle transforms
          if (child.pos) {
            ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
          }
          if (child.anchor) ctx.translate(child.anchor.x, child.anchor.y);
          if (child.scale) ctx.scale(child.scale.x, child.scale.y);
          if (child.rotation) {
            var px = child.pivot ? child.pivot.x : 0;
            var py = child.pivot ? child.pivot.y : 0;
            ctx.translate(px, py);
            ctx.rotate(child.rotation);
            ctx.translate(-px, -py);
          }

          // Draw the leaf nodes
          if (child.text) {
            var _child$style = child.style,
                font = _child$style.font,
                fill = _child$style.fill,
                align = _child$style.align;

            if (font) ctx.font = font;
            if (fill) ctx.fillStyle = fill;
            if (align) ctx.textAlign = align;
            ctx.fillText(child.text, 0, 0);
          } else if (child.texture) {
            var img = child.texture.img;
            if (child.tileW) {
              ctx.drawImage(img, child.frame.x * child.tileW, child.frame.y * child.tileH, child.tileW, child.tileH, 0, 0, child.tileW, child.tileH);
            } else {
              ctx.drawImage(img, 0, 0);
            }
          } else if (child.style && child.w && child.h) {
            ctx.fillStyle = child.style.fill;
            ctx.fillRect(0, 0, child.w, child.h);
          }

          // Render any child sub-nodes
          if (child.children) {
            renderRec(child);
          }
          ctx.restore();
        });
      }

      if (clear) {
        ctx.clearRect(0, 0, this.w, this.h);
      }
      renderRec(container);
    }
  }]);

  return CanvasRenderer;
}();

exports.default = CanvasRenderer;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _math = require("./math.js");

var _math2 = _interopRequireDefault(_math);

var _Rect = require("../Rect.js");

var _Rect2 = _interopRequireDefault(_Rect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addDebug(entity) {
  entity.children = entity.children || [];
  entity.children.push(new _Rect2.default(entity.w, entity.h, { fill: "rgba(255, 0, 0, 0.3)" }));
  if (entity.hitBox) {
    var _entity$hitBox = entity.hitBox,
        x = _entity$hitBox.x,
        y = _entity$hitBox.y,
        w = _entity$hitBox.w,
        h = _entity$hitBox.h;

    var hb = new _Rect2.default(w, h, { fill: "rgba(255, 0, 0, 0.5)" });
    hb.pos.x = x;
    hb.pos.y = y;
    entity.children.push(hb);
  }
  return entity;
}

function angle(a, b) {
  return _math2.default.angle(center(a), center(b));
}

function bounds(entity) {
  var w = entity.w,
      h = entity.h,
      pos = entity.pos,
      hitBox = entity.hitBox;

  var hit = hitBox || { x: 0, y: 0, w: w, h: h };
  return {
    x: hit.x + pos.x,
    y: hit.y + pos.y,
    w: hit.w - 1,
    h: hit.h - 1
  };
}

function center(entity) {
  var pos = entity.pos,
      w = entity.w,
      h = entity.h;

  return {
    x: pos.x + w / 2,
    y: pos.y + h / 2
  };
}

function distance(a, b) {
  return _math2.default.distance(center(a), center(b));
}

function hit(e1, e2) {
  var a = bounds(e1);
  var b = bounds(e2);
  return a.x + a.w >= b.x && a.x <= b.x + b.w && a.y + a.h >= b.y && a.y <= b.y + b.h;
}

function hits(entity, container, hitCallback) {
  var a = bounds(entity);
  container.map(function (e2) {
    var b = bounds(e2);
    if (a.x + a.w >= b.x && a.x <= b.x + b.w && a.y + a.h >= b.y && a.y <= b.y + b.h) {
      hitCallback(e2);
    }
  });
}

exports.default = {
  addDebug: addDebug,
  angle: angle,
  bounds: bounds,
  center: center,
  distance: distance,
  hit: hit,
  hits: hits
};

},{"../Rect.js":5,"./math.js":18}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function angle(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var angle = Math.atan2(dy, dx);

  return angle;
}

function clamp(x, min, max) {
  return Math.max(min, Math.min(x, max));
}

function distance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function rand(min, max) {
  return Math.floor(randf(min, max));
}

function randf(min, max) {
  if (max == null) {
    max = min || 1;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

function randOneIn(max) {
  return rand(0, max) === 0;
}

function randOneFrom(items) {
  return items[rand(0, items.length)];
}

exports.default = {
  angle: angle,
  clamp: clamp,
  distance: distance,
  rand: rand,
  randf: randf,
  randOneIn: randOneIn,
  randOneFrom: randOneFrom
};

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var screenCapture = function screenCapture(canvas) {
  document.addEventListener("keydown", function (_ref) {
    var which = _ref.which;

    if (which === 192 /* ~ key */) {
        var img = new Image();
        img.src = canvas.toDataURL("image/png");
        img.style.width = "150px";
        img.style.height = "100px";
        document.body.appendChild(img);
      }
  }, false);
};

exports.default = screenCapture;

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _Level = require("./Level.js");

var _Level2 = _interopRequireDefault(_Level);

var _Player = require("./entities/Player.js");

var _Player2 = _interopRequireDefault(_Player);

var _Pickup = require("./entities/Pickup.js");

var _Pickup2 = _interopRequireDefault(_Pickup);

var _Bat = require("./entities/Bat.js");

var _Bat2 = _interopRequireDefault(_Bat);

var _Totem = require("./entities/Totem.js");

var _Totem2 = _interopRequireDefault(_Totem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Camera = _index2.default.Camera,
    Container = _index2.default.Container,
    entity = _index2.default.entity,
    State = _index2.default.State,
    Text = _index2.default.Text;

var GameScreen = function (_Container) {
  _inherits(GameScreen, _Container);

  function GameScreen(game, controls, onGameOver) {
    _classCallCheck(this, GameScreen);

    var _this = _possibleConstructorReturn(this, (GameScreen.__proto__ || Object.getPrototypeOf(GameScreen)).call(this));

    _this.w = game.w;
    _this.h = game.h;
    _this.controls = controls;
    _this.onGameOver = onGameOver;
    _this.state = new State("READY");

    // Map, player, camera
    var map = new _Level2.default(game.w, game.h);
    var player = new _Player2.default(controls, map);
    player.pos.x = map.spawns.player.x;
    player.pos.y = map.spawns.player.y;

    var camera = new Camera(player, { w: game.w, h: game.h }, { w: map.w, h: map.h });
    _this.camera = _this.add(camera);
    _this.map = camera.add(map);
    _this.pickups = camera.add(new Container());
    _this.player = camera.add(player);

    // Bats
    var bats = new Container();
    map.spawns.bats.forEach(function (_ref) {
      var x = _ref.x,
          y = _ref.y;

      var bat = bats.add(new _Bat2.default(player));
      bat.pos.x = x;
      bat.pos.y = y;
    });
    _this.bats = camera.add(bats);

    // Totems
    map.spawns.totems.forEach(function (_ref2) {
      var x = _ref2.x,
          y = _ref2.y;

      var t = camera.add(new _Totem2.default(player, function (b) {
        return bats.add(b);
      }));
      t.pos.x = x;
      t.pos.y = y;
    });

    // Pickups
    _this.populate();

    // Score
    _this.score = 0;
    _this.scoreText = _this.add(new Text("0", {
      font: "40pt 'Luckiest Guy', san-serif",
      fill: "#fff",
      align: "center"
    }));
    _this.scoreText.pos = { x: game.w / 2, y: game.h / 2 - 40 };
    return _this;
  }

  _createClass(GameScreen, [{
    key: "populate",
    value: function populate() {
      var pickups = this.pickups,
          map = this.map;

      for (var i = 0; i < 5; i++) {
        var p = pickups.add(new _Pickup2.default());
        p.pos = map.findFreeSpot();
      }
    }
  }, {
    key: "update",
    value: function update(dt, t) {
      var controls = this.controls,
          player = this.player,
          state = this.state;


      switch (state.get()) {
        case "READY":
          if (state.first) {
            this.scoreText.text = "GET READY";
          }
          if (state.time > 2) {
            this.scoreText.text = "0";
            state.set("PLAYING");
          }
          break;

        case "PLAYING":
          _get(GameScreen.prototype.__proto__ || Object.getPrototypeOf(GameScreen.prototype), "update", this).call(this, dt, t);
          this.updatePlaying();
          break;

        case "GAMEOVER":
          if (state.first) {
            player.gameOver = true;
          }
          _get(GameScreen.prototype.__proto__ || Object.getPrototypeOf(GameScreen.prototype), "update", this).call(this, dt, t);

          // If player dead, wait for space bar
          if (player.gameOver && controls.action) {
            this.onGameOver();
          }
          break;
      }

      state.update(dt);
    }
  }, {
    key: "updatePlaying",
    value: function updatePlaying() {
      var _this2 = this;

      var bats = this.bats,
          player = this.player,
          pickups = this.pickups,
          state = this.state;

      bats.map(function (bat) {
        if (entity.hit(player, bat)) {
          state.set("GAMEOVER");
        }
      });

      // Collect pickup!
      entity.hits(player, pickups, function (p) {
        p.dead = true;
        _this2.score++;
        if (pickups.children.length === 1) {
          _this2.populate();
          _this2.score += 5;
        }
        _this2.scoreText.text = _this2.score;
      });
    }
  }]);

  return GameScreen;
}(Container);

exports.default = GameScreen;

},{"../pop/index.js":14,"./Level.js":21,"./entities/Bat.js":22,"./entities/Pickup.js":24,"./entities/Player.js":25,"./entities/Totem.js":26}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileMap = _index2.default.TileMap,
    Texture = _index2.default.Texture,
    math = _index2.default.math;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Level = function (_TileMap) {
  _inherits(Level, _TileMap);

  function Level() {
    _classCallCheck(this, Level);

    var tileSize = 48;
    var tileIndexes = [{ id: "empty", x: 0, y: 2, walkable: true }, { id: "wall", x: 2, y: 3 }, { id: "wall3D", x: 3, y: 3 }];

    var ascii = "\n#########################\n#####                ####\n###                B  ###\n##                 ##  ##\n#       ########       ##\n#   ##       ###        #\n#B            ####      #\n###             ##      T\n####   ##T##    ####    #\n#####                  ##\n###                  ####\n##    ##                #\n#   #####        ########\n# ########    T##########\n#X          #############\n#########################";

    var spawns = {
      player: null,
      totems: [],
      bats: [],
      pickups: []
    };

    // Turn the ascii into cells
    var cells = ascii.split("\n").slice(1).map(function (row) {
      return row.split("");
    });
    var mapH = cells.length;
    var mapW = cells.reduce(function (max, row) {
      return Math.max(max, row.length);
    }, 0);

    // "pad out" the rows so they are all the same length
    var padded = cells.map(function (row) {
      var extra = mapW - row.length;
      return [].concat(_toConsumableArray(row), _toConsumableArray(Array(extra).fill(" ")));
    });

    // Find spawns, and replace with correct tiles
    var level = padded.map(function (row, y) {
      return row.map(function (cell, x) {
        switch (cell) {
          case "#":
            return 1;
          case "T":
            spawns.totems.push({ x: x, y: y });
            return 1;
          case "B":
            spawns.bats.push({ x: x, y: y });
            return 0;
          case "X":
            spawns.player = { x: x, y: y };
            return 0;
          default:
            return 0;
        }
      });
    }).reduce(function (ac, el) {
      return [].concat(_toConsumableArray(ac), _toConsumableArray(el));
    });

    // "3d-ify" if no wall below a tile
    for (var y = 1; y < mapH; y++) {
      for (var x = 0; x < mapW; x++) {
        var above = level[(y - 1) * mapW + x];
        var me = level[y * mapW + x];
        if (me === 1 && tileIndexes[above].walkable) {
          level[y * mapW + x] = 2;
        }
      }
    }

    // Map spawn points to pixel locations
    var _this = _possibleConstructorReturn(this, (Level.__proto__ || Object.getPrototypeOf(Level)).call(this, level.map(function (i) {
      return tileIndexes[i];
    }), mapW, mapH, tileSize, tileSize, texture));

    _this.spawns = {
      player: _this.mapToPixelPos(spawns.player),
      bats: spawns.bats.map(function (b) {
        return _this.mapToPixelPos(b);
      }),
      totems: spawns.totems.map(function (t) {
        return _this.mapToPixelPos(t);
      }),
      pickups: spawns.pickups.map(function (p) {
        return _this.mapToPixelPos(p);
      })
    };
    return _this;
  }

  _createClass(Level, [{
    key: "findFreeSpot",
    value: function findFreeSpot() {
      var mapW = this.mapW,
          mapH = this.mapH;

      var found = false;
      var x = void 0,
          y = void 0;
      while (!found) {
        x = math.rand(mapW);
        y = math.rand(mapH);

        var _tileAtMapPos = this.tileAtMapPos({ x: x, y: y }),
            frame = _tileAtMapPos.frame;

        if (frame.walkable) {
          found = true;
        }
      }
      return this.mapToPixelPos({ x: x, y: y });
    }
  }]);

  return Level;
}(TileMap);

exports.default = Level;

},{"../pop/index.js":14}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    entity = _index2.default.entity,
    math = _index2.default.math,
    State = _index2.default.State;


var texture = new Texture("res/images/bravedigger-tiles.png");

var states = {
  ATTACK: 0,
  EVADE: 1,
  WANDER: 2
};

var Bat = function (_TileSprite) {
  _inherits(Bat, _TileSprite);

  function Bat(target) {
    _classCallCheck(this, Bat);

    var _this = _possibleConstructorReturn(this, (Bat.__proto__ || Object.getPrototypeOf(Bat)).call(this, texture, 48, 48));

    _this.hitBox = {
      x: 6,
      y: 6,
      w: 30,
      h: 26
    };
    _this.frame.x = 3;
    _this.frame.y = 1;
    _this.speed = 100;
    _this.target = target;
    _this.waypoint = null;

    _this.state = new State(states.EVADE);
    return _this;
  }

  _createClass(Bat, [{
    key: "update",
    value: function update(dt, t) {
      var pos = this.pos,
          frame = this.frame,
          speed = this.speed,
          target = this.target,
          waypoint = this.waypoint,
          state = this.state;


      var angle = entity.angle(target, this);
      var distance = entity.distance(target, this);
      var xo = 0;
      var yo = 0;
      var waypointAngle = void 0;
      var waypointDistance = void 0;

      switch (state.get()) {
        case states.ATTACK:
          xo = Math.cos(angle) * speed * dt;
          yo = Math.sin(angle) * speed * dt;
          if (distance < 60) {
            state.set(states.EVADE);
          }
          break;
        case states.EVADE:
          xo = -Math.cos(angle) * speed * dt;
          yo = -Math.sin(angle) * speed * dt;
          if (distance > 120) {
            if (math.randOneIn(2)) {
              state.set(states.WANDER);
              this.waypoint = {
                x: pos.x + math.rand(-200, 200),
                y: pos.y + math.rand(-200, 200)
              };
            } else {
              state.set(states.ATTACK);
            }
          }
          break;
        case states.WANDER:
          waypointAngle = math.angle(waypoint, pos);
          waypointDistance = math.distance(pos, waypoint);

          xo = Math.cos(waypointAngle) * speed * dt;
          yo = Math.sin(waypointAngle) * speed * dt;
          if (waypointDistance < 60) {
            state.set(states.EVADE);
          }
          break;
      }
      pos.x += xo;
      pos.y += yo;

      frame.x = (t / 0.1 | 0) % 2 + 3;
      state.update(dt);
    }
  }]);

  return Bat;
}(TileSprite);

exports.default = Bat;

},{"../../pop/index.js":14}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    math = _index2.default.math;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Bullet = function (_TileSprite) {
  _inherits(Bullet, _TileSprite);

  function Bullet(dir) {
    var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

    _classCallCheck(this, Bullet);

    var _this = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, texture, 48, 48));

    _this.hitBox = {
      x: 24,
      y: 12,
      w: 24,
      h: 26
    };
    _this.frame.x = 4;
    _this.frame.y = 2;
    _this.pivot.x = 24;
    _this.pivot.y = 24;
    _this.speed = speed;
    _this.dir = dir;
    _this.life = 3;
    _this.rotation = math.angle(dir, { x: 0, y: 0 });
    return _this;
  }

  _createClass(Bullet, [{
    key: "update",
    value: function update(dt) {
      var pos = this.pos,
          speed = this.speed,
          dir = this.dir;

      // Move in the direction of the path

      pos.x += speed * dt * dir.x;
      pos.y += speed * dt * dir.y;

      this.rotation += math.randf(-Math.PI, Math.PI) * dt;

      if ((this.life -= dt) < 0) {
        this.dead = true;
      }
    }
  }]);

  return Bullet;
}(TileSprite);

exports.default = Bullet;

},{"../../pop/index.js":14}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Pickup = function (_TileSprite) {
  _inherits(Pickup, _TileSprite);

  function Pickup() {
    _classCallCheck(this, Pickup);

    var _this = _possibleConstructorReturn(this, (Pickup.__proto__ || Object.getPrototypeOf(Pickup)).call(this, texture, 48, 48));

    _this.hitBox = {
      x: 2,
      y: 22,
      w: 44,
      h: 26
    };
    _this.frame.x = 5;
    _this.frame.y = 2;
    return _this;
  }

  return Pickup;
}(TileSprite);

exports.default = Pickup;

},{"../../pop/index.js":14}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    wallslide = _index2.default.wallslide;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Player = function (_TileSprite) {
  _inherits(Player, _TileSprite);

  function Player(controls, map) {
    _classCallCheck(this, Player);

    var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, texture, 48, 48));

    _this.controls = controls;
    _this.map = map;
    _this.hitBox = {
      x: 8,
      y: 10,
      w: 28,
      h: 38
    };
    _this.frame.x = 4;
    _this.speed = 250;
    _this.jumping = true;
    _this.vel = 0;
    return _this;
  }

  _createClass(Player, [{
    key: "update",
    value: function update(dt, t) {
      var pos = this.pos,
          controls = this.controls,
          map = this.map,
          speed = this.speed,
          gameOver = this.gameOver;


      if (gameOver) {
        this.rotation += dt * 5;
        this.pivot.y = 24;
        this.pivot.x = 24;
        return;
      }

      var x = controls.x;

      var xo = x * dt * speed;
      var yo = 0;

      if (!this.jumping && controls.action) {
        this.vel = -10;
        this.jumping = true;
      }

      if (this.jumping) {
        yo += this.vel;
        this.vel += 32 * dt;
      }

      var r = wallslide(this, map, xo, yo);

      if (r.hits.down) {
        this.jumping = false;
        this.vel = 0;
      }
      if (r.hits.up) {
        this.vel = 0;
      }

      // Check if falling
      if (!this.jumping && !r.hits.down) {
        this.jumping = true;
        this.vel = 3;
      }

      pos.x += r.x;
      pos.y += r.y;

      // Animations
      if (x && !this.jumping) {
        this.frame.x = (t / 0.1 | 0) % 4;
        if (x > 0) {
          this.anchor.x = 0;
          this.scale.x = 1;
        } else if (x < 0) {
          this.anchor.x = this.w;
          this.scale.x = -1;
        }
      }
    }
  }]);

  return Player;
}(TileSprite);

exports.default = Player;

},{"../../pop/index.js":14}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _Bullet = require("./Bullet.js");

var _Bullet2 = _interopRequireDefault(_Bullet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entity = _index2.default.entity,
    Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    math = _index2.default.math,
    State = _index2.default.State;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Totem = function (_TileSprite) {
  _inherits(Totem, _TileSprite);

  function Totem(target, onFire) {
    _classCallCheck(this, Totem);

    var _this = _possibleConstructorReturn(this, (Totem.__proto__ || Object.getPrototypeOf(Totem)).call(this, texture, 48, 48));

    _this.frame.x = 2;
    _this.frame.y = 1;
    _this.target = target;
    _this.onFire = onFire;
    _this.fireIn = 0;
    _this.state = new State("IDLE");
    return _this;
  }

  _createClass(Totem, [{
    key: "update",
    value: function update(dt, t) {
      var state = this.state,
          frame = this.frame,
          target = this.target;

      var distance = void 0;
      switch (state.get()) {
        case "IDLE":
          distance = entity.distance(target, this);
          frame.x = distance < 180 ? 1 : 2;
          if (distance < 180 && math.randOneIn(250)) {
            state.set("WINDUP");
          }
          break;
        case "WINDUP":
          frame.x = [0, 1][(t / 0.1 | 0) % 2];
          if (state.time > 1) {
            this.fireAtTarget();
            state.set("IDLE");
          }
          break;
      }
      state.update(dt);
    }
  }, {
    key: "fireAtTarget",
    value: function fireAtTarget() {
      var target = this.target,
          onFire = this.onFire;

      var totemPos = entity.center(this);
      var targetPos = entity.center(target);
      var angle = math.angle(targetPos, totemPos);

      var x = Math.cos(angle);
      var y = Math.sin(angle);

      var bullet = new _Bullet2.default({ x: x, y: y });
      bullet.pos.x = totemPos.x - bullet.w / 2;
      bullet.pos.y = totemPos.y - bullet.h / 2;
      bullet.speed = 300;

      onFire(bullet);
    }
  }]);

  return Totem;
}(TileSprite);

exports.default = Totem;

},{"../../pop/index.js":14,"./Bullet.js":23}],27:[function(require,module,exports){
"use strict";

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _GameScreen = require("./GameScreen.js");

var _GameScreen2 = _interopRequireDefault(_GameScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Game = _index2.default.Game,
    KeyControls = _index2.default.KeyControls;


var game = new Game(48 * 25, 48 * 16);
var keys = new KeyControls();
function startGame() {
  game.scene = new _GameScreen2.default(game, keys, startGame);
}
startGame();
game.run();

},{"../pop/index.js":14,"./GameScreen.js":20}]},{},[27]);
