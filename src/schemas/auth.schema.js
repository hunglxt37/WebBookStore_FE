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

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .required("Họ và tên không được để trống"),

  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),

  phone: yup
    .string()
    .required("Số điện thoại không được để trống")
    .matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không đúng định dạng (VD: 0912345678)"),

  username: yup
    .string()
    .required("Tên đăng nhập không được để trống")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(20, "Tên đăng nhập tối đa 20 ký tự"),

  password: yup
    .string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),

  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận lại mật khẩu")
    .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),

  gender: yup.string().nullable(),
  dob: yup.string().nullable(),
});
