import Joi from "joi";

const registerUserValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
  }),
  position: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one letter and one number",
    }),
  confirmpassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirmation password must match the password",
  }),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export { registerUserValidation, loginUserValidation };
