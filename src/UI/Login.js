import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { LoginApI } from "../Services/employeeService";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InputAdornment from "@mui/material/InputAdornment";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Login() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!username || !password) {
      setSnackbarMessage("Please fill the  all the feilds.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await LoginApI(username, password);
      if (response != null) {
        setSnackbarMessage(" login successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setUserName("");
        setPassword("");
        sessionStorage.setItem("jwt", response.jwtToken);
        sessionStorage.setItem("id", response.id);
        sessionStorage.setItem("email", response.email);
        sessionStorage.setItem("role", response.role);
        if(response.role==="ROLE_ADMIN"){
          navigate("/dashboard/ViewEmployee");
        }else{
          setSnackbarMessage("UnAuthorized User");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          sessionStorage.clear();
        }
      }
    } catch (error) {
      setSnackbarMessage(error.response.data.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      sessionStorage.clear();

    }
  };
  return (
    <div className="flex  justify-center items-center bg-[#2C5F99] h-screen">
      <div className="flex w-[447px] px-[34px] py-[26px]  gap-[32px]  flex-col items-start bg-[#FFFFFF] rounded-xl">
        <h3 className="dm-sans-font text-[28px] text-[#000000]">Admin Login</h3>
        <TextField
          required
          id="outlined-required"
          label="Email"
          value={username}
          defaultValue="Email"
          className="h-[48px] w-[379px]"
          onChange={(e) => setUserName(e.target.value)}
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
          label="Password"
          defaultValue="Password"
          type={showPassword ? "text" : "password"}

          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-[48px] w-[379px]"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
            <span onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
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
        <button
          className="poppins-regular text-[16px] text-[#F9F9F9] font-semibold bg-[#2C5F99] h-[44px] w-[361px] rounded-sm p-[10px]"
          onClick={handleSubmit}
        >
          Login
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

export default Login;
