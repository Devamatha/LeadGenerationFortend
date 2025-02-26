import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { createEmployee } from "../../Services/employeeService";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import PersonIcon from "@mui/icons-material/Person";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EmailIcon from "@mui/icons-material/Email";
import StayCurrentPortraitIcon from "@mui/icons-material/StayCurrentPortrait";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function CreateEmployee() {
  const [Role, setRole] = React.useState("ROLE_EMPLOYEE");
  const [fileName, setFileName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [MobileNumber, setMobileNumber] = useState("");
  const Id = sessionStorage.getItem("id");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    file: "",
  });
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, file: "File size should not exceed 2MB." });
        return;
      }
      if (
        !["image/jpeg", "image/jpg", "image/png"].includes(selectedFile.type)
      ) {
        setErrors({
          ...errors,
          file: "Only JPG, JPEG, and PNG files are allowed.",
        });
        return;
      }
      setFileName(selectedFile);
      setErrors({ ...errors, file: "" });
    }
  };
  const validateFullName = (name) => {
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setErrors({
        ...errors,
        fullName: "Employee Name should only contain letters.",
      });
    } else if (name.trim() !== name) {
      setErrors({
        ...errors,
        fullName: "Employee Name should not start or end with spaces.",
      });
    }else {
      setErrors({ ...errors, fullName: "" });
    }
  };

  const validateEmail = (email) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ ...errors, email: "Please enter a valid email address." });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const validateMobileNumber = (number) => {
    if (!/^[6789]\d{9}$/.test(number)) {
      setErrors({
        ...errors,
        mobileNumber:
          "Mobile Number should be 10 digits and start with 6, 7, 8, or 9.",
      });
    } else {
      setErrors({ ...errors, mobileNumber: "" });
    }
  };

  const validatePassword = (password) => {
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      setErrors({
        ...errors,
        password:
          "Password should be  8 characters long with 4 letters and 4 digits.",
      });
    } else {
      setErrors({ ...errors, password: "" });
    }
  };
  const isFormValid = 
  fullName && !errors.fullName &&
  email && !errors.email &&
  MobileNumber && !errors.mobileNumber &&
  password && !errors.password &&
  Role &&
  fileName && !errors.file;

  const handleSubmit = async () => {
    validateFullName(fullName);
    validateEmail(email);
    validateMobileNumber(MobileNumber);
    validatePassword(password);
  

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("mobileNumber", MobileNumber);
    formData.append("role", Role);
    if (fileName) {
      formData.append("image", fileName);
    }

    try {
      await createEmployee(formData, Id);

      setSnackbarMessage("Employee created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setFullName("");
      setEmail("");
      setPassword("");
      setMobileNumber("");
      setRole("ROLE_EMPLOYEE");
      setFileName("");
      setFileName(null);
    } catch (error) {
      setSnackbarMessage(error.response.data.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  return (
    <div className="flex  justify-center items-center ">
      <div className="flex  lg:px-[34px] lg:py-[26px]  gap-[32px]  flex-col items-start bg-[#FFFFFF] rounded-xl p-4">
        <h3 className="dm-sans-font md:text-[28px] text-[24px] text-[#000000]">
          Create a new employee
        </h3>
        <TextField
          required
          id="outlined-required"
          label="Employee Name"
          value={fullName}
          defaultValue="Name of an Employee"
          className="h-[48px] md:w-[379px]"
          onChange={(e) => {
            setFullName(e.target.value);
            validateFullName(e.target.value);
          }}
          error={!!errors.fullName}
          helperText={errors.fullName}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PersonIcon className="text-gray-500" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          required
          id="outlined-required"
          label="Email"
          defaultValue="Email of an Employee"
          value={email}
          className="h-[48px] md:w-[379px]"
          onChange={(e) =>{ 
            setEmail(e.target.value);
            validateEmail(e.target.value);

          }}
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EmailIcon className="text-gray-500" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          id="outlined-number"
          label="MobileNumber"
          type="number"
          value={MobileNumber}
          required
          className="h-[48px] md:w-[379px]"
          onChange={(e) => {
            setMobileNumber(e.target.value);
            validateMobileNumber(e.target.value);
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          error={!!errors.mobileNumber}
          helperText={errors.mobileNumber}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <StayCurrentPortraitIcon className="text-gray-500" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          required
          id="outlined-required"
          label="Password"
          defaultValue="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) =>{
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          className="h-[48px] md:w-[379px] "
          error={!!errors.password}
          helperText={errors.password}
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
        <FormControl className="h-[48px] md:w-[379px] w-[260px]">
          <InputLabel id="demo-simple-select-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Role}
            label="Role"
            defaultValue="ROLE_EMPLOYEE"
            onChange={handleChange}
          >
            <MenuItem value={"ROLE_EMPLOYEE"}>ROLE_EMPLOYEE</MenuItem>
          </Select>
        </FormControl>
        <TextField
          required
          id="outlined-required"
          label="Upload Image"
          value={fileName ? fileName.name : ""}
          className="h-[48px] md:w-[379px] w-[260px]"
          error={!!errors.file}
          helperText={errors.file}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  component="label"
                  variant="contained"
                  className="bg-[#2C5F99]"
                >
                  Upload
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
              </InputAdornment>
            ),
          }}
        />
        <button
          className="poppins-regular text-[16px] text-[#F9F9F9] font-semibold bg-[#2C5F99] h-[44px] align-middle md:w-[361px] w-[260px] rounded-sm p-[10px] disabled:bg-gray-400"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Create Employee
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

export default CreateEmployee;
