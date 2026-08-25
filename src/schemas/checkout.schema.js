import * as yup from "yup";

export const checkoutSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Họ và tên không được để trống")
    .max(100, "Họ và tên không được vượt quá 100 ký tự"),
  phone: yup
    .string()
    .trim()
    .required("Số điện thoại không được để trống")
    .matches(/^[0-9+() .-]{8,20}$/, "Số điện thoại không hợp lệ"),
  deliveryAddress: yup
    .string()
    .trim()
    .required("Địa chỉ giao hàng không được để trống")
    .max(255, "Địa chỉ giao hàng không được vượt quá 255 ký tự"),
  note: yup.string().trim().max(500, "Ghi chú không được vượt quá 500 ký tự"),
  deliveryId: yup
    .number()
    .required("Vui lòng chọn hình thức giao hàng")
    .typeError("Vui lòng chọn hình thức giao hàng"),
  paymentId: yup
    .number()
    .required("Vui lòng chọn phương thức thanh toán")
    .typeError("Vui lòng chọn phương thức thanh toán"),
});
