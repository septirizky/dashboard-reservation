/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import {
  fetchReservationSummary,
  fetchReservationsByBranchCodes,
} from "../../data/reservationData";
import { createDisbursement } from "../../data/disbursementData";
import { toast, ToastContainer } from "react-toastify";
import { getAccounts } from "../../data/accountData";

const Disbursement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [summary, setSummary] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [reservationDetails, setReservationDetails] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [formData, setFormData] = useState({
    bankCode: "",
    accountHolderName: "",
    accountNumber: "",
    description: "",
  });

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);

  const handleRowClick = async (row) => {
    setSelectedRow(row);
    const branchCode = row.branchCode;

    try {
      const allReservations = await fetchReservationsByBranchCodes([
        branchCode,
      ]);

      const filteredReservations = allReservations.filter((reservation) => {
        const createdAt = new Date(reservation.createdAt);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 3);
        return (
          createdAt <= cutoffDate &&
          reservation.isDisbursed === false &&
          (reservation.status === "CANCELLED" ||
            reservation.status === "PAID" ||
            reservation.status === "COMPLETED")
        );
      });

      setReservationDetails(filteredReservations || []);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching reservation details:", error);
    }
  };

  const handleDisbursementClick = async (row) => {
    setSelectedRow(row);
    const branchCode = row.branchCode;

    try {
      const branchAccounts = accounts.filter(
        (account) => account.branchCode === branchCode
      );
      setFilteredAccounts(branchAccounts);

      const allReservations = await fetchReservationsByBranchCodes([
        branchCode,
      ]);

      const filteredReservations = allReservations.filter((reservation) => {
        const createdAt = new Date(reservation.createdAt);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 3);
        return (
          createdAt <= cutoffDate &&
          reservation.isDisbursed === false &&
          (reservation.status === "CANCELLED" ||
            reservation.status === "PAID" ||
            reservation.status === "COMPLETED")
        );
      });

      setReservationDetails(filteredReservations || []);
      setOpenFormModal(true);
    } catch (error) {
      console.error("Error fetching reservation details:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
    setReservationDetails([]);
  };

  const handleCloseFormModal = () => {
    setOpenFormModal(false);
    setSelectedRow(null);
    setFormData({
      bankCode: "",
      accountHolderName: "",
      accountNumber: "",
      description: "",
    });
  };

  const getDisbursements = async () => {
    try {
      const data = await fetchReservationSummary();

      const transformedData = data.map((reservation) => ({
        ...reservation,

        amountBeforeMDRFormatted: formatRupiah(
          reservation.amountBeforeMDR || 0
        ),
        amountAfterMDRFormatted: formatRupiah(reservation.amountAfterMDR || 0),
      }));

      setSummary(transformedData || []);
    } catch (error) {
      console.error("Error fetching disbursements:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const accountData = await getAccounts();
      setAccounts(accountData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
    getDisbursements();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const randomNumber = Math.floor(10000 + Math.random() * 90000);
      const date = new Date();
      const externalId = `${selectedRow.branchCode}${date.getFullYear()}${
        date.getMonth() + 1
      }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${randomNumber}`;

      const name = JSON.parse(localStorage.getItem("userData")).name;

      const reservationCodes = reservationDetails.map(
        (reservation) => reservation.reservationCode
      );

      const disbursementData = {
        external_id: externalId,
        name,
        amount: selectedRow.amountAfterMDR,
        branchName: selectedRow.branchName,
        branchCode: selectedRow.branchCode,
        bank_code: formData.bankCode,
        account_holder_name: formData.accountHolderName,
        account_number: formData.accountNumber,
        description: formData.description,
        reservationCode: reservationCodes,
      };

      await createDisbursement(disbursementData);

      toast.success("Disbursement request submitted successfully!", {
        autoClose: 2000,
      });
      getDisbursements();
      handleCloseFormModal();
    } catch (error) {
      console.error("Error submitting disbursement:", error);
      toast.error("Error submitting disbursement request.", {
        autoClose: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      field: "branchName",
      headerName: "Branch Name",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "branchCode",
      headerName: "Branch Code",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalReservations",
      headerName: "Total Reservations",
      flex: 0.3,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "amountBeforeMDRFormatted",
      headerName: "Amount Before MDR",
      flex: 0.4,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "amountAfterMDRFormatted",
      headerName: "Amount After MDR",
      flex: 0.4,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDisbursementClick(params.row)}
        >
          Disbursement
        </Button>
      ),
    },
  ];

  const tableModal = [
    {
      field: "reservationCode",
      headerName: "Reservation Code",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pax",
      headerName: "Pax",
      flex: 0.2,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "dp",
      headerName: "Amount",
      flex: 0.4,
      headerAlign: "center",
      align: "right",
      renderCell: (params) => formatRupiah(params.value),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="DISBURSEMENTS"
        subtitle="List of Reservation Summaries by Branch"
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
          rows={summary || []}
          columns={columns}
          getRowId={(row) => row.branchCode}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(params, event) => {
            const isButtonClick = event.target.tagName === "BUTTON";
            if (!isButtonClick) {
              handleRowClick(params.row);
            }
          }}
          sortModel={[{ field: "branchName", sort: "asc" }]}
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
            p: 4,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Reservation Details for {selectedRow?.branchName || ""}
          </Typography>
          <Box mt={2} sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={reservationDetails}
              columns={tableModal}
              getRowId={(row) => row.reservationCode}
              disableSelectionOnClick
              hideFooter={true}
            />
          </Box>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseModal}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <Modal open={openFormModal} onClose={handleCloseFormModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Disbursement Form
          </Typography>
          <Select
            name="bankCode"
            value={formData.bankCode}
            onChange={handleFormChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Bank Name
            </MenuItem>
            {filteredAccounts.map((account) => (
              <MenuItem key={account.accountId} value={account.bankName}>
                {account.bankName}
              </MenuItem>
            ))}
          </Select>
          <Select
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleFormChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Account Holder Name
            </MenuItem>
            {filteredAccounts.map((account) => (
              <MenuItem key={account.accountId} value={account.accountHolder}>
                {account.accountHolder}
              </MenuItem>
            ))}
          </Select>
          <Select
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleFormChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Account Number
            </MenuItem>
            {filteredAccounts.map((account) => (
              <MenuItem key={account.accountId} value={account.accountNumber}>
                {account.accountNumber}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
          />
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseFormModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleFormSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default Disbursement;
