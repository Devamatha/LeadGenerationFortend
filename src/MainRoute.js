import React from "react";
import { Route, Routes } from "react-router-dom";
import CreateEmployee from "./UI/Employee/CreateEmployee";
import ViewEmployee from "./UI/Employee/ViewEmployee";
import ViewLead from "./UI/Lead/ViewLead";
import ViewProject from "./UI/Project/ViewProject";
import CreateProject from "./UI/Project/CreateProject";
import LayoutDashboard from "./UI/LayoutDashboard";
import ViewLeadById from "./UI/Lead/ViewLeadById";
import Login from "./UI/Login";
import PrivateRoute from "./PrivateRoute";
const MainRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route    path="/dashboard"  element={ <PrivateRoute element={LayoutDashboard} requiredRole="ROLE_ADMIN"/>}>
          <Route  path="/dashboard/createEmployee"  element={<PrivateRoute  element={CreateEmployee}  requiredRole="ROLE_ADMIN"/>} />
          <Route  path="/dashboard/ViewEmployee" element={<PrivateRoute element={ViewEmployee} requiredRole="ROLE_ADMIN"/>}/>
          <Route  path="/dashboard/ViewLead"  element={<PrivateRoute element={ViewLead} requiredRole="ROLE_ADMIN"/>} />
          <Route  path="/dashboard/ViewLeadById/:id"  element={<PrivateRoute element={ViewLeadById} requiredRole="ROLE_ADMIN"/>} />
          <Route  path="/dashboard/ViewProject" element={<PrivateRoute element={ViewProject} requiredRole="ROLE_ADMIN"/>}/>
          <Route  path="/dashboard/CreateProject"  element={<PrivateRoute element={CreateProject} requiredRole="ROLE_ADMIN"/>}  />
        </Route>
      </Routes>
    </div>
  );
};
export default MainRoute;
