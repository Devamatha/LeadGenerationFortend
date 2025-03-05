import React, { useEffect, useState } from "react";
import {
  getAllEmployeesByAdminId,
  UpdateEmployee,
  DeleteEmployee,
  getAllInActiveEmployeesByAdminId,
} from "../../Services/employeeService"; // Import the API function
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { useParams } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { LoginApI } from "../../Services/employeeService";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import jsPDF from "jspdf";
import "jspdf-autotable";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function ViewEmployee() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [Page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [editingRow, setEditingRow] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});
  const Id = sessionStorage.getItem("id");
  const { id } = useParams();
  const emailId = sessionStorage.getItem("email");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleViewCountClick = (id) => {
    navigate(`/dashboard/ViewLeadById/${id}`);
  };

  useEffect(() => {
    fetchEmployees(Id, Page, pageSize);
  }, [Page, pageSize]);
  const fetchEmployees = async (id, Page, pageSize) => {
    try {
      const data = await getAllEmployeesByAdminId(id, Page, pageSize);
      setEmployees(data.employees);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      setSnackbarMessage(error.response.data.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const fetchInActiveEmployees = async () => {
    try {
      const data = await getAllInActiveEmployeesByAdminId(Id, Page, pageSize);
      setEmployees(data.employees);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      setSnackbarMessage(error.response.data.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const indexOfLastItem = currentPage * recordsPerPage;
  const indexOfFirstItem = indexOfLastItem - recordsPerPage;
  const currentItems = employees?.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(employees?.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePreviousPage = () => {
    if (Page > 0) setPage(Page - 1);
  };

  const handleNextPage = () => {
    if (Page < totalPages - 1) setPage(Page + 1);
  };

  const handlePageClick = (number) => {
    setPage(number - 1);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.mobileNumber
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.leadCount
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee({ ...editedEmployee, [name]: value });
  };
  const handleEditClick = (employee) => {
    setEditingRow(employee.id);
    setEditedEmployee({ ...employee });
  };

  const handleSaveClick = () => {
    saveEditedEmployee();
    setEditingRow(null);
  };

  const handleCancelClick = () => {
    setEditingRow(null);
    setEditedEmployee({});
  };

  const saveEditedEmployee = async () => {
    try {
      await UpdateEmployee(editedEmployee, editedEmployee.id);
      setSnackbarMessage("Employee updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchEmployees(Id, Page, pageSize);
    } catch (error) {
      setSnackbarMessage("Failed to update employee");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await DeleteEmployee(id);
      setSnackbarMessage("Project Delete successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchEmployees(Id, Page, pageSize);
    } catch (error) {
      setSnackbarMessage("Failed to Delete Project Name");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!emailId || !password) {
      setSnackbarMessage("Please fill the  all the feilds.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await LoginApI(emailId, password);
      if (response != null) {
        fetchInActiveEmployees();
        setPassword("");
        closeModal();
      }
    } catch (error) {
      setSnackbarMessage(error.response.data.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      closeModal();
      sessionStorage.clear();
      navigate(`/`, { replace: true });
    }
  };
const handleExportPdf = () => {
      const doc = new jsPDF();
      doc.text("Employee Data", 20, 10);
    
      const tableColumn = ["S.No",  "fullName", "Mobile Number", "Email Id", "Lead count" ];
      const tableRows = [];
    
      filteredEmployees.forEach((employee, index) => {
        const employeeData = [
          index + 1,
          employee.fullName,
          employee.email,
          employee.mobileNumber,
          employee.leadCount
         
        ];
        tableRows.push(employeeData);
      });
    
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });
    
      doc.save("EmployeeData.pdf");
    };


  return (
    <div className="w-full h-full gap-[35px]  inline-flex flex-col   rounded-xl lg:pl-[60px] lg:pr-[59px] lg:pb-[131px] lg:pt-[55px] p-4  ">
      <h2 className=" text-[#ffffff] work-sans font-semibold text-[36px]">
        Employee List
      </h2>

      <div className="bg-[#FFFFFF]  flex flex-col justify-end  gap-[14px] pt-[18px] self-stretch ">
        <div className="flex lg:flex-row   flex-col items-center  gap-[15px] px-[30px] ">
          <TextField
            variant="outlined"
            placeholder="Search the employees ......."
            fullWidth
            className="ml-2"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#EAEAEA",
                borderRadius: "16px",
                paddingLeft: "18px",
                paddingRight: "18px",
                paddingTop: "4px",
                paddingBottom: "4px",
                gap: "11px",
                display: "flex",
                flex: "1 1 0",
                alignItems: "center",
                height: "36px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-500" />
                </InputAdornment>
              ),
            }}
          />
           <div className = "flex md:justify-center md:w-full gap-[10px]">

          <button
            className="bg-[#497CB6] work-sans text-[#FFFFFF] rounded-xs w-auto   flex justify-center p-[10px]   items-center"
            onClick={openModal}
          >
            InActive Employes
          </button>
          <button className="bg-[#497CB6] work-sans text-[#FFFFFF] w-auto  rounded-xs  flex justify-center p-[10px]   items-center mr-2" onClick={handleExportPdf}>
            Export Pdf
          </button>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="work-sans text-[14px] font-normal min-w-full ">
            <thead className="bg-[#000000] h-[48px]  items-center items-stretch  ">
              <tr className=" text-white">
                <th className="px-[20px] py-[8px] ">S.No</th>
                <th className="px-[20px] py-[8px] ">Profile</th>
                <th className="px-[20px] py-[8px] ">Full Name</th>
                <th className="px-[20px] py-[8px] ">Mobile Number</th>
                <th className="px-[20px] py-[8px] ">Email</th>
                <th className="px-[20px] py-[8px] ">Lead Count</th>
                <th className="px-[20px] py-[8px] ">Action</th>
              </tr>
            </thead>
            <tbody className="text-black   ">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <tr key={employee.id} className="h-[58px] ">
                    <td className="px-[20px] py-[6px] ">{index + 1}</td>

                    <td className="px-[20px] py-[6px]">
                      {employee.profileImage ? (
                        <img
                          src={`data:image/jpeg;base64,${employee.profileImage}`}
                          alt="profile"
                          className="w-[40px] h-[40px] rounded-full object-cover"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="px-[20px] py-[6px] ">
                      {editingRow === employee.id ? (
                        <input
                          type="text"
                          name="fullName"
                          value={editedEmployee.fullName || ""}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded p-1"
                        />
                      ) : (
                        employee.fullName
                      )}
                    </td>
                    <td className=" px-[20px] py-[6px]">
                      {editingRow === employee.id ? (
                        <input
                          type="text"
                          name="mobileNumber"
                          value={editedEmployee.mobileNumber || ""}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded p-1"
                        />
                      ) : (
                        employee.mobileNumber
                      )}
                    </td>
                    <td className=" px-[20px] py-[6px]">
                      {editingRow === employee.id ? (
                        <input
                          type="text"
                          name="email"
                          value={editedEmployee.email || ""}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded p-1"
                        />
                      ) : (
                        employee.email
                      )}
                    </td>
                    <td className=" px-[20px] py-[6px]">
                      <button
                        className=" relative bg-[#2C5F99] text-[#FFFFFF]  p-[8px] rounded-sm absolute "
                        onClick={() => handleViewCountClick(employee.id)}
                      >
                        View Count
                        <div className="absolute -top-2 -right-2 bg-[#FF4B4B] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {employee.leadCount}
                        </div>
                      </button>
                    </td>
                    <td className="flex w-[78px] p-[4px] justify-center items-center gap-[10px]">
                      {editingRow === employee.id ? (
                        <>
                          <button
                            onClick={handleSaveClick}
                            className="bg-green-500 text-white rounded p-2"
                          >
                            <CheckIcon />
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="bg-red-500 text-white rounded p-2"
                          >
                            <ClearIcon />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(employee)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M3 21V16.75L16.2 3.575C16.4 3.39167 16.621 3.25 16.863 3.15C17.105 3.05 17.359 3 17.625 3C17.891 3 18.1493 3.05 18.4 3.15C18.6507 3.25 18.8673 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.771 5.4 20.863 5.65C20.955 5.9 21.0007 6.15 21 6.4C21 6.66667 20.9543 6.921 20.863 7.163C20.7717 7.405 20.6257 7.62567 20.425 7.825L7.25 21H3ZM17.6 7.8L19 6.4L17.6 5L16.2 6.4L17.6 7.8Z"
                                fill="#2C5F99"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(employee.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M7 21C6.45 21 5.97933 20.8043 5.588 20.413C5.19667 20.0217 5.00067 19.5507 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8043 20.021 18.413 20.413C18.0217 20.805 17.5507 21.0007 17 21H7ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                                fill="#2C5F99"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="  text-center">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <nav className="mt-2" aria-label="Page navigation example ">
          <ul className="pagination justify-content-center">
            <li
              className={`page-item ${Page === 0 ? "disabled" : ""}`}
              onClick={handlePreviousPage}
            >
              <a className="page-link" href="#!">
                Previous
              </a>
            </li>
            {pageNumbers
              .filter(
                (number) =>
                  number === Page + 1 || number === Page || number === Page + 2
              )
              .map((number) => (
                <li
                  key={number}
                  className={`page-item ${Page + 1 === number ? "active" : ""}`}
                  onClick={() => handlePageClick(number)}
                >
                  <a className="page-link" href="#!">
                    {number}
                  </a>
                </li>
              ))}
            <li
              className={`page-item ${
                Page === totalPages - 1 ? "disabled" : ""
              }`}
              onClick={handleNextPage}
            >
              <a className="page-link" href="#!">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl mb-4">Please Enter Password</h2>
            <TextField
              required
              id="outlined-required"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[48px] w-full"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <span
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? (
                        <RemoveRedEyeIcon className="text-gray-500" />
                      ) : (
                        <VisibilityOffIcon className="text-gray-500" />
                      )}
                    </span>
                  </InputAdornment>
                ),
              }}
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-gray-400 text-white rounded px-4 py-2"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white rounded px-4 py-2"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewEmployee;
