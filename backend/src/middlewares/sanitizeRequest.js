export const sanitizeRequest = (req, res, next) => {
  if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
  if (req.body.username) req.body.username = req.body.username.trim();

  if (req.query.email) req.query.email = req.query.email.trim().toLowerCase();

  if (req.body.otp) req.body.otp = req.body.otp.trim();

  console.log(req.query);

  next();
};
