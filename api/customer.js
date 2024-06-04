import { API } from './'

export const getProducts = (payload, token) => {
  return API.get(`api/v1/products/${payload}`, token)
}

export const getMyOrders = (payload, token) => {
  return API.get(`api/v1/orders/${payload}`, token)
}

export const getMyOrdersTotal = (payload, token) => {
  return API.get(`api/v1/orders/calculate_total/${payload}`, token)
}

export const addToCart = (payload, token) => {
  return API.post(`api/v1/cart/`, payload, token)
}

export const removeItemFromCart = (payload, token) => {
  return API.delete(`api/v1/cart/remove_item/`, payload, token)
}

export const getCart = token => {
  return API.get(`api/v1/cart/`, token)
}

export const submitToCart = token => {
  return API.get(`api/v1/cart/submit/`, token)
}

export const sendFeedback = (payload, token) => {
  return API.post(`api/v1/feedback/`, payload, token)
}

export const deleteOrder = (payload, token) => {
  return API.get(`api/v1/cart/cancel_order/${payload}`, token)
}
