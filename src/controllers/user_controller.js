import validUrl from 'valid-url';
import User from '../models/User';
import tokenForUser from '../services/token';

// export const signUp = async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//
//   if (!username || !password) return res.json({ error: 'You must provide a username and password.' });
//
//   try {
//     const user = await User.findOne({ 'local.username': username });
//     if (user) return res.send({ error: 'Username is not available.' });
//   } catch (err) {
//     return res.status(500).send({ error: 'Error retrieving user from database.' });
//   }
//
//   const newUser = new User({
//     local: {
//       username,
//       password,
//     }
//   });
//
//   try {
//     const savedUser = await newUser.save();
//     return res.status(201).send({
//       token: tokenForUser(savedUser),
//       user: savedUser
//     });
//   } catch (err) {
//     return res.status(500).send({ error: 'Error saving user to database.' });
//   }
// };
//
// export const signIn = (req, res) => res.send({ token: tokenForUser(req.user), user: req.user });

// Fetch user data for users already signed in
export const fetchUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Error retrieving user from database.' });
  }
};

export const editDisplayName = async (req, res) => {
  const { displayName } = req.body;
  try {
    await User.findByIdAndUpdate(req.user._id, { displayName }, { runValidators: true });
    res.status(200).send({ success: { displayName }});
  } catch (err) {
    console.log(err);
    if (err.errors.displayName) res.status(422).send({ error: err.errors.displayName.message });
    else res.status(500).send({ error: 'Display name could not be updated.' });
  }
};

export const editProfileImg = async (req, res) => {
  const { profileImg } = req.body;
  if (!validUrl.isUri(profileImg)) return res.status(422).send({ error: 'You must provide a valid URL.' });

  try {
    await User.findByIdAndUpdate(req.user._id, { profileImg });
    res.status(200).send({ success: { profileImg }});
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Profile image could not be updated.' });
  }
};
