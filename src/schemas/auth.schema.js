import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),

  password: yup
    .string()
    .required("Password không được để trống")
    .min(5, "Ít nhất 5 ký tự"),
});
