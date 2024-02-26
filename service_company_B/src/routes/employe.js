import Employee from "../controller/employee.controler.js";

// api user
export default (router) => {
  router.get("/employee/:id", Employee.getById);
};
