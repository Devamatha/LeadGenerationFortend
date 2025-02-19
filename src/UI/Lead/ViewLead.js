import React, { useEffect, useState } from "react";
import { getAllLeads } from "../../Services/employeeService"; // Import the API function
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import jsPDF from "jspdf";
import "jspdf-autotable";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function ViewLead() {
  const [Leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [Page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

 const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    fetchAllLeads(Page, pageSize);
  }, [Page, pageSize]);
  const fetchAllLeads = async (Page, pageSize) => {
    try {
      const data = await getAllLeads(Page, pageSize);
      setLeads(data.content);
      setTotalPages(data.totalPages || 0);

    } catch (error) {
      setSnackbarMessage(error.response.data.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const indexOfLastItem = currentPage * recordsPerPage;
  const indexOfFirstItem = indexOfLastItem - recordsPerPage;
  const currentItems = Leads?.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(Leads?.length / recordsPerPage); i++) {
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


  const filteredLeads = Leads.filter((leadfilter) =>
    leadfilter.leadType.toLowerCase().includes(searchTerm.toLowerCase())
  || leadfilter.leadFor.toLowerCase().includes(searchTerm.toLowerCase())
  || leadfilter.mailId.toLowerCase().includes(searchTerm.toLowerCase())
  || leadfilter.bussinessName.toLowerCase().includes(searchTerm.toLowerCase())
  || leadfilter.address.toLowerCase().includes(searchTerm.toLowerCase())
  || leadfilter.bussinessType.toLowerCase().includes(searchTerm.toLowerCase())
  || leadfilter.createdDate.toLowerCase().includes(searchTerm.toLowerCase())

  || leadfilter.mobileNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

    const handleExportPdf = () => {
      const doc = new jsPDF();
      doc.text("Leads Data", 20, 10);
    
      const tableColumn = ["S.No", "Lead Name", "Mobile Number", "Email Id", "Lead For" ,"Lead Type" ,"Address","Lead Entry Date"];
      const tableRows = [];
    
      filteredLeads.forEach((leadData, index) => {
        const LeadsData = [
          index + 1,
          leadData.bussinessName,
          leadData.mobileNumber,
          leadData.email,
          leadData.leadFor,
          leadData.leadType,
          leadData.address,
          leadData.createdDate
        ];
        tableRows.push(LeadsData);
      });
    
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });
    
      doc.save("LeadsData.pdf");
    };
  return (
    <div className="w-full h-full  gap-[35px]  inline-flex flex-col     rounded-xl lg:pl-[60px] lg:pr-[59px] lg:pb-[131px] lg:pt-[55px] p-4 ">
      <h2 className=" text-[#ffffff] work-sans font-semibold text-[36px]">
      All  Lead 
      </h2>

      <div className="bg-[#FFFFFF]  flex flex-col justify-end  gap-[14px] pt-[18px] self-stretch">
        <div className="flex items-center  gap-[15px] px-[30px] ">
          <TextField
            variant="outlined"
            placeholder="Search the Leads......."
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

          <button className="bg-[#497CB6] work-sans text-[#FFFFFF] rounded-xs  flex justify-center w-[166px] p-[10px]  gap-[10px] items-center mr-2" onClick={handleExportPdf}>
            Export Pdf
          </button>
        </div>
        <div className="overflow-x-auto w-full">

        <table className="work-sans text-[14px] font-normal min-w-full ">
          <thead className="bg-[#000000] h-[48px]  items-center items-stretch  ">
            <tr className=" text-white">
              <th className="px-[20px] py-[8px] ">S.No</th>
              <th className="px-[20px] py-[8px] ">Image</th>
              <th className="px-[20px] py-[8px] ">Lead Name</th>
              <th className="px-[20px] py-[8px] ">Phone Number</th>
              <th className="px-[20px] py-[8px] ">Email Id</th>
              <th className="px-[20px] py-[8px] ">Lead For</th>
              <th className="px-[20px] py-[8px] ">Lead Type</th>
              <th className="px-[20px] py-[8px] ">Address</th>
              <th className="px-[20px] py-[8px] ">Lead Entry Date</th>

            </tr>
          </thead>
          <tbody className="text-black   ">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead, index) => (
                <tr key={lead.id} className="h-[58px] ">
                  <td className="px-[20px] py-[6px] ">{index + 1}</td>

                  <td className="px-[20px] py-[6px]">
                    {lead.image && (
                      <img
                        src={`data:image/jpeg;base64,${lead.image}`}
                        alt="profile"
                        className="w-[40px] h-[40px] rounded-full object-cover"
                      />
                    )}
                  </td>
                  <td className="px-[20px] py-[6px] ">{lead.bussinessName}</td>
                  <td className=" px-[20px] py-[6px]">
                    {lead.mobileNumber}
                  </td>
                  <td className=" px-[20px] py-[6px]">{lead.mailId}</td>
                  <td className=" px-[20px] py-[6px]">{lead.leadFor}</td>

                  <td className=" px-[20px] py-[6px]">{lead.leadType}</td>
                  <td className=" px-[20px] py-[6px]">{lead.address}</td>
                  <td className=" px-[20px] py-[6px]">{lead.createdDate}</td>

                  
                 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="  text-center">
                  No Lead found.
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

export default ViewLead;
