import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Typography,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  fetchInvoicesByBranchCodes,
  updateRefundStatus,
} from "../../data/invoiceData";
import { createRefundRequest } from "../../data/refundData";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [invoices, setInvoices] = useState([]);
  const [openModal, setOpenModal] = useState(false); // State untuk modal
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Invoice yang dipilih
  const [refundForm, setRefundForm] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    phone: "",
  }); // State untuk data form refund

  useEffect(() => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];

    const getInvoices = async () => {
      const data = await fetchInvoicesByBranchCodes(branchCodes);

      // Proses data untuk menambahkan kolom yang diperlukan
      const filteredInvoices = data
        .filter((invoice) => invoice.status === "Lunas")
        .map((invoice) => ({
          ...invoice,
          paid_amount_formatted: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(invoice.paid_amount || 0), // Format paid_amount
          mdr_percent: (invoice.mdr * 100).toFixed(1) + "%", // Format MDR sebagai persen
          amount_after_mdr:
            invoice.paid_amount - invoice.paid_amount * invoice.mdr || 0, // Hitung amount setelah MDR
        }));

      setInvoices(filteredInvoices); // Simpan data ke state
    };

    getInvoices();
  }, []);

  const handleOpenModal = (invoice) => {
    setSelectedInvoice(invoice); // Set invoice yang dipilih
    setOpenModal(true); // Buka modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Tutup modal
    setRefundForm({
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      phone: "",
    }); // Reset form
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRefundForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleRefundSubmit = async () => {
    try {
      if (
        !refundForm.bankName ||
        !refundForm.accountNumber ||
        !refundForm.accountHolder ||
        !refundForm.phone
      ) {
        toast.error("Semua field harus diisi!", { autoClose: 3000 });
        return;
      }

      // Data untuk dikirim ke endpoint create refund
      const refundData = {
        external_id: selectedInvoice.external_id,
        bank_name: refundForm.bankName,
        account_number: refundForm.accountNumber,
        account_holder: refundForm.accountHolder,
        phone: refundForm.phone,
      };

      // Kirim request untuk create refund
      await createRefundRequest(refundData);

      // Update refund_status pada invoice
      await updateRefundStatus(selectedInvoice.external_id, "Request Refund");

      // Perbarui state invoices secara langsung
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.external_id === selectedInvoice.external_id
            ? { ...invoice, refund_status: "Request Refund" }
            : invoice
        )
      );

      toast.success("Refund request submitted successfully!", {
        autoClose: 3000,
      });
      handleCloseModal(); // Tutup modal dan reset form
    } catch (error) {
      console.error("Error submitting refund request:", error);
      toast.error("Error submitting refund request.", { autoClose: 3000 });
    }
  };

  const columns = [
    {
      field: "external_id",
      headerName: "External ID",
      flex: 0.6,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reservationCode",
      headerName: "Reservation Code",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "refund_status",
      headerName: "Refund Status",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paid_amount_formatted",
      headerName: "Paid Amount",
      flex: 0.5,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "mdr_percent",
      headerName: "MDR (%)",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "amount_after_mdr",
      headerName: "Amount After MDR",
      flex: 0.5,
      headerAlign: "center",
      align: "center", 
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center", 
            justifyContent: "right", 
            height: "100%", 
          }}
        >
          <Typography color={colors.greenAccent[500]}>
            Rp{" "}
            {new Intl.NumberFormat("id-ID").format(params.row.amount_after_mdr)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "paid_at",
      headerName: "Paid At",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const date = new Date(params.row.paid_at);
        return date.toLocaleString("id-ID");
      },
    },
    {
      field: "payment_method",
      headerName: "Payment Method",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "payment_destination",
      headerName: "Payment Destination",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.4,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary" // Gunakan warna default yang sesuai
          onClick={() => handleOpenModal(params.row)} // Buka modal dengan data invoice
          disabled={
            params.row.refund_status === "Request Refund" ||
            params.row.refund_status === "Accepted" ||
            params.row.refund_status === "Declined"
          }
        >
          Refund
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Paid Invoice Balances" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            color: theme.palette.mode === "dark" ? "#fff" : "#000", // Warna teks tergantung mode
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            color: theme.palette.mode === "dark" ? "#fff" : "#000", // Warna teks tergantung mode
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            fontSize: "0.9rem",
            fontWeight: "bold",
            color: theme.palette.mode === "dark" ? "#fff" : "#000", // Warna teks tergantung mode
          },
        }}
      >
        <DataGrid
          rows={invoices}
          columns={columns}
          getRowId={(row) => row.external_id}
        />
      </Box>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
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
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModal}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRefundSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default Invoices;
