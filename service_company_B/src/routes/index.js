import express from "express";
import auth from "./auth.js";
import employe from "./employe.js";
import attendance from "./attendance.js";
const router = express.Router();

// list api
router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Welcome this is API Company B",
  });
});

export default () => {
  auth(router);
  employe(router);
  attendance(router);
  return router;
};
