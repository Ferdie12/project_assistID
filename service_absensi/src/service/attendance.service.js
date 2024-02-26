import ResponseError from "../error/response-error.js";
import { attendanceModel } from "../models/attendance-schema.js";
import { permissionModel } from "../models/permission-schema.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const companyURL = {
  A: process.env.BASE_URL_COMPANY_A,
  B: process.env.BASE_URL_COMPANY_B,
};

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle Axios error here
    if (error.response.statusText && !error.response.data.errors) {
      throw new ResponseError(error.response.status, error.response.statusText);
    } else {
      throw new ResponseError(
        error.response.status,
        error.response.data.errors
      );
    }
  }
);

const insertAttendance = async (request) => {
  const { id, company } = request.user;
  const checkUser = await axios.get(`${companyURL[company]}/employee/${id}`);

  if (!checkUser.data) {
    throw new ResponseError(400, "gagal melakukan absen");
  }

  const data = checkUser.data.data;
  const now = new Date();
  let activityType = "hadir";
  let approval = "approved";

  if (now.getHours() < 6) {
    throw new ResponseError(
      400,
      "Absen hanya dapat dilakukan mulai dari jam 6 pagi"
    );
  }

  const lastAttendance = await attendanceModel.findOne(
    {
      "employee._id": data._id,
      activityType: { $nin: ["izin", "cuti"] },
    },
    {},
    { sort: { date: -1 } }
  );

  if (lastAttendance) {
    if (lastAttendance.date.toDateString() >= now.toDateString()) {
      throw new ResponseError(400, "Absen sudah dilakukan hari ini");
    }
    const lastAttendanceDate = new Date(lastAttendance.date);
    const startDate = new Date(
      lastAttendanceDate.getTime() + 24 * 60 * 60 * 1000
    );
    const endDate = new Date(now.toDateString());

    const leaveOrPermissions = await attendanceModel.find({
      "employee._id": data._id,
      date: { $gte: startDate, $lt: endDate },
      activityType: { $in: ["izin", "cuti"] },
    });

    const daysMissed = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const isLeaveOrPermission = leaveOrPermissions.some(
        (item) => item.date.toDateString() === date.toDateString()
      );
      if (!isLeaveOrPermission) {
        daysMissed.push({
          date: new Date(date),
          activityType: "tidak_masuk",
          approval,
          employee: {
            _id: data._id,
            name: data.name,
            position: data.position,
            company: data.company,
          },
        });
      }
    }

    if (daysMissed.length > 0) {
      await attendanceModel.insertMany(daysMissed);
    }
  }

  if (now.getHours() >= 12) {
    activityType = "tidak_masuk";
  } else if (now.getHours() >= 8) {
    activityType = "telat";
  }

  await attendanceModel.create({
    date: now,
    activityType,
    approval,
    employee: {
      _id: data._id,
      name: data.name,
      position: data.position,
      company: data.company,
    },
  });

  return activityType === "tidak_masuk"
    ? "absen telah melebihi batas waktu"
    : activityType === "telat"
    ? "absen anda telat"
    : "absen anda sukses";
};

const insertPermission = async (request) => {
  const { id, company } = request.user;
  const { start_date, end_date, reason, permissionType } = request.body;

  const checkUser = await axios.get(`${companyURL[company]}/employee/${id}`);

  if (!checkUser.data) {
    throw new ResponseError(400, "Gagal memuat permohonan");
  }

  const data = checkUser.data.data;

  const now = new Date();
  if (now.getHours() >= 9 || now.getHours() < 6) {
    throw new ResponseError(
      400,
      "Permohonan hanya dapat dilakukan mulai dari jam 6 pagi sampai jam 9 pagi"
    );
  }

  if (new Date(end_date) < new Date(start_date)) {
    throw new ResponseError(
      400,
      "Tanggal pengajuan terakhir tidak boleh sebelum tanggal pengajuan pertama"
    );
  }

  const durationInDays =
    Math.ceil(
      (new Date(end_date).getTime() - new Date(start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  if (permissionType === "izin" && durationInDays > 3) {
    throw new ResponseError(
      400,
      "Permohonan izin tidak bisa lewat dari 3 hari"
    );
  }

  if (permissionType === "cuti" && durationInDays > 7) {
    throw new ResponseError(
      400,
      "Permohonan cuti tidak bisa lewat dari 7 hari"
    );
  }

  // Periksa apakah ada izin yang sudah diajukan pada rentang tanggal yang sama
  const existingPermission = await permissionModel.findOne({
    "employee._id": data._id,
    permissionType,
    start_date: { $lte: new Date(end_date) },
    end_date: { $gte: new Date(start_date) },
  });

  if (existingPermission) {
    throw new ResponseError(
      400,
      "Permohonan izin telah diajukan pada rentang tanggal yang sama"
    );
  }

  const permissionData = {
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    permissionType,
    reason,
    approval: "pending",
    employee: {
      _id: data._id,
      name: data.name,
      position: data.position,
      company: data.company,
    },
  };

  await permissionModel.create(permissionData);

  return "Sukses membuat permohonan";
};

const getAllPendingPermissions = async (request) => {
  console.log(request.query.type);
  const pendingPermissions = await permissionModel.find(
    {
      approval: "pending",
      "employee.company": request.user.company,
      permissionType: request.query.type,
    },
    {
      "employee.name": 1,
      "employee.position": 1,
      start_date: 1,
      end_date: 1,
      reason: 1,
      _id: 1,
    }
  );

  return pendingPermissions;
};

const getAllPermissionForUser = async (request) => {
  const { id, company } = request.user;
  const checkUser = await axios.get(`${companyURL[company]}/employee/${id}`);

  if (!checkUser.data) {
    throw new ResponseError(400, "gagal mendapatkan data permohonan");
  }

  // Temukan semua izin yang terkait dengan user berdasarkan ID pengguna
  const userPermissions = await permissionModel.find(
    {
      "employee._id": id,
      permissionType: request.query.type,
    },
    {
      start_date: 1,
      end_date: 1,
      reason: 1,
      permissionType: 1,
      approval: 1,
    }
  );

  return userPermissions;
};

const approvePermission = async (request) => {
  const { id } = request.params;
  const { approval } = request.body;
  const permission = await permissionModel.findById(id);

  if (!permission) {
    throw new ResponseError(404, "Permohonan tidak ditemukan");
  }

  if (
    permission.approval === "approved" ||
    permission.approval === "rejected"
  ) {
    throw new ResponseError(400, "Permohonan sudah di approve");
  }

  const attendanceData = await attendanceModel.find({
    activityType: { $nin: ["izin", "cuti"] },
    date: { $gte: permission.start_date, $lte: permission.end_date },
  });

  if (attendanceData.length > 0) {
    if (attendanceData.length === 1) {
      await attendanceModel.deleteOne({
        _id: attendanceData[0]._id,
      });
    } else {
      await attendanceModel.deleteMany({
        activityType: { $nin: ["izin", "cuti"] },
        date: { $gte: permission.start_date, $lte: permission.end_date },
      });
    }
  }

  if (
    permission.start_date.toDateString() === permission.end_date.toDateString()
  ) {
    await attendanceModel.create({
      group: id,
      date: permission.start_date,
      activityType: permission.permissionType,
      approval,
      employee: permission.employee,
    });
  } else {
    const durationInDays =
      Math.ceil(
        (permission.end_date.getTime() - permission.start_date.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const attendanceArray = Array.from({ length: durationInDays }, (_, i) => ({
      group: id,
      date: new Date(permission.start_date.getTime() + i * 24 * 60 * 60 * 1000),
      activityType: permission.permissionType,
      approval,
      employee: permission.employee,
    }));

    await attendanceModel.insertMany(attendanceArray);
  }

  await permissionModel.findByIdAndUpdate(id, {
    approval,
  });

  return "Sukses mengaprove permohonan pegawai";
};

const deletePermission = async (request) => {
  const { id } = request.params;
  const { id_user, company } = request.user;
  const checkUser = await axios.get(
    `${companyURL[company]}/employee/${id_user}`
  );

  if (!checkUser.data) {
    throw new ResponseError(400, "gagal melakukan absen");
  }

  const permission = await permissionModel.findById(id);

  if (!permission) {
    throw new ResponseError(404, "Permohonan tidak ditemukan");
  }

  if (permission.employee._id !== checkUser.data.data._id) {
    throw new ResponseError(
      404,
      "tidak bisa menghapus selai permohonan anda sendiri"
    );
  }
  await permissionModel.findByIdAndDelete(id);

  return "Permohonan sukses dihapus";
};

const generateReportAll = async (request) => {
  const { start_date, end_date } = request.body;
  const start = new Date(start_date);
  const end = new Date(end_date);

  const attendanceRecords = await attendanceModel.find({
    date: { $gte: start, $lte: end },
    "employee.company": request.user.company,
  });

  const employeeAttendance = [];

  for (const record of attendanceRecords) {
    const { name, position } = record.employee;

    const permissions = await permissionModel.find({
      "employee._id": record.employee._id,
      start_date: { $lte: record.date },
      end_date: { $gte: record.date },
    });

    let employeeData = employeeAttendance.find((emp) => emp.name === name);
    if (!employeeData) {
      employeeData = {
        name,
        position,
        hadir: 0,
        telat: 0,
        izin: { acc: 0, tidak_acc: 0 },
        tidak_masuk: 0,
        cuti: { acc: 0, tidak_acc: 0 },
      };
      employeeAttendance.push(employeeData);
    }

    switch (record.activityType) {
      case "hadir":
        employeeData.hadir++;
        break;
      case "telat":
        employeeData.telat++;
        break;
      case "izin":
        permissions.forEach((permission) => {
          if (permission.approval === "approved") {
            employeeData.izin.acc++;
          } else if (permission.approval === "rejected") {
            if (
              permission.start_date.getTime() >= start.getTime() &&
              permission.end_date.getTime() <= end.getTime()
            ) {
              employeeData.izin.tidak_acc++;
            }
          }
        });
        break;
      case "tidak_masuk":
        employeeData.tidak_masuk++;
        break;
      case "cuti":
        permissions.forEach((permission) => {
          if (permission.approval === "approved") {
            employeeData.cuti.acc++;
          } else if (permission.approval === "rejected") {
            if (
              permission.start_date.getTime() >= start.getTime() &&
              permission.end_date.getTime() <= end.getTime()
            ) {
              employeeData.cuti.tidak_acc++;
            }
          }
        });
        break;
      default:
        break;
    }
  }

  return employeeAttendance;
};

const generateReportForUser = async (request) => {
  const { start_date, end_date } = request.body;
  const start = new Date(start_date);
  const end = new Date(end_date);

  const { id, company } = request.user;
  const checkUser = await axios.get(`${companyURL[company]}/employee/${id}`);

  if (!checkUser.data) {
    throw new ResponseError(400, "gagal melakukan absen");
  }

  const attendanceRecords = await attendanceModel.find({
    date: { $gte: start, $lte: end },
    "employee._id": id,
  });

  const employeeAttendance = {
    hadir: 0,
    telat: 0,
    izin: { acc: 0, tidak_acc: 0 },
    tidak_masuk: 0,
    cuti: { acc: 0, tidak_acc: 0 },
  };

  for (const record of attendanceRecords) {
    const { activityType } = record;
    switch (activityType) {
      case "hadir":
        employeeAttendance.hadir++;
        break;
      case "telat":
        employeeAttendance.telat++;
        break;
      case "izin":
        const permissions = await permissionModel.find({
          "employee._id": id,
          start_date: { $lte: record.date },
          end_date: { $gte: record.date },
        });
        permissions.forEach((permission) => {
          if (permission.approval === "approved") {
            employeeAttendance.izin.acc++;
          } else if (permission.approval === "rejected") {
            if (
              permission.start_date.getTime() >= start.getTime() &&
              permission.end_date.getTime() <= end.getTime()
            ) {
              employeeAttendance.izin.tidak_acc++;
            }
          }
        });
        break;
      case "tidak_masuk":
        employeeAttendance.tidak_masuk++;
        break;
      case "cuti":
        const permissionsCuti = await permissionModel.find({
          "employee._id": id,
          start_date: { $lte: record.date },
          end_date: { $gte: record.date },
        });
        permissionsCuti.forEach((permission) => {
          if (permission.approval === "approved") {
            employeeAttendance.cuti.acc++;
          } else if (permission.approval === "rejected") {
            if (
              permission.start_date.getTime() >= start.getTime() &&
              permission.end_date.getTime() <= end.getTime()
            ) {
              employeeAttendance.cuti.tidak_acc++;
            }
          }
        });
        break;
      default:
        break;
    }
  }

  return employeeAttendance;
};

export default {
  insertAttendance,
  insertPermission,
  getAllPendingPermissions,
  approvePermission,
  generateReportAll,
  generateReportForUser,
  getAllPermissionForUser,
  deletePermission,
};
