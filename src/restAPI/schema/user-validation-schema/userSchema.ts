import Joi from "joi";

export const userValidatorsSchema = Joi.object({
  // COMMON FO ALL USERS
  firstName: Joi.string().min(3).max(80),
  lastName: Joi.string().min(3).max(80),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  createdByRole: Joi.string().required(),
  createdById: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
  role: Joi.string()
    .valid("superadmin", "admin", "projectincharge", "student")
    .required(),

  // EXTRA FIELDS CORRESPONDING TO ROLE
  department_id: Joi.when("role", {
    is: Joi.string().valid("admin", "projectincharge", "student"),
    then: Joi.number().required(),
    otherwise: Joi.forbidden(), // Disallowed for other roles if superadmn send dep.id it will throw error
  }),
});
