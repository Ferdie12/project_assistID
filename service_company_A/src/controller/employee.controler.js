import employeService from "../service/employe.service.js";

export default class Employee {
  static getById = async (req, res, next) => {
    try {
      const result = await employeService.getById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "succes get data employee",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
