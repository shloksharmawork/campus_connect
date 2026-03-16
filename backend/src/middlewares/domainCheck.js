const domainCheck = (email) => {
  // Assuming the user's email was passed from Google OAuth
  if (!email || !email.endsWith('@mitsgwl.ac.in')) {
    return false;
  }
  return true;
};

const requireDomainMiddleware = (req, res, next) => {
  // This can be used if we need to enforce domain checks on routes beyond login
  if (req.user && req.user.email && req.user.email.endsWith('@mitsgwl.ac.in')) {
    next();
  } else {
    res.status(403).json({ message: 'Only MITS Gwalior students can access this platform.' });
  }
}

module.exports = { domainCheck, requireDomainMiddleware };
