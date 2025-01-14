/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button, Modal } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import {
  fetchReservationsByBranchCodes,
  updateReservation,
} from "../../data/reservationData";
import { createRefundRequest } from "../../data/refundData";
import { toast, ToastContainer } from "react-toastify";

const ConfirmedReservation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reservations, setReservations] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openRefundModal, setRefundModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelForm, setCancelForm] = useState({
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

  const handleOpenRefundModal = (reservation) => {
    setSelectedReservation(reservation);
    setRefundModal(true);
  };

  const handleCloseRefundModal = () => {
    setRefundModal(false);
    setCancelForm({
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

  const getReservations = async (date) => {
    try {
      const data = await fetchReservationsByBranchCodes(branchCodes);

      const paidReservations = data.filter(
        (reservation) =>
          reservation.status === "PAID" &&
          reservation.arrivalStatus === "Confirmed" &&
          reservation.date === date
      );

      const transformedData = paidReservations.map((reservation) => ({
        ...reservation,
        name: reservation.customer?.name || "",
        phone: reservation.customer?.phone || "",
        dp: reservation.dp || 0,
        dpFormatted: formatRupiah(reservation.dp || 0),
      }));

      setReservations(transformedData || []);
    } catch (error) {
      console.error("Error fetching or posting data:", error);
    }
  };

  useEffect(() => {
    getReservations(selectedDate);
  }, [selectedDate]);

  const processStatusUpdate = async (newRow) => {
    const { reservationId, arrivalStatus, status } = newRow;

    const updatedData = {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCancelForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleRefundSubmit = async () => {
    try {
      if (!cancelForm.reason) {
        toast.error("Field 'reason' harus diisi!", { autoClose: 2000 });
        return;
      }

      const refundData = {
        reservationCode: selectedReservation.reservationCode,
        reason: cancelForm.reason,
        amount: selectedReservation.dp,
      };

      await createRefundRequest(refundData);

      const updatedData = {
        ...selectedReservation,
        arrivalStatus: "Cancel",
        status: "REQUEST REFUND",
      };

      const updatedReservation = await processStatusUpdate(updatedData);

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
      getReservations(selectedDate);
      handleCloseRefundModal();
    } catch (error) {
      console.error("Error submitting refund request:", error);
      toast.error("Error submitting refund request.", { autoClose: 2000 });
    }
  };

  const handleSendWhatsApp = () => {
    const phone = selectedReservation?.phone || "";
    const name = selectedReservation?.name || "Customer";
    const date = selectedReservation?.date
      ? new Date(selectedReservation.date).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Tanggal tidak tersedia";
    const pax = selectedReservation?.pax || "0";
    const time = selectedReservation?.time || "Tidak spesifik";
    const area = selectedReservation?.tableAreaName || "";
    const branchName = selectedReservation?.branchName || "Restoran Kami";

    if (phone) {
      const message = `Kepada Yth Customer\n\n_Terima kasih telah melakukan reservasi di ${branchName}_\n\nNama        : ${name}\nTanggal    : ${date}\nJumlah     : ${pax} Pax\nJam          : ${time} WIB\nTempat     : ${area}\n\nDengan penuh hormat, kami ingin mengonfirmasi kembali kehadiran Anda. Kami mohon agar Anda hadir tepat waktu sesuai dengan jadwal reservasi, karena waktu reservasi tidak dapat diperpanjang. Apabila terjadi keterlambatan, tempat yang telah dipesan mungkin akan dialihkan sementara kepada tamu lain yang telah hadir. Namun, kami akan dengan senang hati membantu mencarikan tempat lain sesuai dengan ketersediaan yang ada.\n\nAtas perhatian dan waktunya kami ucapkan terima kasih.\n\nSalam hormat kami,\n${branchName}`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
    } else {
      toast.error("Nomor telepon tidak tersedia untuk pelanggan ini.");
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
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "tableName",
      headerName: "Table Numb",
      type: "string",
      flex: 0.4,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tableAreaName",
      headerName: "Area Name",
      flex: 0.4,
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
      headerName: "Date",
      flex: 0.3,
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
      flex: 0.4,
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
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleOpenRefundModal(params.row)}
        >
          Cancel
        </Button>
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
        title="CONFIRMED RESERVATIONS"
        subtitle={`Confirmed Reservations on ${new Date(
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
              <strong>Table Numb:</strong>{" "}
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
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSendWhatsApp}
              sx={{ mt: 2 }}
            >
              WhatsApp
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
            label="Reason"
            name="reason"
            value={cancelForm.reason}
            onChange={handleInputChange}
            multiline
            rows={4}
            required
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

export default ConfirmedReservation;
