import AttendanceController from "../controller/attendance.controler.js";
import Middleware from "../middleware/auth-middleware.js";

export default (router) => {
  router.get(
    "/attendance/insert",
    Middleware.authMiddleware,
    AttendanceController.insertAttendance
  );
  router.post(
    "/attendance/permission",
    Middleware.authMiddleware,
    AttendanceController.insertPermission
  );
  router.get(
    "/attendance/permission",
    Middleware.authMiddleware,
    AttendanceController.getAllPendingPermissions
  );
  router.get(
    "/attendance/permission/one",
    Middleware.authMiddleware,
    AttendanceController.getAllPermissionForUser
  );
  router.put(
    "/attendance/approve/:id",
    Middleware.authMiddleware,
    AttendanceController.approvePermission
  );
  router.delete(
    "/attendance/approve/:id",
    Middleware.authMiddleware,
    AttendanceController.deletePermission
  );
  router.post(
    "/attendance/report",
    Middleware.authMiddleware,
    AttendanceController.generateReportAll
  );
  router.post(
    "/attendance/report/one",
    Middleware.authMiddleware,
    AttendanceController.generateReportForUser
  );
};
