export const sanitizeRequest = (req, res, next) => {
  if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
  if (req.body.fullname) req.body.fullname = req.body.fullname.trim();
  next();
};
