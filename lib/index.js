"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _url = _interopRequireDefault(require("url"));

var _passportOauth = require("passport-oauth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * `GoogleTokenStrategy` constructor.
 *
 * The Google authentication strategy authenticates requests by delegating to
 * Google using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occurred, `error` should be set.
 *
 * @param {Object} options
 * @param {Function} verify
 * @example
 * passport.use(new GoogleTokenStrategy({
 *   clientID: '123456789',
 *   clientSecret: 'shhh-its-a-secret'
 * }), (accessToken, refreshToken, profile, done) => {
 *   User.findOrCreate({facebookId: profile.id}, done);
 * });
 */
var GoogleTokenStrategy =
/*#__PURE__*/
function (_OAuth2Strategy) {
  _inherits(GoogleTokenStrategy, _OAuth2Strategy);

  function GoogleTokenStrategy(_options, _verify) {
    var _this;

    _classCallCheck(this, GoogleTokenStrategy);

    var options = _options || {};
    var verify = _verify;

    var _apiVersion = options.apiVersion || 'v3';

    options.authorizationURL = options.authorizationURL || "https://www.google.com/".concat(_apiVersion, "/dialog/oauth");
    options.tokenURL = options.tokenURL || "https://graph.google.com/".concat(_apiVersion, "/oauth/access_token");
    _this = _possibleConstructorReturn(this, _getPrototypeOf(GoogleTokenStrategy).call(this, options, verify));
    _this.name = 'google-token';
    _this._accessTokenField = options.accessTokenField || 'access_token';
    _this._refreshTokenField = options.refreshTokenField || 'refresh_token';
    _this._profileURL = options.profileURL || "https://www.googleapis.com/oauth2/".concat(_apiVersion, "/userinfo");
    _this._profileFields = options.profileFields || ['id'];
    _this._profileImage = options.profileImage || {};
    _this._clientSecret = options.clientSecret;
    _this._enableProof = typeof options.enableProof === 'boolean' ? options.enableProof : true;
    _this._passReqToCallback = options.passReqToCallback;

    _this._oauth2.useAuthorizationHeaderforGET(false);

    _this._apiVersion = _apiVersion;
    return _this;
  }
  /**
   * Authenticate request by delegating to a service provider using OAuth 2.0.
   * @param {Object} req
   * @param {Object} options
   */


  _createClass(GoogleTokenStrategy, [{
    key: "authenticate",
    value: function authenticate(req, options) {
      var _this2 = this;

      var accessToken = this.lookup(req, this._accessTokenField);
      var refreshToken = this.lookup(req, this._refreshTokenField);
      if (!accessToken) return this.fail({
        message: "You should provide ".concat(this._accessTokenField)
      });

      this._loadUserProfile(accessToken, function (error, profile) {
        if (error) return _this2.error(error);

        var verified = function verified(error, user, info) {
          if (error) return _this2.error(error);
          if (!user) return _this2.fail(info);
          return _this2.success(user, info);
        };

        if (_this2._passReqToCallback) {
          _this2._verify(req, accessToken, refreshToken, profile, verified);
        } else {
          _this2._verify(accessToken, refreshToken, profile, verified);
        }
      });
    }
    /**
     * Retrieve user profile from Account Kit.
     *
     * This function constructs a normalized profile, with the following properties:
     *
     *   - `provider`         always set to `accountkit`
     *   - `id`               the user's ID
     *   - `picture`          the user's picture
     *   - `email`            the user's email address
     *
     * @param {String} accessToken
     * @param {Function} done
     */

  }, {
    key: "userProfile",
    value: function userProfile(accessToken, done) {
      var profileURL = _url["default"].parse(this._profileURL);

      profileURL = _url["default"].format(profileURL);

      this._oauth2.get(profileURL, accessToken, function (error, body, res) {
        if (error) return done(new _passportOauth.InternalOAuthError('Failed to fetch user profile', error));

        try {
          var json = JSON.parse(body);
          console.log(json);
          var profile = {
            provider: 'google',
            id: json.sub,
            email: json.email || '',
            picture: json.picture || '',
            _raw: body,
            _json: json
          };
          done(null, profile);
        } catch (e) {
          done(e);
        }
      });
    }
    /**
     * Parses an OAuth2 RFC6750 bearer authorization token, this method additionally is RFC 2616 compliant and respects
     * case insensitive headers.
     *
     * @param {Object} req http request object
     * @returns {String} value for field within body, query, or headers
     */

  }, {
    key: "parseOAuth2Token",
    value: function parseOAuth2Token(req) {
      var OAuth2AuthorizationField = 'Authorization';
      var headerValue = req.headers && (req.headers[OAuth2AuthorizationField] || req.headers[OAuth2AuthorizationField.toLowerCase()]);
      return headerValue && function () {
        var bearerRE = /Bearer\ (.*)/;
        var match = bearerRE.exec(headerValue);
        return match && match[1];
      }();
    }
    /**
     * Performs a lookup of the param field within the request, this method handles searhing the body, query, and header.
     * Additionally this method is RFC 2616 compliant and allows for case insensitive headers. This method additionally will
     * delegate outwards to the OAuth2Token parser to validate whether a OAuth2 bearer token has been provided.
     *
     * @param {Object} req http request object
     * @param {String} field
     * @returns {String} value for field within body, query, or headers
     */

  }, {
    key: "lookup",
    value: function lookup(req, field) {
      return req.body && req.body[field] || req.query && req.query[field] || req.headers && (req.headers[field] || req.headers[field.toLowerCase()]) || this.parseOAuth2Token(req);
    }
    /**
     * Converts array of profile fields to string
     * @param {Array} _profileFields Profile fields i.e. ['id', 'email']
     * @returns {String}
     */

  }], [{
    key: "convertProfileFields",
    value: function convertProfileFields(_profileFields) {
      var profileFields = _profileFields || [];
      var map = {
        'id': 'id',
        'phone': 'phone',
        'email': 'email',
        'picture': 'picture'
      };
      return profileFields.reduce(function (acc, field) {
        return acc.concat(map[field] || field);
      }, []).join(',');
    }
  }]);

  return GoogleTokenStrategy;
}(_passportOauth.OAuth2Strategy);

exports["default"] = GoogleTokenStrategy;
module.exports = exports.default;