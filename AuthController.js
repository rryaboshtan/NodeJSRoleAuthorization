const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('./config');

const User = require('./models/User');
const Role = require('./models/Role');

const generateAccessToken = (id, roles) => {
   const payload = {
      id,
      roles,
   };

   return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class AuthController {
   async registration(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Registration error', errors });
         }

         const { username, password } = req.body;

         const candidate = await User.findOne({ username });

         if (candidate) {
            return res.status(400).json({ message: `User with name ${username} already exist` });
         }
         const hashPassword = bcrypt.hashSync(password, 7);
         const userRole = await Role.findOne({ value: 'USER' });

         const user = new User({ username, password: hashPassword, roles: [userRole.value] });
         await user.save();

         return res.json({ message: 'User was successfully registered' });
      } catch (error) {
         console.log(error);
         res.status(400).json({ message: 'Registration error' });
      }
   }
   async login(req, res) {
      try {
         const { username, password } = req.body;
         const user = await User.findOne({ username });
         if (!user) {
            return res.status(400).json({ message: `User with name ${username} not found` });
         }
         const isPasswordValid = bcrypt.compareSync(password, user.password);
         if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
         }
         const token = generateAccessToken(user._id, user.roles);

         return res.json({ token });
      } catch (error) {
         console.log(error);
         res.status(400).json({ message: 'Registration error' });
      }
   }

   async getUsers(req, res) {
      try {
         //  const userRole = new Role();
         //  const adminRole = new Role({ value: 'ADMIN' });
         //  await userRole.save();
         //  await adminRole.save();
         const users = await User.find();



         res.json(users);
      } catch (error) {}
   }
}

module.exports = AuthController;
