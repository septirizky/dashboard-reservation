import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import SetMealOutlinedIcon from "@mui/icons-material/SetMealOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
// import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
// import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import LunchDiningOutlinedIcon from "@mui/icons-material/LunchDiningOutlined";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LiquorOutlinedIcon from "@mui/icons-material/LiquorOutlined";
import BrunchDiningOutlinedIcon from "@mui/icons-material/BrunchDiningOutlined";
import FlatwareOutlinedIcon from "@mui/icons-material/FlatwareOutlined";
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
      onClick={(event) => {
        event.stopPropagation();
        setSelected(to);
      }}
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
  const [groupOpenState, setGroupOpenState] = useState({
    disbursement: false,
    report: false,
    gro: false,
    itemOption: false,
    config: false,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser(userData);
    }
    setSelected(location.pathname);
  }, [location.pathname]);

  const toggleGroupOpen = (group) => {
    setGroupOpenState((prevState) => ({
      ...prevState,
      [group]: !prevState[group],
    }));
  };

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
    // {
    //   title: "Request Refund",
    //   to: "/request_refund",
    //   icon: <ReceiptOutlinedIcon />,
    //   roles: [
    //     "IT",
    //     "Business Development",
    //     "Manager Accounting",
    //     "Assistant Manager Accounting",
    //     "Head Accounting",
    //   ],
    // },
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

  const configItems = [
    {
      title: "Branch",
      to: "/branch",
      icon: <ReceiptOutlinedIcon />,
      roles: ["IT"],
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
  ];

  const disbursementItems = [
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
  ];

  const reportItems = [
    {
      title: "Reservation Monthly Report",
      to: "/reservation_monthly_report",
      icon: <CalendarMonthOutlinedIcon />,
      roles: ["IT", "Manager Accounting"],
    },
    {
      title: "Reservation Daily Report",
      to: "/reservation_daily_report",
      icon: <CalendarMonthOutlinedIcon />,
      roles: ["IT", "Manager Accounting"],
    },
    {
      title: "Payment Monthly Report",
      to: "/payment_monthly_report",
      icon: <RequestQuoteOutlinedIcon />,
      roles: ["IT", "Manager Accounting"],
    },
    {
      title: "Payment Daily Report",
      to: "/payment_daily_report",
      icon: <RequestQuoteOutlinedIcon />,
      roles: ["IT", "Manager Accounting"],
    },
    {
      title: "Item Menu Report",
      to: "/item_menu_report",
      icon: <LunchDiningOutlinedIcon />,
      roles: ["IT", "Manager Accounting"],
    },
    {
      title: "Customers Report",
      to: "/customer_report",
      icon: <ContactsOutlinedIcon />,
      roles: [
        "IT",
        "Business Development",
        "Manager Accounting",
        "Assistant Manager Accounting",
        "Head Accounting",
      ],
    },
    {
      title: "Cancellation List",
      to: "/list_cancel",
      icon: <CancelOutlinedIcon />,
      roles: [
        "IT",
        "Business Development",
        "Manager Accounting",
        "Assistant Manager Accounting",
        "Head Accounting",
        "GRO",
      ],
    },
  ];

  const groItems = [
    {
      title: "Quota Branch",
      to: "/branch_quota",
      icon: <EditCalendarIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Reservation Summary",
      to: "/calendar",
      icon: <CalendarTodayOutlinedIcon />,
      roles: ["IT", "GRO"],
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
  ];

  const itemOptionItems = [
    {
      title: "Category",
      to: "/category",
      icon: <FlatwareOutlinedIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Menu",
      to: "/menu",
      icon: <RestaurantMenuIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Option",
      to: "/option",
      icon: <LiquorOutlinedIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Item Option",
      to: "/item_option",
      icon: <BrunchDiningOutlinedIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Option Package",
      to: "/option_package",
      icon: <LunchDiningOutlinedIcon />,
      roles: ["IT", "GRO"],
    },
    {
      title: "Item Package",
      to: "/item_package",
      icon: <CountertopsOutlinedIcon />,
      roles: ["IT", "GRO"],
    },
  ];

  const filteredMenuItems = menuItems.filter((menu) =>
    menu.roles.includes(user.role)
  );

  const filteredConfigItems = configItems.filter((menu) =>
    menu.roles.includes(user.role)
  );

  const filteredDisbursementItems = disbursementItems.filter((menu) =>
    menu.roles.includes(user.role)
  );

  const filteredReportItems = reportItems.filter((menu) =>
    menu.roles.includes(user.role)
  );

  const filteredGroItems = groItems.filter((menu) =>
    menu.roles.includes(user.role)
  );

  const filtereditemOptionItems = itemOptionItems.filter((menu) =>
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

            {["IT", "Manager Accounting"].includes(user.role) && (
              <SubMenu
                title="Disbursement"
                style={{ color: colors.grey[100] }}
                icon={<AccountBalanceOutlinedIcon />}
                open={groupOpenState.disbursement}
                onClick={() => toggleGroupOpen("disbursement")}
              >
                {filteredDisbursementItems.map((menu) => (
                  <Item
                    key={menu.to}
                    title={menu.title}
                    to={menu.to}
                    icon={menu.icon}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ))}
              </SubMenu>
            )}

            {["IT", "GRO"].includes(user.role) && (
              <SubMenu
                title="Reservation Management"
                style={{ color: colors.grey[100] }}
                icon={<MenuBookIcon />}
                open={groupOpenState.gro}
                onClick={() => toggleGroupOpen("gro")}
              >
                {filteredGroItems.map((menu) => (
                  <Item
                    key={menu.to}
                    title={menu.title}
                    to={menu.to}
                    icon={menu.icon}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ))}
              </SubMenu>
            )}

            {["IT", "GRO"].includes(user.role) && (
              <SubMenu
                title="Item & Option"
                style={{ color: colors.grey[100] }}
                icon={<SetMealOutlinedIcon />}
                open={groupOpenState.itemOption}
                onClick={() => toggleGroupOpen("itemOption")}
              >
                {filtereditemOptionItems.map((menu) => (
                  <Item
                    key={menu.to}
                    title={menu.title}
                    to={menu.to}
                    icon={menu.icon}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ))}
              </SubMenu>
            )}

            {["IT", "Manager Accounting", "GRO"].includes(user.role) && (
              <SubMenu
                title="Report"
                style={{ color: colors.grey[100] }}
                icon={<AssessmentOutlinedIcon />}
                open={groupOpenState.report}
                onClick={() => toggleGroupOpen("report")}
              >
                {filteredReportItems.map((menu) => (
                  <Item
                    key={menu.to}
                    title={menu.title}
                    to={menu.to}
                    icon={menu.icon}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ))}
              </SubMenu>
            )}

            {user.role === "IT" && (
              <SubMenu
                title="Configuration"
                style={{ color: colors.grey[100] }}
                icon={<PermDataSettingIcon />}
                open={groupOpenState.config}
                onClick={() => toggleGroupOpen("config")}
              >
                {filteredConfigItems.map((menu) => (
                  <Item
                    key={menu.to}
                    title={menu.title}
                    to={menu.to}
                    icon={menu.icon}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ))}
              </SubMenu>
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
