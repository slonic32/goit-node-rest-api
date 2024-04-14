import { validateID } from "../helpers/validate.js";
import { getUserById } from "../services/authServices.js";
import { readToken } from "../services/jwtServices.js";

export async function auth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      res.status(401).json({
        message: "Not authorized",
      });
    }
    if (!req.headers.authorization.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Not authorized",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401).json({
        message: "Not authorized",
      });
    }
    const id = readToken(token);
    if (!validateID(id)) {
      res.status(401).json({
        message: "Not authorized",
      });
    }

    const user = await getUserById(id);
    if (user && user.token === token) {
      req.user = user;
      next();
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  } catch (error) {
    next(error);
  }
}
