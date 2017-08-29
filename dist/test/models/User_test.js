'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chai = require('chai');

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('User', function () {
  var user = void 0;

  beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = new _User2.default({ displayName: 'Test User' });

            _context.prev = 1;
            _context.next = 4;
            return user.save();

          case 4:
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](1);

            console.log(_context.t0);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 6]]);
  })));

  it('creates a new user', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _User2.default.find({});

          case 2:
            result = _context2.sent;

            (0, _chai.expect)(result.length).to.equal(1);
            (0, _chai.expect)(result[0]._id).to.eql(user._id);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('creates a new user with all the required fields', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var user2, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            user2 = new _User2.default({
              firstName: 'a',
              lastName: 'a',
              displayName: 'abcd',
              googleId: 'a',
              facebookId: 'a',
              profileImg: 'a',
              friends: [{
                friendsSince: Date.now(),
                user: user._id
              }],
              friendRequests: [],
              friendRequestsSent: [],
              lastLogin: Date.now(),
              pushToken: 'a',
              displayNameLower: 'a'
            });
            _context3.next = 3;
            return user2.save();

          case 3:
            result = _context3.sent;

            (0, _chai.expect)(result).to.have.property('firstName');
            (0, _chai.expect)(result).to.have.property('lastName');
            (0, _chai.expect)(result).to.have.property('displayName');
            (0, _chai.expect)(result).to.have.property('googleId');
            (0, _chai.expect)(result).to.have.property('facebookId');
            (0, _chai.expect)(result).to.have.property('profileImg');
            (0, _chai.expect)(result).to.have.property('friends');
            (0, _chai.expect)(result).to.have.property('friendRequests');
            (0, _chai.expect)(result).to.have.property('friendRequestsSent');
            (0, _chai.expect)(result).to.have.property('lastLogin');
            (0, _chai.expect)(result).to.have.property('pushToken');
            (0, _chai.expect)(result).to.have.property('displayNameLower');

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('shows a list of users in the "friends", "friendRequests" and "friendRequestsSent" fields', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var friend1, friend2, friend3, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            friend1 = new _User2.default({ displayName: 'Friend1' });
            friend2 = new _User2.default({ displayName: 'Friend2' });
            friend3 = new _User2.default({ displayName: 'Friend3' });
            _context4.next = 5;
            return friend1.save();

          case 5:
            _context4.next = 7;
            return friend2.save();

          case 7:

            user.friends.push({ user: friend1, friendsSince: Date.now() });
            user.friendRequests.push({ user: friend2, dateReceived: Date.now() });
            user.friendRequestsSent.push({ user: friend3, dateSent: Date.now() });
            _context4.next = 12;
            return user.save();

          case 12:
            _context4.next = 14;
            return _User2.default.findById(user._id).populate('friends').populate('friendRequests').populate('friendRequestsSent');

          case 14:
            result = _context4.sent;


            (0, _chai.expect)(result.friends[0].user).to.eql(friend1._id);
            (0, _chai.expect)(result.friendRequests[0].user).to.eql(friend2._id);
            (0, _chai.expect)(result.friendRequestsSent[0].user).to.eql(friend3._id);

          case 18:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('adds a date to the "dateJoined" field', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    var result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _User2.default.findById(user._id);

          case 2:
            result = _context5.sent;

            (0, _chai.expect)(result).to.have.property('dateJoined');
            (0, _chai.expect)(result.dateJoined).to.be.a('date');

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));
});