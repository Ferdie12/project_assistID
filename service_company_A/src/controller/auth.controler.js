import authService from "../service/auth.service.js";

export default class Auth {
  static register = async (req, res, next) => {
    try {
      await authService.register(req.body);
      return res.status(200).json({
        status: true,
        message: "register succes",
      });
    } catch (e) {
      next(e);
    }
  };

  static login = async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json({
        status: true,
        message: "login succes",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
}
