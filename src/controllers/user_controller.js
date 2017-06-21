import User from '../models/User';
import tokenForUser from '../services/token';

export const signUp = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) return res.json({ error: 'You must provide a username and password.' });

  try {
    const user = await User.findOne({ 'local.username': username });
    if (user) return res.send({ error: 'Username is not available.' });
  } catch (err) {
    return res.status(500).send({ error: 'Error retrieving user from database.' });
  }

  const newUser = new User({
    local: {
      username,
      password,
    }
  });

  try {
    const savedUser = await newUser.save();
    return res.status(201).send({
      token: tokenForUser(savedUser),
      user: savedUser
    });
  } catch (err) {
    return res.status(500).send({ error: 'Error saving user to database.' });
  }
};

export const signIn = (req, res) => res.send({ token: tokenForUser(req.user), user: req.user });
