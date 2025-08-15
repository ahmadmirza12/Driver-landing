import axios from "axios"
import { store } from "../redux/store"

const baseURL = "https://riderbackend-gbe0.onrender.com/api/"

const createApi = () => {
  // Regular API instance for JSON requests
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // File upload instance without Content-Type header
  const fileInstance = axios.create({
    baseURL,
    timeout: 30000, // 30 second timeout for file uploads
  })

  // Add auth interceptor to both instances
  const addAuthInterceptor = (inst) => {
    inst.interceptors.request.use((config) => {
      const state = store.getState()
      console.log("state===>", state);
      const token = state?.authConfigs?.token || localStorage.getItem("token")
      console.log("token===>", token)
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
      return config
    })
  }

  addAuthInterceptor(instance)
  addAuthInterceptor(fileInstance)

  const get = (url) => {
    return instance.get(url)
  }

  const post = (url, data) => {
    // Use file instance for FormData, regular instance for everything else
    if (data instanceof FormData) {
      return fileInstance.post(url, data)
    }
    return instance.post(url, data)
  }

  const put = (url, data) => {
    if (data instanceof FormData) {
      return fileInstance.put(url, data)
    }
    return instance.put(url, data)
  }

  const del = (url) => {
    return instance.delete(url)
  }

  return { get, post, put, del }
}

export const { get, post, put, del } = createApi()
