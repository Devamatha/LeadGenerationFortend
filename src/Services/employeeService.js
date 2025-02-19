import axios from "axios";
import axiosInstance from "../axiosInstance";

const API_URL = process.env.REACT_APP_DB;

export const createEmployee = async (employeeData, id) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}clients/saveEmployee/${id}`,
      employeeData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${sessionStorage.getItem("jwt")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};




export const UpdateEmployee = async (employeeData, id) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}clients/update/${id}`,
      employeeData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${sessionStorage.getItem("jwt")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateProject = async (employeeData, id) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}project/update/${id}`,
      employeeData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${sessionStorage.getItem("jwt")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllEmployeesByAdminId = async (id, Page, pageSize) => {
  try {
    const response = await axiosInstance.get(`${API_URL}clients/employees/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("jwt")}`,
      },
      params: {
        page: Page,
        size: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllInActiveEmployeesByAdminId = async (id, Page, pageSize) => {
  try {
    const response = await axiosInstance.get(`${API_URL}clients/InActive-employees/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("jwt")}`,
      },
      params: {
        page: Page,
        size: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllProject= async ( Page, pageSize) => {
  try {
    const response = await axiosInstance.get(`${API_URL}project/getAllprojects`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("jwt")}`,
      },
      params: {
        page: Page,
        size: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllLeads= async ( Page, pageSize) => {
  try {
    const response = await axiosInstance.get(`${API_URL}lead/getAll-leads`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("jwt")}`,
      },
      params: {
        page: Page,
        pageSize: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllLeadsById= async (Id, Page, pageSize) => {
  try {
    const response = await axiosInstance.get(`${API_URL}lead/getleadById/${Id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("jwt")}`,
      },
      params: {
        page: Page,
        pageSize: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createProject = async (projectName) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}project/save`,

      {
        projectName,
      },
      {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const LoginApI = async (username,password) => {
  try {
    const response = await axios.post(
      `${API_URL}clients/login`,

      {
        username,
        password
      },
      
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const DeleteProjectService = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `${API_URL}project/delete/${id}`,
     
      {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const DeleteEmployee = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `${API_URL}clients/delete/${id}`,
     
      {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};