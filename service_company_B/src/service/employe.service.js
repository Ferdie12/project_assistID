import { UserModel } from "../models/user-schema.js";
import ResponseError from "../error/response-error.js";

const getById = async (id) => {
  if (!id) {
    throw new ResponseError(400, "employee ID cannot be empty");
  }
  const employee = await UserModel.findOne({ _id: id }).select("+company");
  if (!employee)
    throw new ResponseError(404, `employee with ID ${id} not found`);

  return employee;
};

export default { getById };
