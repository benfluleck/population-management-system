import bcrypt from 'bcryptjs';

import User from '../models/user'


export const signup = async (req, res) => {
  try {
    const {
      email, password, firstName, lastName
    } = req.body;


    const userExists = await User.findOne({ email });


    if (userExists) {
      return res.status(409).json({ status: 'error', message: "This email is already in use" });
    }
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    bcrypt.genSalt(10, async (err, salt) => {
      if (err) {
        return res.status(400).json({ status: 'error', message: 'Password Error, Please try again' });
      }

      bcrypt.hash(data.password, salt, async (error, hash) => {
        if (error) {
          throw error;
        }
        data.password = hash;
        const newUser = new User({
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim(),
          password: data.password,
        });

        const createdUser = await newUser.save();

        const { _doc: { password, ...response } } = createdUser

        res.status(201).json({ status: 'success', message: 'User Created Successfully', data: response });

      });
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email })

    if (!userExists) {
      return res.status(404).json({ status: 'error', message: "This user does not exist" });
    }

    const isMatch = await bcrypt.compare(password, userExists.password)

    if (isMatch) {
      req.session && (req.session.userId = userExists.id)

      res.json({
        status: 'success', message: `Welcome ${userExists.firstName}`,
        data: {
          id: userExists.id
        }
      });
    } else {
      return res.status(401).json({ status: 'error', message: 'Wrong Credentials' });
    }
  } catch {
    res.status(400).json({ status: 'error', message: error.message })
  }
};

