import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
// import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
// import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CountertopsOutlinedIcon from "@mui/icons-material/CountertopsOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === to}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(to)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState(location.pathname);

  const [user, setUser] = useState({ name: "", role: "", photo: "" });

  // const userData = JSON.parse(localStorage.getItem("userData"));
  // const branchCode = userData?.branchCode[0];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser(userData);
    }
    setSelected(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    {
      title: "Dashboard",
      to: "/dashboard",
      icon: <HomeOutlinedIcon />,
      roles: [
        "IT",
        "Business Development",
        "Manager Accounting",
        "Assistant Manager Accounting",
        "Head Accounting",
      ],
    },
    {
      title: "Manage Team",
      to: "/team",
      icon: <PeopleOutlinedIcon />,
      roles: ["IT"],
    },
    {
      title: "Branch",
      to: "/branch",
      icon: <ReceiptOutlinedIcon />,
      roles: ["IT"],
    },
    {
      title: "Reservation Summary",
      to: "/calendar",
      icon: <CalendarTodayOutlinedIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Customers",
      to: "/customers",
      icon: <ContactsOutlinedIcon />,
      roles: [
        "IT",
        "Business Development",
        "Manager Accounting",
        "Assistant Manager Accounting",
        "Head Accounting",
        "GRO",
      ],
    },
    {
      title: "Pending Reservation",
      to: "/pending_reservation",
      icon: <AvTimerIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Confirmed Reservation",
      to: "/confirmed_reservation",
      icon: <FactCheckOutlinedIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Order Summary",
      to: "/order_summary",
      icon: <SummarizeOutlinedIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Request Refund",
      to: "/request_refund",
      icon: <ReceiptOutlinedIcon />,
      roles: [
        "IT",
        "Business Development",
        "Manager Accounting",
        "Assistant Manager Accounting",
        "Head Accounting",
      ],
    },
    {
      title: "List Refund",
      to: "/list_refund",
      icon: <RequestQuoteOutlinedIcon />,
      roles: [
        "IT",
        "Business Development",
        "Manager Accounting",
        "Assistant Manager Accounting",
        "Head Accounting",
        "GRO",
      ],
    },
    {
      title: "Disbursement",
      to: "/disbursement",
      icon: <MonetizationOnIcon />,
      roles: ["IT", "Manager Accounting"],
    },
    {
      title: "Disbursement List",
      to: "/disbursement_list",
      icon: <PriceCheckIcon />,
      roles: ["IT", "Manager Accounting"],
    },
    {
      title: "Quota Branch",
      to: "/branch_quota",
      icon: <EditCalendarIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Served",
      to: "/config_menu",
      icon: <RoomServiceIcon />,
      roles: ["IT"],
    },
    {
      title: "Privacy Policy",
      to: "/config_privasi",
      icon: <PrivacyTipIcon />,
      roles: ["IT"],
    },
    {
      title: "Configurations",
      to: "/configuration",
      icon: <PermDataSettingIcon />,
      roles: ["IT"],
    },
    {
      title: "Category",
      to: "/category",
      icon: <RestaurantMenuIcon />,
      roles: ["GRO"],
    },
    {
      title: "Menu",
      to: "/menu",
      icon: <MenuBookIcon />,
      roles: ["GRO"],
    },
    {
      title: "Option",
      to: "/option",
      icon: <CountertopsOutlinedIcon />,
      roles: ["GRO"],
    },
    {
      title: "Item Option",
      to: "/item_option",
      icon: <CountertopsOutlinedIcon />,
      roles: ["GRO"],
    },
    {
      title: "Option Package",
      to: "/option_package",
      icon: <CountertopsOutlinedIcon />,
      roles: ["GRO"],
    },
    {
      title: "Item Package",
      to: "/item_package",
      icon: <CountertopsOutlinedIcon />,
      roles: ["GRO"],
    },
    // {
    //   title: "Category Grist",
    //   to: "/category_grist",
    //   icon: <PermDataSettingIcon />,
    //   roles: ["GRO"],
    // },
    // {
    //   title: "Menu Grist",
    //   to: "/menu_grist",
    //   icon: <PermDataSettingIcon />,
    //   roles: ["GRO"],
    // },
    // {
    //   title: "Add CategoryId di Menu",
    //   to: "/add_categoryid",
    //   icon: <PermDataSettingIcon />,
    //   roles: ["GRO"],
    // },
    // {
    //   title: "Option Grist",
    //   to: "/option_grist",
    //   icon: <PermDataSettingIcon />,
    //   roles: ["GRO"],
    // },
    // {
    //   title: "Item Option Grist",
    //   to: "/item_option_grist",
    //   icon: <PermDataSettingIcon />,
    //   roles: ["GRO"],
    // },
    // {
    //   title: "Add ID di Item Option",
    //   to: "/add_id",
    //   icon: <PermDataSettingIcon />,
    //   roles: ["GRO"],
    // },
    // {
    //   title: "Option Package Grist",
    //   to: "/option_package_grist",
    //   icon: <PermDataSettingIcon />,
    //   roles: ["GRO"],
    // },
    // {
    //   title: "Item Package Grist",
    //   to: "/item_package_grist",
    //   icon: <PermDataSettingIcon />,
    //   roles: ["GRO"],
    // },
    // {
    //   title: "FAQ Page",
    //   to: "/faq",
    //   icon: <HelpOutlineOutlinedIcon />,
    //   roles: [
    //     "IT",
    //     "Business Development",
    //     "Manager Accounting",
    //     "Assistant Manager Accounting",
    //     "Head Accounting",
    //   ],
    // },
    // {
    //   title: "Bar Chart",
    //   to: "/bar",
    //   icon: <BarChartOutlinedIcon />,
    //   roles: [
    //     "IT",
    //     "Business Development",
    //     "Manager Accounting",
    //     "Assistant Manager Accounting",
    //     "Head Accounting",
    //   ],
    // },
    // {
    //   title: "Pie Chart",
    //   to: "/pie",
    //   icon: <PieChartOutlineOutlinedIcon />,
    //   roles: [
    //     "IT",
    //     "Business Development",
    //     "Manager Accounting",
    //     "Assistant Manager Accounting",
    //     "Head Accounting",
    //   ],
    // },
    // {
    //   title: "Line Chart",
    //   to: "/line",
    //   icon: <TimelineOutlinedIcon />,
    //   roles: [
    //     "IT",
    //     "Business Development",
    //     "Manager Accounting",
    //     "Assistant Manager Accounting",
    //     "Head Accounting",
    //   ],
    // },
    // {
    //   title: "Geography Chart",
    //   to: "/geography",
    //   icon: <MapOutlinedIcon />,
    //   roles: [
    //     "IT",
    //     "Business Development",
    //     "Manager Accounting",
    //     "Assistant Manager Accounting",
    //     "Head Accounting",
    //   ],
    // },
    // {
    //   title: "Reservation Online",
    //   to: `http://localhost:5173/r/${branchCode}/gro`,
    //   icon: <MapOutlinedIcon />,
    //   roles: ["GRO"],
    // },
  ];

  // Filter menu berdasarkan role user
  const filteredMenuItems = menuItems.filter((menu) =>
    menu.roles.includes(user.role)
  );

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  Bandjakmin
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={user.photo}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user.name || "Nama User"}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {user.role || "Role User"}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {filteredMenuItems.map((menu) => (
              <Item
                key={menu.to}
                title={menu.title}
                to={menu.to}
                icon={menu.icon}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
