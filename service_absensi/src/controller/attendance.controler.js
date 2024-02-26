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

  static getAllPendingPermissions = async (req, res, next) => {
    try {
      const result = await attendanceService.getAllPendingPermissions(req);
      return res.status(200).json({
        status: true,
        message:
          "Berhasil mendapatkan permohonan pegawai yang masih menunggu persetujuan",
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
        message: "Berhasil mendapatkan semua data permohonan",
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
        message: "Berhasil mendapatkan laporan kehadiran semua pegawai",
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
        message: "Berhasil mendapatkan laporan kehadiran",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
