const Router = require('express');
const { check } = require('express-validator');

const AuthController = require('./AuthController');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const authController = new AuthController();

const router = new Router();

router.post(
   '/registration',
   [
      check('username', 'User name cannot be empty').notEmpty(),
      check('password', 'Password must be longer than 4 and shorter than 10').isLength({ min: 4, max: 10 }),
   ],
   authController.registration
);
router.post('/login', authController.login);
// router.get('/users', authMiddleware, authController.getUsers);
router.get('/users', roleMiddleware(['USER', 'ADMIN']), authController.getUsers);

module.exports = router;
