import { API } from "./"

export const getUsers = (payload, token) => {
  return API.get(`api/v1/users/${payload}`, token)
}

export const getUserById = (id, token) => {
  return API.get(`api/v1/users/${id}/`, token)
}

export const getNotifications = token => {
  return API.get("api/v1/notifications/", token)
}

export const createNotifications = (payload, token) => {
  return API.post("api/v1/notifications/broadcast/", payload, token)
}

export const updateUser = (id, payload, token) => {
  return API.patch(`api/v1/users/${id}/`, payload, token)
}

export const getFeedbacks = token => {
  return API.get("api/v1/feedback/", token)
}

export const getCategories = token => {
  return API.get("api/v1/categories/", token)
}

export const getBrands = token => {
  return API.get("api/v1/brands/", token)
}

export const getAdminProducts = (payload, token) => {
  return API.get(`api/v1/products/${payload}`, token)
}

export const getAdminProduct = (id, token) => {
  return API.get(`api/v1/products/${id}/`, token)
}

export const sendFeedbackResponse = (payload, token) => {
  return API.post("api/v1/feedback/respond/", payload, token)
}

export const createProduct = (payload, token) => {
  return API.post("api/v1/products/", payload, token)
}

export const updateProduct = (id, payload, token) => {
  return API.patch(`api/v1/products/${id}/`, payload, token)
}

export const deleteProduct = (id, token) => {
  return API.delete(`api/v1/products/${id}/`, {}, token)
}

export const getAdminOrders = (payload, token) => {
  return API.get(`api/v1/admin/orders/list_product_orders/${payload}`, token)
}

export const getUserOrders = (payload, token) => {
  return API.get(`api/v1/orders/${payload}`, token)
}

export const getAdminConfirmOrders = (payload, token) => {
  return API.get(`api/v1/admin/confirmed-orders/${payload}`, token)
}

export const getOrderDetails = (id, token) => {
  return API.get(`api/v1/orders/${id}/`, token)
}

export const getOrderDetailsList = (payload, token, isReserved) => {
  if (isReserved) {
    return API.get(
      `api/v1/admin/orders/invoice_list/${payload}&reservation=${isReserved}`,
      token
    )
  } else {
    return API.get(`api/v1/admin/orders/invoice_list/${payload}`, token)
  }
}

export const updateOrder = (id, payload, token) => {
  return API.patch(`api/v1/orders/${id}/`, payload, token)
}

export const markAsConfirmOrder = (payload, token) => {
  return API.get(`api/v1/admin/orders/confirm/${payload}`, token)
}

export const markAsProcessOrder = (payload, token) => {
  return API.get(`api/v1/admin/orders/processing/${payload}`, token)
}

export const generateInvoice = (payload, token) => {
  return API.get(`api/v1/admin/orders/generate_invoice/${payload}`, token)
}

export const sendInvoice = (payload, token) => {
  return API.get(`api/v1/admin/orders/submit_invoice/${payload}`, token)
}

export const getInvoiceDetails = (id, token) => {
  return API.get(`api/v1/admin/invoices/${id}/`, token)
}

export const updateInvoice = (id, payload, token) => {
  return API.patch(`api/v1/admin/invoices/${id}/`, payload, token)
}

export const getInvoices = (payload, token) => {
  return API.get(`api/v1/admin/invoices/${payload}`, token)
}

export const getColors = token => {
  return API.get("api/v1/colors/", token)
}

export const getSizes = token => {
  return API.get("api/v1/sizes/", token)
}

export const deleteProductImage = (payload, token) => {
  return API.delete("api/v1/products/remove_image/", payload, token)
}

export const getReservedHp = (token, dateString) => {
  return dateString
    ? API.get(
        `api/v1/admin/orders/list_reservation_pending_product_orders/?half_pack=true&reservation_pending=true${dateString}`,
        token
      )
    : API.get(
        `api/v1/admin/orders/list_reservation_pending_product_orders/?half_pack=true&reservation_pending=true`,
        token
      )
}

export const getReservedg = (token, dateString) => {
  return dateString
    ? API.get(
        `api/v1/admin/orders/list_reservation_pending_product_orders/?half_pack=false&reservation_pending=true${dateString}`,
        token
      )
    : API.get(
        `api/v1/admin/orders/list_reservation_pending_product_orders/?half_pack=false&reservation_pending=true`,
        token
      )
}

export const approveReservationsAPI = (payload, token) => {
  return API.post(
    "api/v1/admin/orders/approve_pending_reservation/",
    payload,
    token
  )
}

export const cancelReservations = (payload, token) => {
  return API.post(
    "api/v1/admin/orders/cancel_pending_reservation/",
    payload,
    token
  )
}
