const jwt = require('jsonwebtoken');
const oAuth2Client = require('../config/googleAuth');
const User = require('../models/User');
const { domainCheck } = require('../middlewares/domainCheck');

const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    // Verify the Google ID token
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Validate domain
    if (!domainCheck(email)) {
      return res.status(403).json({ message: 'Only MITS Gwalior students can access this platform.' });
    }

    // Check if user exists, else create
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        profileImage: picture,
      });
    } else {
      // Update profile picture if it changed
      user.profileImage = picture;
      await user.save();
    }

    // Create JWT
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  googleLogin,
};
