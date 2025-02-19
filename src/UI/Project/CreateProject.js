import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { createProject } from "../../Services/employeeService";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function CreateProject() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [projectName, SetProjectName] = useState("");

  const handleSubmit = async () => {
    if (!projectName) {
      setSnackbarMessage("Please fill the Project Name.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await createProject(projectName);

      setSnackbarMessage("Project created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      SetProjectName("");
    } catch (error) {
      setSnackbarMessage(error.response.data.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  return (
    <div className="flex  justify-center items-center">
      <div className="flex  px-[34px] py-[26px]  gap-[32px]  flex-col items-start bg-[#FFFFFF] rounded-xl">
        <h3 className="dm-sans-font md:text-[28px] text-[22px] text-[#000000]">
          Create a new employee
        </h3>
        <TextField
          required
          id="outlined-required"
          label="Project Name"
          value={projectName}
          defaultValue="Project Name"
          className="h-[48px] md:w-[379px]"
          onChange={(e) => SetProjectName(e.target.value)}
        />

        <button
          className="poppins-regular md:text-[16px] text-[14px]  text-[#F9F9F9] font-semibold bg-[#2C5F99] h-[44px] md:w-[361px] w-full rounded-sm p-[10px]"
          onClick={handleSubmit}
        >
          Create Project
        </button>

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
    </div>
  );
}

export default CreateProject;
