import Joi from "joi";

const insertPermissionSchema = Joi.object({
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  reason: Joi.string().required(),
  permissionType: Joi.string().valid("izin", "cuti").required(),
});

const approvalPermission = Joi.object({
  approval: Joi.string().valid("approved", "rejected").required(),
});

// Schema for generating report for all users
const generateReportSchema = Joi.object({
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
});

export default {
  insertPermissionSchema,
  approvalPermission,
  generateReportSchema,
};
