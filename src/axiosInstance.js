import axios from "axios";
import { jwtDecode } from "jwt-decode";
const apiUrl = process.env.REACT_APP_DB;
const environment = process.env.REACT_APP_NODE_ENV;
const axiosInstance = axios.create({
    baseURL: apiUrl,
});

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime; 
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; 
    }
};

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = sessionStorage.getItem("Authorization");

//             config.headers.Authorization = `${token}`; 
        

//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            error.response.data.status === 500 &&
            error.response.data.error === "JWT expired"
        ) {
            console.log("JWT expired");
            sessionStorage.clear();
            localStorage.clear();
            window.location.href = "/"; 
        }

        return Promise.reject(error); 
    }
);

export default axiosInstance; 
