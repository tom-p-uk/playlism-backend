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

  it('shows a list of users in the "friends" and friendRequests" fields', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var friend1, friend2, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            friend1 = new _User2.default({ displayName: 'Friend1' });
            friend2 = new _User2.default({ displayName: 'Friend2' });
            _context3.next = 4;
            return friend1.save();

          case 4:
            _context3.next = 6;
            return friend2.save();

          case 6:

            user.friends.push(friend1);
            user.friendRequests.push(friend2);
            _context3.next = 10;
            return user.save();

          case 10:
            _context3.next = 12;
            return _User2.default.findById(user._id).populate('friends').populate('friendRequests');

          case 12:
            result = _context3.sent;

            (0, _chai.expect)(result.friends[0]._id).to.eql(friend1._id);
            (0, _chai.expect)(result.friendRequests[0]._id).to.eql(friend2._id);

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('adds a date to the "dateJoined" field', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _User2.default.findById(user._id);

          case 2:
            result = _context4.sent;

            (0, _chai.expect)(result).to.have.property('dateJoined');
            (0, _chai.expect)(result.dateJoined).to.be.a('date');

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});