'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chai = require('chai');

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

var _token = require('../../utils/token');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('userController', function () {
  var user1 = void 0;
  var user1Token = void 0;

  beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user1 = new _User2.default({
              firstName: 'Test',
              lastName: 'User',
              displayName: 'Test User1',
              profileImg: 'http://www.somesite.com/someimg.png'
            });

            user1Token = (0, _token2.default)(user1);
            _context.next = 4;
            return user1.save();

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  /*****************************************************************************
  ********************************* .fetchUser *********************************
  *****************************************************************************/
  describe('.fetchUser', function () {
    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var res;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/user');

            case 2:
              res = _context2.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('responds with user info following a successful request', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      var res, _res$body$success$use, _id, firstName, lastName, displayName;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/user').set('authorization', user1Token);

            case 2:
              res = _context3.sent;
              _res$body$success$use = res.body.success.user, _id = _res$body$success$use._id, firstName = _res$body$success$use.firstName, lastName = _res$body$success$use.lastName, displayName = _res$body$success$use.displayName;

              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(_id).to.equal(user1._id.toString());
              (0, _chai.expect)(firstName).to.equal(user1.firstName);
              (0, _chai.expect)(lastName).to.equal(user1.lastName);
              (0, _chai.expect)(displayName).to.equal(user1.displayName);

            case 9:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));
  });

  /*****************************************************************************
  ****************************** .editDisplayName ******************************
  *****************************************************************************/
  describe('.editDisplayName', function () {
    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
      var res;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/displayname');

            case 2:
              res = _context4.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));

    it('allows a user to edit their display name', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
      var res, updatedUser;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/displayname').send({ displayName: 'Display Name' }).set('authorization', user1Token);

            case 2:
              res = _context5.sent;
              _context5.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              updatedUser = _context5.sent;

              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(updatedUser.displayName).to.equal('Display Name');

            case 9:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));

    it('throws an error if the proposed display name is too short', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
      var res, foundUser;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/displayname').send({ displayName: '' }).set('authorization', user1Token);

            case 2:
              res = _context6.sent;
              _context6.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              foundUser = _context6.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('Display name must be at least 4 characters long.');
              (0, _chai.expect)(foundUser.displayName).to.equal('Test User1');

            case 10:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));

    it('throws an error if the proposed display name is too long', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
      var res, foundUser;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/displayname').send({ displayName: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901' }).set('authorization', user1Token);

            case 2:
              res = _context7.sent;
              _context7.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              foundUser = _context7.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('Display name must no more than 100 characters long.');
              (0, _chai.expect)(foundUser.displayName).to.equal('Test User1');

            case 10:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));
  });

  /*****************************************************************************
  ******************************* .editProfileImg ******************************
  *****************************************************************************/
  describe('.editProfileImg', function () {
    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
      var res;
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/profileimg');

            case 2:
              res = _context8.sent;

              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, undefined);
    })));

    it('allows a user to change their profile image', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
      var res, updatedUser;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/profileimg').send({ profileImg: 'http://www.somesite.com/someotherimg.png' }).set('authorization', user1Token);

            case 2:
              res = _context9.sent;
              _context9.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              updatedUser = _context9.sent;

              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(updatedUser.profileImg).to.equal('http://www.somesite.com/someotherimg.png');

            case 9:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, undefined);
    })));

    it('sends an error message if an invalid URL is passed', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
      var res, updatedUser;
      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/profileimg').send({ profileImg: '' }).set('authorization', user1Token);

            case 2:
              res = _context10.sent;
              _context10.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              updatedUser = _context10.sent;

              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('You must provide a valid URL.');

            case 9:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, undefined);
    })));
  });

  /*****************************************************************************
  ******************************** .addPushToken *******************************
  *****************************************************************************/
  describe('.addPushToken', function () {
    var pushToken = 'ExponentPushToken[XPWN7TGbzc2PUSwXbnAtTv]';

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {
      var res;
      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/pushtoken');

            case 2:
              res = _context11.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, undefined);
    })));

    it('sends an error if an invalid Expo push token is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12() {
      var res;
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/pushtoken').send({ pushToken: '12345' }).set('authorization', user1Token);

            case 2:
              res = _context12.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('Not a valid Expo push token.');

            case 6:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, undefined);
    })));

    it("updates a user's 'pushToken' prop", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13() {
      var res, foundUser;
      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/pushtoken').send({ pushToken: pushToken }).set('authorization', user1Token);

            case 2:
              res = _context13.sent;
              _context13.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              foundUser = _context13.sent;

              (0, _chai.expect)(foundUser.pushToken).to.equal(pushToken);

            case 7:
            case 'end':
              return _context13.stop();
          }
        }
      }, _callee13, undefined);
    })));
  });

  /*****************************************************************************
  ********************************* .addFriend *********************************
  *****************************************************************************/
  describe('.addFriend', function () {
    var user2 = void 0;
    var user2Token = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14() {
      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              user2 = new _User2.default({
                firstName: 'Test',
                lastName: 'User',
                displayName: 'Test User12'
              });

              user2Token = (0, _token2.default)(user2);
              _context14.next = 4;
              return user2.save();

            case 4:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee14, undefined);
    })));

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15() {
      var res;
      return _regenerator2.default.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/add');

            case 2:
              res = _context15.sent;

              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context15.stop();
          }
        }
      }, _callee15, undefined);
    })));

    it('sends an error if no user ID, or an invalid user ID, is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16() {
      var res1, res2;
      return _regenerator2.default.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/add').set('authorization', user1Token);

            case 2:
              res1 = _context16.sent;
              _context16.next = 5;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/add').send({ userId: '12345' }).set('authorization', user1Token);

            case 5:
              res2 = _context16.sent;


              (0, _chai.expect)(res1.status).to.equal(422);
              (0, _chai.expect)(res1.body.error).to.exist;
              (0, _chai.expect)(res1.body.error).to.equal('You must provide a valid user ID.');
              (0, _chai.expect)(res2.status).to.equal(422);
              (0, _chai.expect)(res2.body.error).to.exist;
              (0, _chai.expect)(res2.body.error).to.equal('You must provide a valid user ID.');

            case 12:
            case 'end':
              return _context16.stop();
          }
        }
      }, _callee16, undefined);
    })));

    it("adds the sending user to the receiving user's 'friendRequests' array", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17() {
      var res, foundUser;
      return _regenerator2.default.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/add').send({ userId: user2._id }).set('authorization', user1Token);

            case 2:
              res = _context17.sent;
              _context17.next = 5;
              return _User2.default.findById(user2._id);

            case 5:
              foundUser = _context17.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundUser.friendRequests.length).to.equal(1);
              (0, _chai.expect)(foundUser.friendRequests.indexOf(user1._id)).to.not.equal(-1);

            case 10:
            case 'end':
              return _context17.stop();
          }
        }
      }, _callee17, undefined);
    })));

    it("adds the receiving user to the sending user's 'friendRequestsSent' array", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18() {
      var res, foundUser;
      return _regenerator2.default.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/add').send({ userId: user2._id }).set('authorization', user1Token);

            case 2:
              res = _context18.sent;
              _context18.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              foundUser = _context18.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundUser.friendRequestsSent.length).to.equal(1);
              (0, _chai.expect)(foundUser.friendRequestsSent.indexOf(user2._id)).to.not.equal(-1);

            case 10:
            case 'end':
              return _context18.stop();
          }
        }
      }, _callee18, undefined);
    })));

    it('prevents duplicate requests being sent', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19() {
      var res, foundUser1, foundUser2;
      return _regenerator2.default.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              user1.friendRequestsSent = [user2];
              user2.friendRequests = [user1];

              _context19.next = 4;
              return user1.save();

            case 4:
              _context19.next = 6;
              return user2.save();

            case 6:
              _context19.next = 8;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/add').send({ userId: user2._id }).set('authorization', user1Token);

            case 8:
              res = _context19.sent;
              _context19.next = 11;
              return _User2.default.findById(user1._id);

            case 11:
              foundUser1 = _context19.sent;
              _context19.next = 14;
              return _User2.default.findById(user2._id);

            case 14:
              foundUser2 = _context19.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundUser1.friendRequestsSent.length).to.equal(1);
              (0, _chai.expect)(foundUser2.friendRequests.length).to.equal(1);

            case 19:
            case 'end':
              return _context19.stop();
          }
        }
      }, _callee19, undefined);
    })));
  });

  /*****************************************************************************
  ************************ .acceptRejectFriendRequest **************************
  *****************************************************************************/
  describe('.acceptRejectFriendRequest', function () {
    var user2 = void 0;
    var user2Token = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20() {
      return _regenerator2.default.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              user2 = new _User2.default({
                firstName: 'Test',
                lastName: 'User',
                displayName: 'Test User2',
                friendRequests: [user1]
              });

              user1.friendRequestsSent = [user2];
              user2Token = (0, _token2.default)(user2);

              _context20.next = 5;
              return user1.save();

            case 5:
              _context20.next = 7;
              return user2.save();

            case 7:
            case 'end':
              return _context20.stop();
          }
        }
      }, _callee20, undefined);
    })));

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21() {
      var res;
      return _regenerator2.default.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/acceptreject');

            case 2:
              res = _context21.sent;

              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context21.stop();
          }
        }
      }, _callee21, undefined);
    })));

    it('sends an error if no user ID, or an invalid user ID, is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22() {
      var res1, res2;
      return _regenerator2.default.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/acceptreject').set('authorization', user2Token);

            case 2:
              res1 = _context22.sent;
              _context22.next = 5;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/acceptreject').send({ userId: '12345' }).set('authorization', user2Token);

            case 5:
              res2 = _context22.sent;


              (0, _chai.expect)(res1.status).to.equal(422);
              (0, _chai.expect)(res1.body.error).to.exist;
              (0, _chai.expect)(res1.body.error).to.equal('You must provide a valid user ID.');
              (0, _chai.expect)(res2.status).to.equal(422);
              (0, _chai.expect)(res2.body.error).to.exist;
              (0, _chai.expect)(res2.body.error).to.equal('You must provide a valid user ID.');

            case 12:
            case 'end':
              return _context22.stop();
          }
        }
      }, _callee22, undefined);
    })));

    it("sends an error if user ID provided is not in a user's 'friendRequests' array", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23() {
      var user3, res;
      return _regenerator2.default.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              user3 = new _User2.default();
              _context23.next = 3;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/acceptreject').send({ userId: user3._id }).set('authorization', user2Token);

            case 3:
              res = _context23.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('You have not received a friend request from this user.');

            case 7:
            case 'end':
              return _context23.stop();
          }
        }
      }, _callee23, undefined);
    })));

    it("removes the sending user from the receiving user's 'friendRequests' array", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee24() {
      var user3, res, foundUser;
      return _regenerator2.default.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              user3 = new _User2.default();

              user2.friendRequests.push(user3);
              _context24.next = 4;
              return user2.save();

            case 4:
              _context24.next = 6;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/acceptreject').send({ userId: user1._id }).set('authorization', user2Token);

            case 6:
              res = _context24.sent;
              _context24.next = 9;
              return _User2.default.findById(user2._id);

            case 9:
              foundUser = _context24.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundUser.friendRequests.length).to.equal(1);
              (0, _chai.expect)(foundUser.friendRequests.indexOf(user1._id)).to.equal(-1);

            case 14:
            case 'end':
              return _context24.stop();
          }
        }
      }, _callee24, undefined);
    })));

    it("removes the receiving user from the sending user's 'friendRequestsSent' array", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee25() {
      var res, foundUser;
      return _regenerator2.default.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _context25.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/acceptreject').send({ userId: user1._id }).set('authorization', user2Token);

            case 2:
              res = _context25.sent;
              _context25.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              foundUser = _context25.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundUser.friendRequestsSent.length).to.equal(0);
              (0, _chai.expect)(foundUser.friendRequestsSent.indexOf(user2._id)).to.equal(-1);

            case 10:
            case 'end':
              return _context25.stop();
          }
        }
      }, _callee25, undefined);
    })));

    it("adds the sending user to the receiving user's 'friends' array if { accept: true } is sent", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee26() {
      var res, foundUser;
      return _regenerator2.default.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/acceptreject').send({ userId: user1._id, accept: true }).set('authorization', user2Token);

            case 2:
              res = _context26.sent;
              _context26.next = 5;
              return _User2.default.findById(user2._id);

            case 5:
              foundUser = _context26.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundUser.friends.length).to.equal(1);
              (0, _chai.expect)(foundUser.friends.indexOf(user1._id)).to.not.equal(-1);

            case 10:
            case 'end':
              return _context26.stop();
          }
        }
      }, _callee26, undefined);
    })));

    it("adds the receiving user to the sending user's 'friends' array if { accept: true } is sent", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee27() {
      var res, foundUser;
      return _regenerator2.default.wrap(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/acceptreject').send({ userId: user1._id, accept: true }).set('authorization', user2Token);

            case 2:
              res = _context27.sent;
              _context27.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              foundUser = _context27.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundUser.friends.length).to.equal(1);
              (0, _chai.expect)(foundUser.friends.indexOf(user2._id)).to.not.equal(-1);

            case 10:
            case 'end':
              return _context27.stop();
          }
        }
      }, _callee27, undefined);
    })));

    it("adds the sending user to the receiving user's 'friends' array if { accept: true } is not sent", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee28() {
      var res, foundUser;
      return _regenerator2.default.wrap(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              _context28.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/acceptreject').send({ userId: user1._id }).set('authorization', user2Token);

            case 2:
              res = _context28.sent;
              _context28.next = 5;
              return _User2.default.findById(user2._id);

            case 5:
              foundUser = _context28.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundUser.friends.length).to.equal(0);
              (0, _chai.expect)(foundUser.friends.indexOf(user1._id)).to.equal(-1);

            case 10:
            case 'end':
              return _context28.stop();
          }
        }
      }, _callee28, undefined);
    })));

    it("adds the receiving user to the sending user's 'friends' array if { accept: true } is sent", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee29() {
      var res, foundUser;
      return _regenerator2.default.wrap(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/acceptreject').send({ userId: user1._id }).set('authorization', user2Token);

            case 2:
              res = _context29.sent;
              _context29.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              foundUser = _context29.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundUser.friends.length).to.equal(0);
              (0, _chai.expect)(foundUser.friends.indexOf(user2._id)).to.equal(-1);

            case 10:
            case 'end':
              return _context29.stop();
          }
        }
      }, _callee29, undefined);
    })));
  });

  /*****************************************************************************
  ******************************* .deleteFriend ********************************
  *****************************************************************************/
  describe('.deleteFriend', function () {
    var user2 = void 0;
    var user2Token = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee30() {
      var user3;
      return _regenerator2.default.wrap(function _callee30$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              user3 = new _User2.default();


              user2 = new _User2.default({
                firstName: 'Test',
                lastName: 'User',
                displayName: 'Test User2',
                friends: [user1, user3]
              });

              user1.friends = [user2, user3];
              _context30.next = 5;
              return user1.save();

            case 5:
              _context30.next = 7;
              return user2.save();

            case 7:
            case 'end':
              return _context30.stop();
          }
        }
      }, _callee30, undefined);
    })));

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee31() {
      var res;
      return _regenerator2.default.wrap(function _callee31$(_context31) {
        while (1) {
          switch (_context31.prev = _context31.next) {
            case 0:
              _context31.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/delete');

            case 2:
              res = _context31.sent;

              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context31.stop();
          }
        }
      }, _callee31, undefined);
    })));

    it('sends an error if no user ID, or an invalid ID, is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee32() {
      var res1, res2;
      return _regenerator2.default.wrap(function _callee32$(_context32) {
        while (1) {
          switch (_context32.prev = _context32.next) {
            case 0:
              _context32.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/delete').set('authorization', user1Token);

            case 2:
              res1 = _context32.sent;
              _context32.next = 5;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/delete').send({ userId: '12345' }).set('authorization', user1Token);

            case 5:
              res2 = _context32.sent;


              (0, _chai.expect)(res1.status).to.equal(422);
              (0, _chai.expect)(res1.body.error).to.exist;
              (0, _chai.expect)(res1.body.error).to.equal('You must provide a valid user ID.');
              (0, _chai.expect)(res2.status).to.equal(422);
              (0, _chai.expect)(res2.body.error).to.exist;
              (0, _chai.expect)(res2.body.error).to.equal('You must provide a valid user ID.');

            case 12:
            case 'end':
              return _context32.stop();
          }
        }
      }, _callee32, undefined);
    })));

    it('sends an error if the user ID provided is not in the "friends" array', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee33() {
      var user4, res;
      return _regenerator2.default.wrap(function _callee33$(_context33) {
        while (1) {
          switch (_context33.prev = _context33.next) {
            case 0:
              user4 = new _User2.default();
              _context33.next = 3;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/delete').send({ userId: user4._id }).set('authorization', user1Token);

            case 3:
              res = _context33.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('That user is not currently in your friends list.');

            case 7:
            case 'end':
              return _context33.stop();
          }
        }
      }, _callee33, undefined);
    })));

    it("removes a user from both users' 'friends' arrays", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee34() {
      var res, foundUser1, foundUser2;
      return _regenerator2.default.wrap(function _callee34$(_context34) {
        while (1) {
          switch (_context34.prev = _context34.next) {
            case 0:
              _context34.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/user/friend/delete').send({ userId: user2._id }).set('authorization', user1Token);

            case 2:
              res = _context34.sent;
              _context34.next = 5;
              return _User2.default.findById(user1._id);

            case 5:
              foundUser1 = _context34.sent;
              _context34.next = 8;
              return _User2.default.findById(user2._id);

            case 8:
              foundUser2 = _context34.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundUser1.friends.length).to.equal(1);
              (0, _chai.expect)(foundUser1.friends.indexOf(user2._id)).to.equal(-1);
              (0, _chai.expect)(foundUser2.friends.length).to.equal(1);
              (0, _chai.expect)(foundUser2.friends.indexOf(user1._id)).to.equal(-1);

            case 15:
            case 'end':
              return _context34.stop();
          }
        }
      }, _callee34, undefined);
    })));
  });
});