import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imageSample from "../assets/icons/clarity_employee.png";
import materialSymbol from "../assets/icons/material.png";
import plus from "../assets/icons/plus.png";
import logout from "../assets/icons/logout.png";
import CloseIcon from '@mui/icons-material/Close';
function Sidenav({ isSidebarOpen, toggleSidebar }) {
  const [openItems, setOpenItems] = useState({});
  const navigate=useNavigate();
  const toggleOpen = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const data = [
    {
      id: 1,
      name: "Employees",
      image: imageSample,
      elements: [
        {
          id: 1,
          listName: "Create Employee",
          routerLink: "/dashboard/createEmployee",
        },
        {
          id: 2,
          listName: "View Employee",
          routerLink: "/dashboard/viewEmployee",
        },
      ],
    },
    {
      id: 2,
      name: "Leads",
      image: materialSymbol,
      elements: [
        { id: 1, listName: "View Leads", routerLink: "/dashboard/ViewLead" },
      ],
    },
    {
      id: 3,
      name: "Projects",
      image: plus,
      elements: [
        {
          id: 1,
          listName: "Create Project",
          routerLink: "/dashboard/createProject",
        },
        {
          id: 2,
          listName: "View Project",
          routerLink: "/dashboard/viewProject",
        },
      ],
    },
    {
      id: 4,
      name: "Logout",
      image: logout,
      routerLink: "/",
    },
  ];
  const handlelogout=()=>{
    sessionStorage.clear();
    navigate("/",{replace:true});
  }
  // bg-[#2C5F99]
  return (
    <div className={`h-screen bg-[#2C5F99]  transition-transform duration-300  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
    
     <div className="cursor-pointer lg:hidden" onClick={toggleSidebar}>
      <CloseIcon className="text-white text-4xl absolute top-4 right-4 " />
     </div>
      <div className="inline-flex px-[12px] pl-[34px] flex flex-col items-center gap-[24px]">
        <div className="pt-[35px] mb-[83px] ">
          <div className="w-[250px] gap-[10px] bg-[#FFFFFF]">
            <p className="text-[#2C5F99] dm-sans-font leading-[36.46px] text-[28px] text-center p-[10px]">
              My Work Space
            </p>
          </div>
        </div>

        {data.map((item) => (
          <div key={item.id} className="flex flex-col items-start w-[250px]">
            {item.name === "Logout" ? (
              <div
                onClick={handlelogout}
                className="flex justify-between self-stretch bg-[#FFFFFF] p-[8px] cursor-pointer"
              >
                <div className="flex items-center gap-[8px]">
                  <img
                    className="w-[24px] h-[24px]"
                    src={item.image}
                    alt={item.name}
                  />
                  <p className="poppins-regular text-[20px] text-[#2C5F99] font-medium">
                    {item.name}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="flex justify-between self-stretch bg-[#FFFFFF] p-[8px] cursor-pointer"
                  onClick={() => toggleOpen(item.id)}
                >
                  <div className="flex items-center gap-[8px]">
                    <img
                      className="w-[24px] h-[24px]"
                      src={item.image}
                      alt={item.name}
                    />
                    <p className="poppins-regular text-[20px] text-[#2C5F99] font-medium">
                      {item.name}
                    </p>
                  </div>
                  {item.elements && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`transition-transform duration-300 ${
                        openItems[item.id] ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.2682 8.62353C11.4558 8.43606 11.7101 8.33074 11.9752 8.33074C12.2404 8.33074 12.4947 8.43606 12.6822 8.62353L18.3392 14.2805C18.4348 14.3728 18.5109 14.4831 18.5633 14.6051C18.6158 14.7271 18.6433 14.8583 18.6445 14.9911C18.6456 15.1239 18.6203 15.2556 18.5701 15.3785C18.5198 15.5014 18.4455 15.613 18.3516 15.7069C18.2577 15.8008 18.1461 15.8751 18.0232 15.9254C17.9003 15.9756 17.7686 16.0009 17.6358 15.9998C17.5031 15.9986 17.3718 15.971 17.2498 15.9186C17.1278 15.8662 17.0175 15.79 16.9252 15.6945L11.9752 10.7445L7.02524 15.6945C6.83664 15.8767 6.58404 15.9775 6.32184 15.9752C6.05965 15.9729 5.80883 15.8678 5.62342 15.6823C5.43802 15.4969 5.33285 15.2461 5.33057 14.9839C5.32829 14.7217 5.42908 14.4691 5.61124 14.2805L11.2682 8.62353Z"
                        fill="#2C5F99"
                      />
                    </svg>
                  )}
                </div>

                {openItems[item.id] && item.elements && (
                  <div className="flex flex-col gap-[10px] w-[250px] mt-1">
                    {item.elements.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.routerLink}
                        className="text-[#2C5F99] text-center text-[16px] poppins-regular font-normal bg-[#FFFFFF] p-[10px] hover:bg-black hover:text-white hover:no-underline transition"
                      >
                        {subItem.listName}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidenav;
