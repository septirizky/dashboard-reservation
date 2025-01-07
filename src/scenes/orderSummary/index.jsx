import { useEffect, useState } from "react";
import { Box, TextField, Button, Menu, MenuItem } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { fetchReservationsByBranchCodes } from "../../data/reservationData";
import { v4 as uuidv4 } from "uuid";

const OrderSummary = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [summaryData, setSummaryData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePrintMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePrintMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const formatRp = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(number)
      .replace("Rp", "Rp ");
  };

  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handlePrintAll = () => {
    handlePrintMenuClose();

    const selectedDateFormatted = formatDate(selectedDate);

    // Gabungkan Menu Name yang sama dan jumlahkan Qty
    const aggregatedData = summaryData.reduce((acc, row) => {
      const existingMenu = acc.find((item) => item.menuName === row.menuName);
      if (existingMenu) {
        existingMenu.quantities += row.quantities;
      } else {
        acc.push({
          menuName: row.menuName,
          quantities: row.quantities,
        });
      }
      return acc;
    }, []);

    // Buat baris tabel hanya dengan Menu Name dan Qty
    const rows = aggregatedData
      .map(
        (item) => `
          <tr>
            <td>${item.menuName}</td>
            <td style="text-align: right;">${item.quantities}</td>
          </tr>
        `
      )
      .join("");

    const printContent = `
      <h2 style="text-align: center;">Order Summary ${selectedDateFormatted}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 5px; font-size: 12px;">Menu Name</th>
            <th style="border: 1px solid #ddd; padding: 5px; font-size: 12px;">Qty</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;

    // Gunakan iframe untuk print
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(`
      <html>
        <head>
          <title>Print Semua</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #004d99;
              color: white;
              font-size: 12px;
            }
            td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-size: 11px;
            }
            td:last-child {
              text-align: right;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    iframeDocument.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    iframe.addEventListener("afterprint", () => {
      document.body.removeChild(iframe);
    });
  };

  const handlePrintPerReservation = () => {
    handlePrintMenuClose();

    const groupedData = summaryData.reduce((acc, row) => {
      if (!acc[row.reservationCode]) {
        acc[row.reservationCode] = [];
      }
      acc[row.reservationCode].push(row);
      return acc;
    }, {});

    const printContent = Object.keys(groupedData)
      .map((reservationCode) => {
        const reservationDetails = groupedData[reservationCode][0];
        const customerName = reservationDetails.customer?.name || "N/A";
        const customerPhone = reservationDetails.customer?.phone || "N/A";
        const formattedDate = formatDate(reservationDetails.date);
        const dpFormatted = formatRp(reservationDetails.dp || 0);

        const rows = groupedData[reservationCode]
          .map(
            (row) => `
            <tr>
              <td>${row.menuName}</td>
              <td style="text-align: right;">${row.quantities}</td>
              <td>${row.option || "-"}</td>
              <td style="text-align: left;">
                <span style="float: left;">Rp.</span>
                <span style="float: right;">${formatRupiah(
                  row.menuPrice
                )}</span>
              </td>
              <td style="text-align: left;">
                <span style="float: left;">Rp.</span>
                <span style="float: right;">${formatRupiah(
                  row.quantities * row.menuPrice || 0
                )}</span>
              </td>
            </tr>
          `
          )
          .join("");

        return `
          <!-- Informasi Pemesan -->
          <div style="margin-bottom: 15px; font-size: 12px; line-height: 1.6;">
            <p><strong>Nama</strong> : ${customerName}</p>
            <p><strong>Pax</strong> : ${reservationDetails.pax} Pax</p>
            <p><strong>No. Telepon</strong> : ${customerPhone}</p>
            <p><strong>Area / No Table</strong> : ${
              reservationDetails.tableAreaName
            } / ${reservationDetails.tableName}</p>
            <p><strong>Tanggal Reservasi</strong> : ${formattedDate}</p>
            <p><strong>Jam Reservasi</strong> : ${reservationDetails.time}</p>
            <p><strong>Catatan</strong> : ${reservationDetails.note || "-"}</p>
            <p><strong>Catatan Khusus</strong> : ${
              reservationDetails.noteReservation || "-"
            }</p>
            <p><strong>Penyajian</strong> : ${reservationDetails.served}</p>
            <p><strong>DP</strong> : ${dpFormatted || "-"}</p>
            <p><strong>Resevation Code</strong> : ${
              reservationDetails.reservationCode || "-"
            }</p>
          </div>
      
          <!-- Tabel Data -->
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 5px;">Menu Name</th>
                <th style="border: 1px solid #ddd; padding: 5px;">Qty</th>
                <th style="border: 1px solid #ddd; padding: 5px;">Option</th>
                <th style="border: 1px solid #ddd; padding: 5px;">Harga</th>
                <th style="border: 1px solid #ddd; padding: 5px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div style="page-break-after: always;"></div>
        `;
      })
      .join("");

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(`
      <html>
        <head>
          <title>Order Summary</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 12px;
            }
            p {
              margin: 5px 0;
            }
            strong {
              display: inline-block;
              width: 150px; /* Sejajarkan label */
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            td {
              border: 1px solid #ddd;
              padding: 5px;
              text-align: left;
            }
            th {
              background-color: #004d99;
              color: white;
              border: 1px solid #ddd;
              padding: 5px;
              text-align: center;
            }
            h2 {
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    iframeDocument.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    iframe.addEventListener("afterprint", () => {
      document.body.removeChild(iframe);
    });
  };

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const branchCodes =
          JSON.parse(localStorage.getItem("userData")).branchCode || [];

        const reservations = await fetchReservationsByBranchCodes(branchCodes);

        const filteredReservations = reservations.filter(
          (reservation) =>
            reservation.status === "PAID" &&
            reservation.arrivalStatus === "Confirmed" &&
            reservation.date === selectedDate
        );

        const processedData = filteredReservations.flatMap((reservation) => {
          if (!reservation.items || reservation.items.length === 0) {
            return [];
          }

          return reservation.items.flatMap((item) => {
            const itemRows = [];

            itemRows.push({
              id: uuidv4(),
              reservationCode: reservation.reservationCode || "",
              date: reservation.date || "",
              time: reservation.time || "",
              tableName: reservation.tableName || "",
              tableAreaName: reservation.tableAreaName || "",
              menuName: item.MenuName || "N/A",
              quantities: item.quantities || 0,
              option: item.OptionName || "-",
              menuPrice: item.MenuPrice || 0,
              pax: reservation.pax || 0,
              customer: reservation.customer,
              dp: reservation.dp || 0,
              note: reservation.note || "",
              noteReservation: reservation.noteReservation || "",
              served: reservation.served || "",
            });

            if (item.ItemDetails) {
              item.ItemDetails.forEach((detail) => {
                itemRows.push({
                  id: uuidv4(),
                  reservationCode: reservation.reservationCode || "",
                  date: reservation.date || "",
                  time: reservation.time || "",
                  tableName: reservation.tableName || "",
                  tableAreaName: reservation.tableAreaName || "",
                  menuName: `(paket) ${detail.ItemPackageDetail}`,
                  quantities: detail.ItemPackageDetailQty || 0,
                  option: detail.ItemOptionPackage || "-",
                  menuPrice: detail.ItemPackageDetailPrice || 0,
                });
              });
            }

            return itemRows;
          });
        });

        setSummaryData(processedData);
      } catch (error) {
        console.error("Error fetching order summary:", error);
      }
    };

    fetchSummaryData();
  }, [selectedDate]);

  const formatRupiah = (number) =>
    number.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const columns = [
    {
      field: "reservationCode",
      headerName: "Reservation Code",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
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
      field: "tableName",
      headerName: "Table Name",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tableAreaName",
      headerName: "Table Area Name",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "menuName",
      headerName: "Menu Name",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "quantities",
      headerName: "Qty",
      flex: 0.3,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "option",
      headerName: "Option",
      flex: 0.6,
      headerAlign: "center",
      align: "left",
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="ORDER SUMMARY"
        subtitle="Summary of Orders by Date and Time"
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          label="Filter by Date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          sx={{ width: "250px" }}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePrintMenuOpen}
        >
          Print Data
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handlePrintMenuClose}
        >
          <MenuItem onClick={handlePrintAll}>Print Semua</MenuItem>
          <MenuItem onClick={handlePrintPerReservation}>
            Print Per Reservation
          </MenuItem>
        </Menu>
      </Box>
      <Box
        m="40px 0 0 0"
        height="68vh"
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
          rows={summaryData}
          columns={columns}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* <Box
        id="print-area"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            color: "#fff",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            color: "#fff",
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
        <table>
          <thead>
            <tr>
              <th>Reservation Code</th>
              <th>Date</th>
              <th>Time</th>
              <th>Table Name</th>
              <th>Table Area Name</th>
              <th>Menu Name</th>
              <th>Quantities</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((row, index) => (
              <tr key={index}>
                <td>{row.reservationCode}</td>
                <td>{row.date}</td>
                <td>{row.time}</td>
                <td>{row.tableName}</td>
                <td>{row.tableAreaName}</td>
                <td>{row.menuName}</td>
                <td>{row.quantities}</td>
                <td>{row.option}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box> */}
    </Box>
  );
};

export default OrderSummary;
