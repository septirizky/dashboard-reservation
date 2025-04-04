import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Login from "./scenes/login";
import Customers from "./scenes/customers";
import ProtectedRoute from "./scenes/protectedRoute";
import Unauthorized from "./scenes/unauthorized";
import OrderSummary from "./scenes/orderSummary";
import PendingReservation from "./scenes/reservations/pendingReservation";
import ConfirmedReservation from "./scenes/reservations/confirmedReservation";
import Disbursement from "./scenes/disbursement/disbursement";
import DisbursementList from "./scenes/disbursement/disbursementList";
import AddConfigPage from "./scenes/form/config";
import AddUserPage from "./scenes/form/user";
import ConfigMenu from "./scenes/config/menu";
import ConfigPrivasi from "./scenes/config/privasi";
import Configuration from "./scenes/config/configuration";
import BranchQuota from "./scenes/branch/branchQuota";
import Branch from "./scenes/branch/branch";
// import CategoryData from "./scenes/category";
// import MenuData from "./scenes/menu";
// import OptionData from "./scenes/option";
// import ItemOptionData from "./scenes/itemOption";
// import OptionPackageData from "./scenes/optionPackage";
// import ItemPackageData from "./scenes/itemPackage";
// import AddIDdiItemOption from "./scenes/itemOption/addID";
// import AddCategoryid from "./scenes/menu/addCategoryid";
import Category from "./scenes/category/category";
import Menu from "./scenes/menu/menu";
import Option from "./scenes/option/option";
import ItemOption from "./scenes/itemOption/itemOption";
import VerifyOTP from "./scenes/verify";
import OptionPackage from "./scenes/optionPackage/optionPackage";
import ItemPackage from "./scenes/itemPackage/itemPackage";
import ListCancel from "./scenes/cancel";
import ReservationMonthlyReport from "./scenes/report/monthlyReservation";
import ReservationDailyReport from "./scenes/report/dailyReservation";
import PaymentMonthlyReport from "./scenes/report/monthlyPayment";
import PaymentDailyReport from "./scenes/report/dailyPayment";
import ItemMenuReport from "./scenes/report/itemMenu";
import CustomerReport from "./scenes/report/customer";
import Account from "./scenes/account";
import UpComingReservation from "./scenes/orderSummary/upcoming";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/verify-dashboard";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isLoginPage ? (
          <div className="login-page">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/verify-dashboard" element={<VerifyOTP />} />
            </Routes>
          </div>
        ) : (
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "IT",
                        "Business Development",
                        "Manager Accounting",
                        "Assistant Manager Accounting",
                        "Head Accounting",
                      ]}
                    >
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team"
                  element={
                    <ProtectedRoute allowedRoles={["IT"]}>
                      <Team />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/branch"
                  element={
                    <ProtectedRoute allowedRoles={["IT"]}>
                      <Branch />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "IT",
                        "Business Development",
                        "Manager Accounting",
                        "Assistant Manager Accounting",
                        "Head Accounting",
                        "Accounting",
                        "GRO",
                      ]}
                    >
                      <Calendar />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "IT",
                        "Business Development",
                        "Manager Accounting",
                        "Assistant Manager Accounting",
                        "Head Accounting",
                      ]}
                    >
                      <Customers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pending_reservation"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <PendingReservation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/confirmed_reservation"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <ConfirmedReservation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order_summary"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <OrderSummary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/upcoming"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <UpComingReservation />
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="/request_refund"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "IT",
                        "Business Development",
                        "Manager Accounting",
                        "Assistant Manager Accounting",
                        "Head Accounting",
                      ]}
                    >
                      <RequestRefunds />
                    </ProtectedRoute>
                  }
                /> */}
                <Route
                  path="/list_cancel"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "IT",
                        "Business Development",
                        "Manager Accounting",
                        "Assistant Manager Accounting",
                        "Head Accounting",
                        "GRO",
                      ]}
                    >
                      <ListCancel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/disbursement"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "Manager Accounting"]}>
                      <Disbursement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/disbursement_list"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "Manager Accounting"]}>
                      <DisbursementList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "Manager Accounting"]}>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reservation_monthly_report"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "Manager Accounting"]}>
                      <ReservationMonthlyReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reservation_daily_report"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "Manager Accounting"]}>
                      <ReservationDailyReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment_monthly_report"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "Manager Accounting"]}>
                      <PaymentMonthlyReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment_daily_report"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "Manager Accounting"]}>
                      <PaymentDailyReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/item_menu_report"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "Manager Accounting"]}>
                      <ItemMenuReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer_report"
                  element={
                    <ProtectedRoute
                      allowedRoles={["IT", "Manager Accounting", "GRO"]}
                    >
                      <CustomerReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/branch_quota"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <BranchQuota />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/config_menu"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <ConfigMenu />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/config_privasi"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <ConfigPrivasi />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/configuration"
                  element={
                    <ProtectedRoute allowedRoles={["IT"]}>
                      <Configuration />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/category"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <Category />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/menu"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <Menu />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/option"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <Option />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/item_option"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <ItemOption />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/option_package"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <OptionPackage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/item_package"
                  element={
                    <ProtectedRoute allowedRoles={["IT", "GRO"]}>
                      <ItemPackage />
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="/category_grist"
                  element={
                    <ProtectedRoute allowedRoles={["GRO"]}>
                      <CategoryData />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/menu_grist"
                  element={
                    <ProtectedRoute allowedRoles={["GRO"]}>
                      <MenuData />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add_categoryid"
                  element={
                    <ProtectedRoute allowedRoles={["GRO"]}>
                      <AddCategoryid />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/option_grist"
                  element={
                    <ProtectedRoute allowedRoles={["GRO"]}>
                      <OptionData />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/item_option_grist"
                  element={
                    <ProtectedRoute allowedRoles={["GRO"]}>
                      <ItemOptionData />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add_id"
                  element={
                    <ProtectedRoute allowedRoles={["GRO"]}>
                      <AddIDdiItemOption />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/option_package_grist"
                  element={
                    <ProtectedRoute allowedRoles={["GRO"]}>
                      <OptionPackageData />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/item_package_grist"
                  element={
                    <ProtectedRoute allowedRoles={["GRO"]}>
                      <ItemPackageData />
                    </ProtectedRoute>
                  }
                /> */}
                <Route
                  path="/add-user"
                  element={
                    <ProtectedRoute allowedRoles={["IT"]}>
                      <AddUserPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-config"
                  element={
                    <ProtectedRoute allowedRoles={["IT"]}>
                      <AddConfigPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
          </div>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
