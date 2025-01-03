/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import {
  fetchReservationsByBranchCodes,
  updateReservation,
} from "../../data/reservationData";
import { fetchTableAreasByBranchCode } from "../../data/tableAreaData";
import { toast, ToastContainer } from "react-toastify";
import { createRefundRequest } from "../../data/refundData";

const PendingReservation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reservations, setReservations] = useState([]);
  const [areaOptions, setAreaOptions] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openRefundModal, setRefundModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    tableName: "",
    tableAreaName: "",
  });
  const [refundForm, setRefundForm] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    phone: "",
    reason: "",
  });
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedDate =
    query.get("date") || new Date().toISOString().split("T")[0];

  const handleOpenModal = (reservationCode) => {
    const reservation = reservations.find(
      (res) => res.reservationCode === reservationCode
    );
    setSelectedReservation(reservation || null);
    setSelectedItems(reservation?.items || []);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItems([]);
  };

  const handleOpenUpdateModal = (reservation) => {
    setSelectedReservation(reservation);
    setUpdateForm({
      tableName: reservation.tableName || "",
      tableAreaName: reservation.tableAreaName || "",
    });
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleOpenRefundModal = (reservation) => {
    setSelectedReservation(reservation);
    setRefundModal(true);
  };

  const handleCloseRefundModal = () => {
    setRefundModal(false);
    setRefundForm({
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      phone: "",
      reason: "",
    });
  };

  const formatRupiah = (number) =>
    number.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const branchCodes =
    JSON.parse(localStorage.getItem("userData")).branchCode || [];

  const fetchTableAreas = async () => {
    try {
      const options = {};
      for (const branchCode of branchCodes) {
        const data = await fetchTableAreasByBranchCode(branchCode);
        options[branchCode] = data.map((item) => item.AreaName);
      }
      setAreaOptions(options);
    } catch (error) {
      console.error("Error fetching table areas:", error);
    }
  };

  const getReservations = async () => {
    try {
      const data = await fetchReservationsByBranchCodes(branchCodes);

      const paidReservations = data.filter(
        (reservation) =>
          reservation.date === selectedDate &&
          reservation.status === "PAID" &&
          reservation.arrivalStatus === "Pending Confirmation"
      );

      const transformedData = paidReservations.map((reservation) => ({
        ...reservation,
        name: reservation.customer?.name || "",
        phone: reservation.customer?.phone || "",
        tableAreaName: reservation.tableAreaName,
        dp: reservation.dp || 0,
        dpFormatted: formatRupiah(reservation.dp || 0),
        totalAmountFormatted: formatRupiah(reservation.totalAmount || 0),
      }));

      setReservations(transformedData || []);
    } catch (error) {
      console.error("Error fetching or posting data:", error);
    }
  };

  useEffect(() => {
    fetchTableAreas();
    getReservations();
  }, [selectedDate]);

  const processModalUpdate = async (newRow) => {
    const { reservationId, tableName, tableAreaName, arrivalStatus, status } =
      newRow;

    const updatedData = {
      tableName,
      tableAreaName,
      arrivalStatus,
      status,
    };

    try {
      const response = await updateReservation(reservationId, updatedData);
      return { ...newRow, ...response.data };
    } catch (error) {
      console.error("Error updating reservation:", error);
      throw error;
    }
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUpdate = async () => {
    try {
      const updatedData = {
        ...selectedReservation,
        tableName: updateForm.tableName,
        tableAreaName: updateForm.tableAreaName,
        arrivalStatus: "Confirmed",
      };

      const updatedReservation = await processModalUpdate(updatedData);

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.reservationId === updatedReservation.reservationId
            ? updatedReservation
            : reservation
        )
      );
      toast.success("Confirmed save successfully!", {
        autoClose: 2000,
      });
      getReservations();
      handleCloseUpdateModal();
    } catch (error) {
      console.error("Error saving update:", error);
      toast.error("Error saving update:", error, { autoClose: 2000 });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRefundForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleRefundSubmit = async () => {
    try {
      if (!refundForm.reason) {
        toast.error("Field 'reason' harus diisi!", { autoClose: 2000 });
        return;
      }

      const refundData = {
        reservationCode: selectedReservation.reservationCode,
        bank_name: refundForm.bankName,
        account_number: refundForm.accountNumber,
        account_holder: refundForm.accountHolder,
        phone: refundForm.phone || reservations.phone,
        reason: refundForm.reason,
        amount: selectedReservation.dp,
      };

      await createRefundRequest(refundData);

      const updatedData = {
        ...selectedReservation,
        arrivalStatus: "Cancel",
        status: "REQUEST REFUND",
      };

      const updatedReservation = await processModalUpdate(updatedData);

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.reservationId === updatedReservation.reservationId
            ? updatedReservation
            : reservation
        )
      );

      toast.success("Refund request submitted successfully!", {
        autoClose: 2000,
      });
      getReservations();
      handleCloseRefundModal();
    } catch (error) {
      console.error("Error submitting refund request:", error);
      toast.error("Error submitting refund request.", { autoClose: 2000 });
    }
  };

  const columns = [
    {
      field: "reservationCode",
      headerName: "Reservation Code",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "branchName",
      headerName: "Branch Name",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "tableName",
      headerName: "Table Numb",
      type: "string",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "arrivalStatus",
      headerName: "Arrival Status",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const date = new Date(params.row.createdAt);
        return date.toLocaleDateString("id-ID");
      },
    },
    {
      field: "date",
      headerName: "Reservation Date",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const date = new Date(params.row.date);
        return date.toLocaleDateString("id-ID");
      },
    },
    {
      field: "time",
      headerName: "Time",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pax",
      headerName: "Pax",
      type: "number",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dpFormatted",
      headerName: "DP",
      flex: 0.3,
      headerAlign: "center",
      align: "right",
      renderCell: (params) => (
        <div
          style={{ position: "relative", width: "100%", textAlign: "right" }}
        >
          <span
            style={{
              position: "absolute",
              left: 0,
            }}
          >
            Rp
          </span>
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.6,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box display="flex" gap={1} mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleOpenUpdateModal(params.row)}
          >
            Confirmed
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleOpenRefundModal(params.row)}
          >
            Cancel
          </Button>
        </Box>
      ),
    },
  ];

  const itemsColumns = [
    {
      field: "MenuName",
      headerName: "Menu Name",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "CategoryName",
      headerName: "Category Name",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "OptionName",
      headerName: "Option Name",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "quantities",
      headerName: "Qty",
      headerAlign: "center",
      align: "right",
      flex: 0.5,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="PENDING RESERVATIONS"
        subtitle={`Pending Reservations on ${new Date(
          selectedDate
        ).toLocaleDateString("id-ID")}`}
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            fontSize: "0.9rem",
            fontWeight: "bold",
          },
        }}
      >
        <DataGrid
          rows={reservations || []}
          columns={columns}
          getRowId={(row) => row.reservationId || ""}
          components={{ Toolbar: GridToolbar }}
          processModalUpdate={processModalUpdate}
          onRowClick={(params, event) => {
            const isButtonClick = event.target.tagName === "BUTTON";
            if (!isButtonClick) {
              handleOpenModal(params.row.reservationCode);
            }
          }}
        />
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Reservation Details
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap={2}
            mb={3}
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? colors.primary[700]
                  : colors.grey[200],
              color:
                theme.palette.mode === "dark"
                  ? colors.grey[100]
                  : colors.grey[800],
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography>
              <strong>Name:</strong> {selectedReservation?.name || ""}
            </Typography>
            <Typography>
              <strong>Pax:</strong> {selectedReservation?.pax || ""}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {selectedReservation?.phone || ""}
            </Typography>
            <Typography>
              <strong>Area Name:</strong>{" "}
              {selectedReservation?.tableAreaName || ""}
            </Typography>
            <Typography>
              <strong>Date:</strong>{" "}
              {new Date(selectedReservation?.date || "").toLocaleDateString(
                "id-ID"
              ) || ""}
            </Typography>
            <Typography>
              <strong>Table Number:</strong>{" "}
              {selectedReservation?.tableName || ""}
            </Typography>
            <Typography>
              <strong>Time:</strong> {selectedReservation?.time || ""}
            </Typography>
            <Typography>
              <strong>Served:</strong> {selectedReservation?.served || ""}
            </Typography>
            <Typography>
              <strong>Note:</strong> {selectedReservation?.note || ""}
            </Typography>
            <Typography>
              <strong>Note Reservation:</strong>{" "}
              {selectedReservation?.noteReservation || ""}
            </Typography>
          </Box>
          <Box mt={2} height="400px">
            <DataGrid
              rows={selectedItems || []}
              columns={itemsColumns}
              getRowId={(row) => row._id || Math.random()}
              disableSelectionOnClick
              hideFooter={true}
            />
          </Box>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
      <Modal open={openUpdateModal} onClose={handleCloseUpdateModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            Update Reservation
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Table Name"
            name="tableName"
            value={updateForm.tableName}
            onChange={handleUpdateInputChange}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Table Area Name"
            name="tableAreaName"
            value={updateForm.tableAreaName}
            onChange={handleUpdateInputChange}
          >
            {(areaOptions[selectedReservation?.branchCode] || []).map(
              (area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              )
            )}
          </TextField>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseUpdateModal}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveUpdate}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openRefundModal} onClose={handleCloseRefundModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            Refund Form
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Bank Name"
            name="bankName"
            value={refundForm.bankName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Account Number"
            name="accountNumber"
            value={refundForm.accountNumber}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Account Holder"
            name="accountHolder"
            value={refundForm.accountHolder}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={refundForm.phone}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="reason"
            name="reason"
            value={refundForm.reason}
            onChange={handleInputChange}
            multiline
            rows={4} // Menjadikan textarea lebih luas
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseRefundModal}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRefundSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default PendingReservation;
