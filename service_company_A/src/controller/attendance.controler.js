import attendanceService from "../service/attendance.service.js";

export default class AttendanceController {
  static insertAttendance = async (req, res, next) => {
    try {
      const result = await attendanceService.insertAttendance(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static insertPermission = async (req, res, next) => {
    try {
      const result = await attendanceService.insertPermission(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllPendingPermission = async (req, res, next) => {
    try {
      const result = await attendanceService.getAllPendingPermission(req);
      return res.status(200).json({
        status: true,
        message: "succes get pending permission",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllPermissionForUser = async (req, res, next) => {
    try {
      const result = await attendanceService.getAllPermissionForUser(req);
      return res.status(200).json({
        status: true,
        message: "succes get pending permission",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static approvePermission = async (req, res, next) => {
    try {
      const result = await attendanceService.approvePermission(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static deletePermission = async (req, res, next) => {
    try {
      const result = await attendanceService.deletePermission(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static generateReportAll = async (req, res, next) => {
    try {
      const result = await attendanceService.generateReportAll(req);
      return res.status(200).json({
        status: true,
        message: "Report generated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static generateReportForUser = async (req, res, next) => {
    try {
      const result = await attendanceService.generateReportForUser(req);
      return res.status(200).json({
        status: true,
        message: "Report generated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
