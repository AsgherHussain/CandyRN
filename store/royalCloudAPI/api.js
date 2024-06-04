import axios from "axios"
const royalCloudAPI = axios.create({
  baseURL: "https://royal-cloud-33498.botics.co",
  headers: { Accept: "application/json", "Content-Type": "application/json" }
})
function api_v1_admin_confirmed_orders_list(payload) {
  return royalCloudAPI.get(`/api/v1/admin/confirmed-orders/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_admin_confirmed_orders_create(payload) {
  return royalCloudAPI.post(`/api/v1/admin/confirmed-orders/`, payload)
}
function api_v1_admin_confirmed_orders_read(payload) {
  return royalCloudAPI.get(`/api/v1/admin/confirmed-orders/${payload.id}/`)
}
function api_v1_admin_confirmed_orders_update(payload) {
  return royalCloudAPI.put(
    `/api/v1/admin/confirmed-orders/${payload.id}/`,
    payload
  )
}
function api_v1_admin_confirmed_orders_partial_update(payload) {
  return royalCloudAPI.patch(
    `/api/v1/admin/confirmed-orders/${payload.id}/`,
    payload
  )
}
function api_v1_admin_confirmed_orders_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/admin/confirmed-orders/${payload.id}/`)
}
function api_v1_admin_invoices_list(payload) {
  return royalCloudAPI.get(`/api/v1/admin/invoices/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_admin_invoices_create(payload) {
  return royalCloudAPI.post(`/api/v1/admin/invoices/`, payload)
}
function api_v1_admin_invoices_read(payload) {
  return royalCloudAPI.get(`/api/v1/admin/invoices/${payload.id}/`)
}
function api_v1_admin_invoices_update(payload) {
  return royalCloudAPI.put(`/api/v1/admin/invoices/${payload.id}/`, payload)
}
function api_v1_admin_invoices_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/admin/invoices/${payload.id}/`, payload)
}
function api_v1_admin_invoices_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/admin/invoices/${payload.id}/`)
}
function api_v1_admin_orders_list(payload) {
  return royalCloudAPI.get(`/api/v1/admin/orders/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_admin_orders_create(payload) {
  return royalCloudAPI.post(`/api/v1/admin/orders/`, payload)
}
function api_v1_admin_orders_approve_pending_reservation(payload) {
  return royalCloudAPI.post(
    `/api/v1/admin/orders/approve_pending_reservation/`,
    payload
  )
}
function api_v1_admin_orders_cancel_pending_reservation(payload) {
  return royalCloudAPI.post(
    `/api/v1/admin/orders/cancel_pending_reservation/`,
    payload
  )
}
function api_v1_admin_orders_confirm(payload) {
  return royalCloudAPI.get(`/api/v1/admin/orders/confirm/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_admin_orders_generate_invoice(payload) {
  return royalCloudAPI.get(`/api/v1/admin/orders/generate_invoice/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_admin_orders_invoice_list(payload) {
  return royalCloudAPI.get(`/api/v1/admin/orders/invoice_list/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_admin_orders_list_product_orders(payload) {
  return royalCloudAPI.get(`/api/v1/admin/orders/list_product_orders/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_admin_orders_list_reservation_pending_product_orders(payload) {
  return royalCloudAPI.get(
    `/api/v1/admin/orders/list_reservation_pending_product_orders/`,
    { params: { l: payload.l, o: payload.o } }
  )
}
function api_v1_admin_orders_processing(payload) {
  return royalCloudAPI.get(`/api/v1/admin/orders/processing/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_admin_orders_submit_invoice(payload) {
  return royalCloudAPI.get(`/api/v1/admin/orders/submit_invoice/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_admin_orders_read(payload) {
  return royalCloudAPI.get(`/api/v1/admin/orders/${payload.id}/`)
}
function api_v1_admin_orders_update(payload) {
  return royalCloudAPI.put(`/api/v1/admin/orders/${payload.id}/`, payload)
}
function api_v1_admin_orders_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/admin/orders/${payload.id}/`, payload)
}
function api_v1_admin_orders_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/admin/orders/${payload.id}/`)
}
function api_v1_assigned_user_list(payload) {
  return royalCloudAPI.get(`/api/v1/assigned_user/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_assigned_user_create(payload) {
  return royalCloudAPI.post(`/api/v1/assigned_user/`, payload)
}
function api_v1_assigned_user_get_unassigned_user(payload) {
  return royalCloudAPI.get(`/api/v1/assigned_user/get_unassigned_user/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_assigned_user_read(payload) {
  return royalCloudAPI.get(`/api/v1/assigned_user/${payload.id}/`)
}
function api_v1_assigned_user_update(payload) {
  return royalCloudAPI.put(`/api/v1/assigned_user/${payload.id}/`, payload)
}
function api_v1_assigned_user_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/assigned_user/${payload.id}/`, payload)
}
function api_v1_assigned_user_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/assigned_user/${payload.id}/`)
}
function api_v1_brands_list(payload) {
  return royalCloudAPI.get(`/api/v1/brands/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_brands_create(payload) {
  return royalCloudAPI.post(`/api/v1/brands/`, payload)
}
function api_v1_brands_read(payload) {
  return royalCloudAPI.get(`/api/v1/brands/${payload.id}/`)
}
function api_v1_brands_update(payload) {
  return royalCloudAPI.put(`/api/v1/brands/${payload.id}/`, payload)
}
function api_v1_brands_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/brands/${payload.id}/`, payload)
}
function api_v1_brands_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/brands/${payload.id}/`)
}
function api_v1_broadcasts_list(payload) {
  return royalCloudAPI.get(`/api/v1/broadcasts/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_broadcasts_create(payload) {
  return royalCloudAPI.post(`/api/v1/broadcasts/`, payload)
}
function api_v1_broadcasts_read(payload) {
  return royalCloudAPI.get(`/api/v1/broadcasts/${payload.id}/`)
}
function api_v1_broadcasts_update(payload) {
  return royalCloudAPI.put(`/api/v1/broadcasts/${payload.id}/`, payload)
}
function api_v1_broadcasts_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/broadcasts/${payload.id}/`, payload)
}
function api_v1_broadcasts_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/broadcasts/${payload.id}/`)
}
function api_v1_cart_list(payload) {
  return royalCloudAPI.get(`/api/v1/cart/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_cart_create(payload) {
  return royalCloudAPI.post(`/api/v1/cart/`, payload)
}
function api_v1_cart_cancel_order(payload) {
  return royalCloudAPI.get(`/api/v1/cart/cancel_order/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_cart_clear(payload) {
  return royalCloudAPI.get(`/api/v1/cart/clear/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_cart_remove_item(payload) {
  return royalCloudAPI.delete(`/api/v1/cart/remove_item/`)
}
function api_v1_cart_submit(payload) {
  return royalCloudAPI.get(`/api/v1/cart/submit/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_cart_read(payload) {
  return royalCloudAPI.get(`/api/v1/cart/${payload.id}/`)
}
function api_v1_cart_update(payload) {
  return royalCloudAPI.put(`/api/v1/cart/${payload.id}/`, payload)
}
function api_v1_cart_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/cart/${payload.id}/`, payload)
}
function api_v1_cart_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/cart/${payload.id}/`)
}
function api_v1_categories_list(payload) {
  return royalCloudAPI.get(`/api/v1/categories/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_categories_create(payload) {
  return royalCloudAPI.post(`/api/v1/categories/`, payload)
}
function api_v1_categories_read(payload) {
  return royalCloudAPI.get(`/api/v1/categories/${payload.id}/`)
}
function api_v1_categories_update(payload) {
  return royalCloudAPI.put(`/api/v1/categories/${payload.id}/`, payload)
}
function api_v1_categories_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/categories/${payload.id}/`, payload)
}
function api_v1_categories_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/categories/${payload.id}/`)
}
function api_v1_colors_list(payload) {
  return royalCloudAPI.get(`/api/v1/colors/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_colors_create(payload) {
  return royalCloudAPI.post(`/api/v1/colors/`, payload)
}
function api_v1_colors_read(payload) {
  return royalCloudAPI.get(`/api/v1/colors/${payload.id}/`)
}
function api_v1_colors_update(payload) {
  return royalCloudAPI.put(`/api/v1/colors/${payload.id}/`, payload)
}
function api_v1_colors_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/colors/${payload.id}/`, payload)
}
function api_v1_colors_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/colors/${payload.id}/`)
}
function api_v1_feedback_list(payload) {
  return royalCloudAPI.get(`/api/v1/feedback/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_feedback_create(payload) {
  return royalCloudAPI.post(`/api/v1/feedback/`, payload)
}
function api_v1_feedback_respond(payload) {
  return royalCloudAPI.post(`/api/v1/feedback/respond/`, payload)
}
function api_v1_feedback_read(payload) {
  return royalCloudAPI.get(`/api/v1/feedback/${payload.id}/`)
}
function api_v1_feedback_update(payload) {
  return royalCloudAPI.put(`/api/v1/feedback/${payload.id}/`, payload)
}
function api_v1_feedback_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/feedback/${payload.id}/`, payload)
}
function api_v1_feedback_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/feedback/${payload.id}/`)
}
function api_v1_get_user_read(payload) {
  return royalCloudAPI.get(`/api/v1/get-user/${payload.id}/`)
}
function api_v1_login_create(payload) {
  return royalCloudAPI.post(`/api/v1/login/`)
}
function api_v1_notifications_list(payload) {
  return royalCloudAPI.get(`/api/v1/notifications/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_notifications_create(payload) {
  return royalCloudAPI.post(`/api/v1/notifications/`, payload)
}
function api_v1_notifications_broadcast(payload) {
  return royalCloudAPI.post(`/api/v1/notifications/broadcast/`, payload)
}
function api_v1_notifications_read_read(payload) {
  return royalCloudAPI.get(`/api/v1/notifications/read/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_notifications_read_create(payload) {
  return royalCloudAPI.post(`/api/v1/notifications/read/`, payload)
}
function api_v1_notifications_read(payload) {
  return royalCloudAPI.get(`/api/v1/notifications/${payload.id}/`)
}
function api_v1_notifications_update(payload) {
  return royalCloudAPI.put(`/api/v1/notifications/${payload.id}/`, payload)
}
function api_v1_notifications_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/notifications/${payload.id}/`, payload)
}
function api_v1_notifications_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/notifications/${payload.id}/`)
}
function api_v1_orders_list(payload) {
  return royalCloudAPI.get(`/api/v1/orders/`, {
    params: {
      user: payload.user,
      date: payload.date,
      product: payload.product,
      half_pack: payload.half_pack,
      status: payload.status,
      ordering: payload.ordering,
      l: payload.l,
      o: payload.o
    }
  })
}
function api_v1_orders_create(payload) {
  return royalCloudAPI.post(`/api/v1/orders/`, payload)
}
function api_v1_orders_calculate_total(payload) {
  return royalCloudAPI.get(`/api/v1/orders/calculate_total/`, {
    params: {
      user: payload.user,
      date: payload.date,
      product: payload.product,
      half_pack: payload.half_pack,
      status: payload.status,
      ordering: payload.ordering,
      l: payload.l,
      o: payload.o
    }
  })
}
function api_v1_orders_read(payload) {
  return royalCloudAPI.get(`/api/v1/orders/${payload.id}/`)
}
function api_v1_orders_update(payload) {
  return royalCloudAPI.put(`/api/v1/orders/${payload.id}/`, payload)
}
function api_v1_orders_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/orders/${payload.id}/`, payload)
}
function api_v1_orders_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/orders/${payload.id}/`)
}
function api_v1_products_list(payload) {
  return royalCloudAPI.get(`/api/v1/products/`, {
    params: {
      category: payload.category,
      half_pack_available: payload.half_pack_available,
      type: payload.type,
      brand: payload.brand,
      styles: payload.styles,
      min_date: payload.min_date,
      max_date: payload.max_date,
      min_price: payload.min_price,
      max_price: payload.max_price,
      l: payload.l,
      o: payload.o
    }
  })
}
function api_v1_products_create(payload) {
  return royalCloudAPI.post(`/api/v1/products/`, payload)
}
function api_v1_products_remove_image(payload) {
  return royalCloudAPI.delete(`/api/v1/products/remove_image/`)
}
function api_v1_products_read(payload) {
  return royalCloudAPI.get(`/api/v1/products/${payload.id}/`)
}
function api_v1_products_update(payload) {
  return royalCloudAPI.put(`/api/v1/products/${payload.id}/`, payload)
}
function api_v1_products_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/products/${payload.id}/`, payload)
}
function api_v1_products_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/products/${payload.id}/`)
}
function api_v1_sales_person_list(payload) {
  return royalCloudAPI.get(`/api/v1/sales_person/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_sales_person_create(payload) {
  return royalCloudAPI.post(`/api/v1/sales_person/`, payload)
}
function api_v1_sales_person_read(payload) {
  return royalCloudAPI.get(`/api/v1/sales_person/${payload.id}/`)
}
function api_v1_sales_person_update(payload) {
  return royalCloudAPI.put(`/api/v1/sales_person/${payload.id}/`, payload)
}
function api_v1_sales_person_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/sales_person/${payload.id}/`, payload)
}
function api_v1_sales_person_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/sales_person/${payload.id}/`)
}
function api_v1_signup_create(payload) {
  return royalCloudAPI.post(`/api/v1/signup/`, payload)
}
function api_v1_sizes_list(payload) {
  return royalCloudAPI.get(`/api/v1/sizes/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_sizes_create(payload) {
  return royalCloudAPI.post(`/api/v1/sizes/`, payload)
}
function api_v1_sizes_read(payload) {
  return royalCloudAPI.get(`/api/v1/sizes/${payload.id}/`)
}
function api_v1_sizes_update(payload) {
  return royalCloudAPI.put(`/api/v1/sizes/${payload.id}/`, payload)
}
function api_v1_sizes_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/sizes/${payload.id}/`, payload)
}
function api_v1_sizes_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/sizes/${payload.id}/`)
}
function api_v1_splash_screen_list(payload) {
  return royalCloudAPI.get(`/api/v1/splash-screen/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_splash_screen_create(payload) {
  return royalCloudAPI.post(`/api/v1/splash-screen/`, payload)
}
function api_v1_splash_screen_read(payload) {
  return royalCloudAPI.get(`/api/v1/splash-screen/${payload.id}/`)
}
function api_v1_test_user_create(payload) {
  return royalCloudAPI.post(`/api/v1/test-user`)
}
function api_v1_users_list(payload) {
  return royalCloudAPI.get(`/api/v1/users/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function api_v1_users_create(payload) {
  return royalCloudAPI.post(`/api/v1/users/`, payload)
}
function api_v1_users_admin(payload) {
  return royalCloudAPI.post(`/api/v1/users/admin/`, payload)
}
function api_v1_users_login(payload) {
  return royalCloudAPI.post(`/api/v1/users/login/`, payload)
}
function api_v1_users_logout(payload) {
  return royalCloudAPI.post(`/api/v1/users/logout/`, payload)
}
function api_v1_users_otp(payload) {
  return royalCloudAPI.post(`/api/v1/users/otp/`, payload)
}
function api_v1_users_password(payload) {
  return royalCloudAPI.post(`/api/v1/users/password/`, payload)
}
function api_v1_users_verify(payload) {
  return royalCloudAPI.post(`/api/v1/users/verify/`, payload)
}
function api_v1_users_read(payload) {
  return royalCloudAPI.get(`/api/v1/users/${payload.id}/`)
}
function api_v1_users_update(payload) {
  return royalCloudAPI.put(`/api/v1/users/${payload.id}/`, payload)
}
function api_v1_users_partial_update(payload) {
  return royalCloudAPI.patch(`/api/v1/users/${payload.id}/`, payload)
}
function api_v1_users_delete(payload) {
  return royalCloudAPI.delete(`/api/v1/users/${payload.id}/`)
}
function modules_privacy_policy_list(payload) {
  return royalCloudAPI.get(`/modules/privacy-policy/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function modules_privacy_policy_create(payload) {
  return royalCloudAPI.post(`/modules/privacy-policy/`, payload)
}
function modules_privacy_policy_read(payload) {
  return royalCloudAPI.get(`/modules/privacy-policy/${payload.id}/`)
}
function modules_privacy_policy_update(payload) {
  return royalCloudAPI.put(`/modules/privacy-policy/${payload.id}/`, payload)
}
function modules_privacy_policy_partial_update(payload) {
  return royalCloudAPI.patch(`/modules/privacy-policy/${payload.id}/`, payload)
}
function modules_privacy_policy_delete(payload) {
  return royalCloudAPI.delete(`/modules/privacy-policy/${payload.id}/`)
}
function modules_terms_and_conditions_list(payload) {
  return royalCloudAPI.get(`/modules/terms-and-conditions/`, {
    params: { l: payload.l, o: payload.o }
  })
}
function modules_terms_and_conditions_create(payload) {
  return royalCloudAPI.post(`/modules/terms-and-conditions/`, payload)
}
function modules_terms_and_conditions_read(payload) {
  return royalCloudAPI.get(`/modules/terms-and-conditions/${payload.id}/`)
}
function modules_terms_and_conditions_update(payload) {
  return royalCloudAPI.put(
    `/modules/terms-and-conditions/${payload.id}/`,
    payload
  )
}
function modules_terms_and_conditions_partial_update(payload) {
  return royalCloudAPI.patch(
    `/modules/terms-and-conditions/${payload.id}/`,
    payload
  )
}
function modules_terms_and_conditions_delete(payload) {
  return royalCloudAPI.delete(`/modules/terms-and-conditions/${payload.id}/`)
}
function rest_auth_login_create(payload) {
  return royalCloudAPI.post(`/rest-auth/login/`, payload)
}
function rest_auth_logout_list(payload) {
  return royalCloudAPI.get(`/rest-auth/logout/`)
}
function rest_auth_logout_create(payload) {
  return royalCloudAPI.post(`/rest-auth/logout/`)
}
function rest_auth_password_change_create(payload) {
  return royalCloudAPI.post(`/rest-auth/password/change/`, payload)
}
function rest_auth_password_reset_create(payload) {
  return royalCloudAPI.post(`/rest-auth/password/reset/`, payload)
}
function rest_auth_password_reset_confirm_create(payload) {
  return royalCloudAPI.post(`/rest-auth/password/reset/confirm/`, payload)
}
function rest_auth_registration_create(payload) {
  return royalCloudAPI.post(`/rest-auth/registration/`, payload)
}
function rest_auth_registration_verify_email_create(payload) {
  return royalCloudAPI.post(`/rest-auth/registration/verify-email/`, payload)
}
function rest_auth_user_read(payload) {
  return royalCloudAPI.get(`/rest-auth/user/`)
}
function rest_auth_user_update(payload) {
  return royalCloudAPI.put(`/rest-auth/user/`, payload)
}
function rest_auth_user_partial_update(payload) {
  return royalCloudAPI.patch(`/rest-auth/user/`, payload)
}
export const apiService = {
  api_v1_admin_confirmed_orders_list,
  api_v1_admin_confirmed_orders_create,
  api_v1_admin_confirmed_orders_read,
  api_v1_admin_confirmed_orders_update,
  api_v1_admin_confirmed_orders_partial_update,
  api_v1_admin_confirmed_orders_delete,
  api_v1_admin_invoices_list,
  api_v1_admin_invoices_create,
  api_v1_admin_invoices_read,
  api_v1_admin_invoices_update,
  api_v1_admin_invoices_partial_update,
  api_v1_admin_invoices_delete,
  api_v1_admin_orders_list,
  api_v1_admin_orders_create,
  api_v1_admin_orders_approve_pending_reservation,
  api_v1_admin_orders_cancel_pending_reservation,
  api_v1_admin_orders_confirm,
  api_v1_admin_orders_generate_invoice,
  api_v1_admin_orders_invoice_list,
  api_v1_admin_orders_list_product_orders,
  api_v1_admin_orders_list_reservation_pending_product_orders,
  api_v1_admin_orders_processing,
  api_v1_admin_orders_submit_invoice,
  api_v1_admin_orders_read,
  api_v1_admin_orders_update,
  api_v1_admin_orders_partial_update,
  api_v1_admin_orders_delete,
  api_v1_assigned_user_list,
  api_v1_assigned_user_create,
  api_v1_assigned_user_get_unassigned_user,
  api_v1_assigned_user_read,
  api_v1_assigned_user_update,
  api_v1_assigned_user_partial_update,
  api_v1_assigned_user_delete,
  api_v1_brands_list,
  api_v1_brands_create,
  api_v1_brands_read,
  api_v1_brands_update,
  api_v1_brands_partial_update,
  api_v1_brands_delete,
  api_v1_broadcasts_list,
  api_v1_broadcasts_create,
  api_v1_broadcasts_read,
  api_v1_broadcasts_update,
  api_v1_broadcasts_partial_update,
  api_v1_broadcasts_delete,
  api_v1_cart_list,
  api_v1_cart_create,
  api_v1_cart_cancel_order,
  api_v1_cart_clear,
  api_v1_cart_remove_item,
  api_v1_cart_submit,
  api_v1_cart_read,
  api_v1_cart_update,
  api_v1_cart_partial_update,
  api_v1_cart_delete,
  api_v1_categories_list,
  api_v1_categories_create,
  api_v1_categories_read,
  api_v1_categories_update,
  api_v1_categories_partial_update,
  api_v1_categories_delete,
  api_v1_colors_list,
  api_v1_colors_create,
  api_v1_colors_read,
  api_v1_colors_update,
  api_v1_colors_partial_update,
  api_v1_colors_delete,
  api_v1_feedback_list,
  api_v1_feedback_create,
  api_v1_feedback_respond,
  api_v1_feedback_read,
  api_v1_feedback_update,
  api_v1_feedback_partial_update,
  api_v1_feedback_delete,
  api_v1_get_user_read,
  api_v1_login_create,
  api_v1_notifications_list,
  api_v1_notifications_create,
  api_v1_notifications_broadcast,
  api_v1_notifications_read_read,
  api_v1_notifications_read_create,
  api_v1_notifications_read,
  api_v1_notifications_update,
  api_v1_notifications_partial_update,
  api_v1_notifications_delete,
  api_v1_orders_list,
  api_v1_orders_create,
  api_v1_orders_calculate_total,
  api_v1_orders_read,
  api_v1_orders_update,
  api_v1_orders_partial_update,
  api_v1_orders_delete,
  api_v1_products_list,
  api_v1_products_create,
  api_v1_products_remove_image,
  api_v1_products_read,
  api_v1_products_update,
  api_v1_products_partial_update,
  api_v1_products_delete,
  api_v1_sales_person_list,
  api_v1_sales_person_create,
  api_v1_sales_person_read,
  api_v1_sales_person_update,
  api_v1_sales_person_partial_update,
  api_v1_sales_person_delete,
  api_v1_signup_create,
  api_v1_sizes_list,
  api_v1_sizes_create,
  api_v1_sizes_read,
  api_v1_sizes_update,
  api_v1_sizes_partial_update,
  api_v1_sizes_delete,
  api_v1_splash_screen_list,
  api_v1_splash_screen_create,
  api_v1_splash_screen_read,
  api_v1_test_user_create,
  api_v1_users_list,
  api_v1_users_create,
  api_v1_users_admin,
  api_v1_users_login,
  api_v1_users_logout,
  api_v1_users_otp,
  api_v1_users_password,
  api_v1_users_verify,
  api_v1_users_read,
  api_v1_users_update,
  api_v1_users_partial_update,
  api_v1_users_delete,
  modules_privacy_policy_list,
  modules_privacy_policy_create,
  modules_privacy_policy_read,
  modules_privacy_policy_update,
  modules_privacy_policy_partial_update,
  modules_privacy_policy_delete,
  modules_terms_and_conditions_list,
  modules_terms_and_conditions_create,
  modules_terms_and_conditions_read,
  modules_terms_and_conditions_update,
  modules_terms_and_conditions_partial_update,
  modules_terms_and_conditions_delete,
  rest_auth_login_create,
  rest_auth_logout_list,
  rest_auth_logout_create,
  rest_auth_password_change_create,
  rest_auth_password_reset_create,
  rest_auth_password_reset_confirm_create,
  rest_auth_registration_create,
  rest_auth_registration_verify_email_create,
  rest_auth_user_read,
  rest_auth_user_update,
  rest_auth_user_partial_update
}
