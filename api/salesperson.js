import { API } from "./"

export const getSalesPerson = token => {
  return API.get("api/v1/sales_person/", token)
}

export const getSalesPersonById = (id, token) => {
  return API.get(`api/v1/sales_person/${id}/`, token)
}

export const createNewSalePersonProfile = (payload, token) => {
  return API.get("api/v1/sales_person/", payload, token)
}

export const updateSalepersonProfiles = (id, payload, token) => {
  return API.patch(`api/v1/sales_person/${id}/`, payload, token)
}

export const deleteSalepersonProfiles = (id, token) => {
  return API.delete(`api/v1/sales_person/${id}/`, {}, token)
}

export const assignedUsersToSalesPerson = (payload, token) => {
  return API.post("api/v1/assigned_user/", payload, token)
}

export const deleteUsersSalesPerson = (id, token) => {
  return API.delete(`api/v1/assigned_user/${id}/`, {}, token)
}

export const changeRoleToSalepersons = (id, payload, token) => {
  return API.patch(`api/v1/users/${id}/`, payload, token)
}

export const updateSalepersonNewProfiles = (payload, token) => {
  return API.post("api/v1/sales_person/", payload, token)
}
