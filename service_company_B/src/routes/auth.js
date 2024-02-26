import Auth from "../controller/auth.controler.js";

// api user
export default (router) => {
  router.post("/auth/register", Auth.register);
  router.post("/auth/login", Auth.login);
};
