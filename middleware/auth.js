const supabase = require("../config/supabase");

async function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user)
    return res.status(401).json({ error: "Invalid token" });

  req.user = data.user;
  next();
}

module.exports = authenticate;
