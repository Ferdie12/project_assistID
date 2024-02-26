import axios from "axios";
import ResponseError from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import validation from "../validation/attendance-validation.js";
import dotenv from "dotenv";
dotenv.config();

const baseURL = process.env.BASE_URL_ABSEN;
const { COMPANY = "B" } = process.env;

const absenService = axios.create({
  baseURL: baseURL,
});

absenService.interceptors.response.use(
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

const insertAttendance = async (req) => {
  const result = await absenService.get("/attendance/insert", {
    headers: {
      Authorization: `Bearer ${COMPANY} ${
        req.headers.authorization.split(" ")[1]
      }`,
    },
  });
  if (!result) {
    throw new ResponseError(400, "error");
  }

  return result.data.message;
};

const insertPermission = async (req) => {
  const data = validate(validation.insertPermissionSchema, req.body);

  const result = await absenService.post("/attendance/permission", data, {
    headers: {
      Authorization: `Bearer ${COMPANY} ${
        req.headers.authorization.split(" ")[1]
      }`,
    },
  });

  return result.data.message;
};

const approvePermission = async (req) => {
  const { id } = req.params;
  const data = validate(validation.approvalPermission, req.body);
  const result = await absenService.put(`/attendance/approve/${id}`, data, {
    headers: {
      Authorization: `Bearer ${COMPANY} ${
        req.headers.authorization.split(" ")[1]
      }`,
    },
  });

  return result.data.message;
};

const deletePermission = async (req) => {
  const { id } = req.params;
  const result = await absenService.delete(`/attendance/approve/${id}`, {
    headers: {
      Authorization: `Bearer ${COMPANY} ${
        req.headers.authorization.split(" ")[1]
      }`,
    },
  });

  return result.data.message;
};

const getAllPendingPermission = async (req) => {
  const { type } = req.query;
  const result = await absenService.get(`/attendance/permission?type=${type}`, {
    headers: {
      Authorization: `Bearer ${COMPANY} ${
        req.headers.authorization.split(" ")[1]
      }`,
    },
  });

  return result.data.data;
};

const getAllPermissionForUser = async (req) => {
  const { type } = req.query;
  const result = await absenService.get(
    `/attendance/permission/one?type=${type}`,
    {
      headers: {
        Authorization: `Bearer ${COMPANY} ${
          req.headers.authorization.split(" ")[1]
        }`,
      },
    }
  );

  return result.data.data;
};

const generateReportAll = async (req) => {
  const data = validate(validation.generateReportSchema, req.body);
  const result = await absenService.post("/attendance/report", data, {
    headers: {
      Authorization: `Bearer ${COMPANY} ${
        req.headers.authorization.split(" ")[1]
      }`,
    },
  });

  return result.data.data;
};

const generateReportForUser = async (req) => {
  const result = await absenService.post("/attendance/report/one", req.body, {
    headers: {
      Authorization: `Bearer ${COMPANY} ${
        req.headers.authorization.split(" ")[1]
      }`,
    },
  });

  return result.data.data;
};

export default {
  insertAttendance,
  insertPermission,
  approvePermission,
  getAllPendingPermission,
  generateReportAll,
  generateReportForUser,
  getAllPermissionForUser,
  deletePermission,
};
