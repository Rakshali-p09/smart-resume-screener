const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  try {

    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        message: "Authentication required"
      });

    }


    // Expected format:
    // Bearer TOKEN

    const token = authHeader.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        message: "Token not provided"
      });

    }


    // Verify token

    const decoded = jwt.verify(
      token,
      "smart_resume_secret_key"
    );


    // Store user information in request

    req.user = decoded;


    console.log(
      "Authenticated user:",
      req.user.userId
    );


    next();

  } catch (error) {

    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }

};

module.exports = authMiddleware;