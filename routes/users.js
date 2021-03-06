//contains register route

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator'); //check the params if valid or not "from express-validator.io"
const User = require('../models/User');

//@route  POST  api/users
//@description  Register a user
//@access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must contain atleast six characters').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //res.send(req.body); //req.body provides info like name,email,password and to use it , add a middleware in server.js
    //req.body has info we need,we will destructure it in next line.
    const { name, email, password } = req.body;

    try {
      //check if user already present by email param
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User exists.' });
      }

      //if not exist , add new user in User model
      user = new User({
        name,
        email,
        password
      });

      //before saving password in db ,encrypt it by bcrypt
      const salt = await bcrypt.genSalt(10);

      //hash the password
      user.password = await bcrypt.hash(password, salt);

      //now save in db
      await user.save();

      //create payload/object to be sent in token
      const payload = {
        user: {
          id: user.id
        }
      };

      //to generate a token ,sign it first
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
  }
);

//export router

module.exports = router;
