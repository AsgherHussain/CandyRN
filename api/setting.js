import { API } from "./"

export const getSplashScreen = () => {
  return API.get("api/v1/splash-screen/")
}

export const addSplashScreen = (payload, token) => {
  return API.post("api/v1/splash-screen/", payload, token)
}
