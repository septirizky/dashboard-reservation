/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Switch,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import {
  getAllBranchQuotas,
  getBranchQuota,
  postBranchQuota,
} from "../../data/branchQuota";
import { fetchReservationsByBranchCodes } from "../../data/reservationData";
import { toast, ToastContainer } from "react-toastify";

const BranchQuota = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [quotaData, setQuotaData] = useState([]);
  const [events, setEvents] = useState([]);

  const branchCode =
    JSON.parse(localStorage.getItem("userData")).branchCode[0] || "";

  const fetchQuotaAndPaxEvents = async () => {
    try {
      const fetchedQuota = await getAllBranchQuotas(branchCode);
      const reservations = await fetchReservationsByBranchCodes([branchCode]);

      const today = new Date().toISOString().split("T")[0];
      const paxData = reservations.reduce((acc, reservation) => {
        if (reservation.status === "PAID") {
          const date = reservation.date;
          acc[date] = (acc[date] || 0) + (reservation.pax || 0);
        }
        return acc;
      }, {});

      const eventsData = [];

      fetchedQuota.forEach((item) => {
        const totalPaxs = paxData[item.date] || 0;
        const remainingQuota = item.totalQuota - totalPaxs;

        // Jika tanggal sudah lewat, hanya tampilkan event tertentu
        if (item.date < today) {
          eventsData.push({
            id: `${item.date}-past-quota`,
            title: `Total Pax: ${totalPaxs}`,
            start: item.date,
            allDay: true,
            backgroundColor: "#d3d3d3", // Warna abu-abu
            borderColor: "#a0a0a0",
            textColor: "black",
          });
        } else {
          // Event untuk tanggal yang belum lewat
          eventsData.push({
            id: `${item.date}-quota`,
            title: `Total Quota: ${item.totalQuota}`,
            start: item.date,
            allDay: true,
            backgroundColor: "blue",
            borderColor: "blue",
            textColor: "white",
          });

          eventsData.push({
            id: `${item.date}-pax`,
            title: `Total Pax: ${totalPaxs}`,
            start: item.date,
            allDay: true,
            backgroundColor: "#00897B",
            borderColor: "#004D40",
            textColor: "white",
          });

          eventsData.push({
            id: `${item.date}-remaining`,
            title: `Quota Sisa: ${remainingQuota}`,
            start: item.date,
            allDay: true,
            backgroundColor: "red",
            borderColor: "red",
            textColor: "white",
          });
        }
      });

      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching quota or pax data:", error);
    }
  };

  useEffect(() => {
    fetchQuotaAndPaxEvents();
  }, []);

  const handleEventClick = (info) => {
    const date = info.event.startStr;
    setSelectedDate(date);
    handleDateClick({ dateStr: date });
  };

  const handleDateClick = async (info) => {
    const date = info.dateStr;
    setSelectedDate(date);

    try {
      const fetchedQuota = await getBranchQuota(branchCode, date);

      const initialQuota = [];
      for (let i = 10; i <= 21; i++) {
        const existingQuota = fetchedQuota.find(
          (item) => item.time === `${i}:00`
        );
        initialQuota.push({
          id: `${date}-${i}:00`,
          date: date,
          time: `${i}:00`,
          quota: existingQuota ? existingQuota.quota : 0,
          show: existingQuota ? existingQuota.show : true,
        });
      }

      setQuotaData(initialQuota);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching quota data:", error);
    }
  };

  const handleShowChange = (id, value) => {
    const updatedQuota = quotaData.map((item) =>
      item.id === id ? { ...item, show: value } : item
    );
    setQuotaData(updatedQuota);
  };

  const handleSave = async () => {
    try {
      for (const row of quotaData) {
        const payload = {
          branchCode: branchCode,
          date: row.date,
          time: row.time,
          quota: row.quota,
          show: row.show,
        };
        await postBranchQuota(payload);
      }
      toast.success("Quota data saved successfully!", {
        autoClose: 2000,
      });
      setOpenModal(false);
      fetchQuotaAndPaxEvents();
    } catch (error) {
      console.error("Error saving quota data:", error);
      toast.error("Failed to save quota data.", { autoClose: 2000 });
    }
  };

  const handleQuotaChange = (id, value) => {
    const updatedQuota = quotaData.map((item) =>
      item.id === id ? { ...item, quota: parseInt(value, 10) || 0 } : item
    );
    setQuotaData(updatedQuota);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box m="20px">
      <Header
        title="Branch Quota Management"
        subtitle="Branch Quota Management Calendar"
      />
      <Box display="flex" justifyContent="space-between">
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth",
            }}
            initialView="dayGridMonth"
            events={events}
            dateClick={(info) => {
              const today = new Date().toISOString().split("T")[0];
              if (info.dateStr < today) {
                return;
              }
              handleDateClick(info);
            }}
            eventClick={(info) => {
              const today = new Date().toISOString().split("T")[0];
              if (info.event.startStr < today) {
                return;
              }
              handleEventClick(info);
            }}
          />
        </Box>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: 800 },
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Edit Quota for {selectedDate}
          </Typography>

          <Box
            mt={2}
            sx={{ height: { xs: 400, sm: 500, md: 685 }, width: "100%" }}
          >
            <DataGrid
              rows={quotaData}
              columns={[
                { field: "time", headerName: "Time", flex: 1 },
                {
                  field: "quota",
                  headerName: "Quota",
                  flex: 1,
                  renderCell: (params) => (
                    <TextField
                      type="number"
                      size="small"
                      value={params.row.quota}
                      onChange={(e) =>
                        handleQuotaChange(params.row.id, e.target.value)
                      }
                      inputProps={{ min: 0 }}
                    />
                  ),
                },
                {
                  field: "show",
                  headerName: "Show",
                  flex: 1,
                  renderCell: (params) => (
                    <Switch
                      checked={params.row.show || false}
                      onChange={(e) =>
                        handleShowChange(params.row.id, e.target.checked)
                      }
                      color="secondary"
                    />
                  ),
                },
              ]}
              getRowId={(row) => row.id}
              hideFooter={true}
            />
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModal}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSave}
              sx={{ ml: 2 }}
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

export default BranchQuota;
