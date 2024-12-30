import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { format } from "date-fns";
import { fetchReservationsByBranchCodes } from "../../data/reservationData";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const branchCodes =
        JSON.parse(localStorage.getItem("userData")).branchCode || [];

      const reservations = await fetchReservationsByBranchCodes(branchCodes);

      const groupedData = reservations.reduce((acc, reservation) => {
        if (reservation.status === "PAID") {
          const date = reservation.date;
          const statusKey = reservation.arrivalStatus;

          if (!acc[date]) {
            acc[date] = { Pending: 0, Confirmed: 0 };
          }

          if (statusKey === "Pending Confirmation") {
            acc[date].Pending += 1;
          } else if (statusKey === "Confirmed") {
            acc[date].Confirmed += 1;
          }
        }
        return acc;
      }, {});

      const eventsData = [];
      Object.keys(groupedData).forEach((date) => {
        const { Pending, Confirmed } = groupedData[date];

        if (Pending > 0) {
          eventsData.push({
            id: `${date}-pending`,
            title: `PENDING: ${Pending}`,
            start: date,
            allDay: true,
            backgroundColor: "red",
            borderColor: "red",
          });
        }

        if (Confirmed > 0) {
          eventsData.push({
            id: `${date}-confirmed`,
            title: `CONFIRMED: ${Confirmed}`,
            start: date,
            allDay: true,
            backgroundColor: "blue",
            borderColor: "blue",
          });
        }
      });

      return eventsData;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadEvents = async () => {
      const fetchedEvents = await fetchReservations();
      setEvents(fetchedEvents);
    };
    loadEvents();
  }, []);

  const handleEventClick = (info) => {
    const eventColor = info.event.backgroundColor;
    const localDate = format(new Date(info.event.start), "yyyy-MM-dd");

    if (eventColor === "red") {
      navigate(`/pending_reservation?date=${localDate}`);
    } else if (eventColor === "blue") {
      navigate(`/confirmed_reservation?date=${localDate}`);
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Reservation Calendar"
        subtitle="Reservation Summary Calendar"
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
            editable={true}
            selectable={true}
            dayMaxEvents={true}
            events={events}
            eventClick={handleEventClick}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
