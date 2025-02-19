import React, { useEffect, useState } from "react";
import { getAllProject,UpdateProject,DeleteProjectService } from "../../Services/employeeService"; 
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function ViewProject() {
  const [ProjectsData, setProjectsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [Page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

 const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
 const [editingRow, setEditingRow] = useState(null);
  const [editedProject, setEditedProject] = useState({});
  useEffect(() => {
    fetchProjects(Page, pageSize);
  }, [Page, pageSize]);
  const fetchProjects = async (Page, pageSize) => {
    try {
      const data = await getAllProject(Page, pageSize);
      setProjectsData(data.content);
      setTotalPages(data.totalPages || 0);

    } catch (error) {
      setSnackbarMessage(error?.response?.data?.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const indexOfLastItem = currentPage * recordsPerPage;
  const indexOfFirstItem = indexOfLastItem - recordsPerPage;
  const currentItems = ProjectsData?.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(ProjectsData?.length / recordsPerPage); i++) {
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


  const filteredProjectData = ProjectsData.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject({ ...editedProject, [name]: value });
  };
  const handleEditClick = (project) => {
    setEditingRow(project.id);
    setEditedProject({ ...project });
  };

  const handleSaveClick = () => {
    saveEditedProject();
    setEditingRow(null);
  };

  const handleCancelClick = () => {
    setEditingRow(null);
    setEditedProject({});
  };


    const saveEditedProject = async () => {
      try {
        await UpdateProject(editedProject,editedProject.id);
        setSnackbarMessage("Project updated successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        fetchProjects( Page, pageSize);
      } catch (error) {
        setSnackbarMessage("Failed to update Project Name");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

        const handleDeleteProject  = async (id) => {
      try {
        await DeleteProjectService(id);
        setSnackbarMessage("Project Delete successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        fetchProjects( Page, pageSize);
      } catch (error) {
        setSnackbarMessage("Failed to Delete Project Name");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
  return (
    <div className="w-full h-full gap-[35px]  inline-flex flex-col    rounded-xl pl-[60px] pr-[59px] pb-[131px] pt-[55px]  ">
      <h2 className=" text-[#ffffff] work-sans font-semibold text-[36px]">
        Project List
      </h2>

      <div className="bg-[#FFFFFF]  flex flex-col justify-end  gap-[14px] pt-[18px] self-stretch">
        <div className="flex items-center   px-[30px]">
          <TextField
            variant="outlined"
            placeholder="Search the Project ......."
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

         
        </div>
        <div className="overflow-x-auto w-full">

        <table className="work-sans text-[14px] font-normal min-w-full  ">
          <thead className="bg-[#000000] h-[48px]  items-center items-stretch  ">
            <tr className=" text-white">
              <th className="px-[20px] py-[8px] ">S.No</th>
              <th className="px-[20px] py-[8px] ">Project Name</th>
              <th className="px-[20px] py-[8px] ">created At</th>

              <th className="px-[20px] py-[8px] ">Action</th>
            </tr>
          </thead>
          <tbody className="text-black   ">
            {filteredProjectData.length > 0 ? (
              filteredProjectData.map((project, index) => (
                <tr key={project.id} className="h-[58px] ">
                  <td className="px-[20px] py-[6px] ">{index + 1}</td>
                  <td className="px-[20px] py-[6px] ">
                  {editingRow === project.id ? (
                      <input
                        type="text"
                        name="projectName"
                        value={editedProject.projectName || ""}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-1"
                      />
                    ) : (
                      project.projectName
                    )}
                  </td>
                  <td className="px-[20px] py-[6px] ">{project.createdAt}</td>

                  <td className="flex w-[78px] p-[4px] justify-center items-center gap-[10px]">
                    {editingRow === project.id ? (
                      <>
                        <button
                          onClick={handleSaveClick}
                          className="bg-green-500 text-white rounded p-2"
                        >
                          <CheckIcon/>
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="bg-red-500 text-white rounded p-2"
                        >
                          <ClearIcon/>
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(project)}>
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
                        <button onClick={() => handleDeleteProject(project.id)}>
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
                  No Projects found.
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
            className={`page-item ${Page === totalPages - 1 ? "disabled" : ""}`}
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
    </div>
  );
}

export default ViewProject;
