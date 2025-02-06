const authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: '   you dont have access for this   ' });
      }
      next();
    };
  };
  
  module.exports = { authorize };
  