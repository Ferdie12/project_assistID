import express from "express";
import attendance from "./attendance.js";
const router = express.Router();

// list api
router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Welcome this is API Absensi",
  });
});

export default () => {
  attendance(router);
  return router;
};
