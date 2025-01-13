import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Modal,
  TextField,
  List,
  ListItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  createItemPackage,
  deleteItemPackage,
  getItemPackage,
} from "../../data/itemPackageData";
import { toast, ToastContainer } from "react-toastify";
import { getOptionPackage } from "../../data/optionPackageData";
import { getMenu } from "../../data/menuData";
import { getOption } from "../../data/optionData";

const ItemPackage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [itemPackages, setItemPackages] = useState([]);
  const [menus, setMenus] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionPackages, setOptionPackages] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [searchOptionPackage, setSearchOptionPackage] = useState("");
  const [searchItemDetail, setSearchItemDetail] = useState("");
  const [searchItemOption, setSearchItemOption] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedOptionPackages, setSelectedOptionPackages] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);
  const [selectedItemOptions, setSelectedItemOptions] = useState([]);
  const [altMenuName, setAltMenuName] = useState("");
  const [itemPackageDetailPrice, setItemPackageDetailPrice] = useState(0);

  const handleModalOpen = () => {
    setOpenCreateModal(true);
    setAltMenuName("");
    setItemPackageDetailPrice(0);
    setSelectedItems([]);
    setSelectedOptionPackages([]);
    setSelectedItemDetails([]);
    setSelectedItemOptions([]);
    setSearchItem("");
    setSearchOptionPackage("");
    setSearchItemDetail("");
    setSearchItemOption("");
  };

  const handleModalClose = () => {
    setOpenCreateModal(false);
    setAltMenuName("");
    setItemPackageDetailPrice(0);
    setSelectedItems([]);
    setSelectedOptionPackages([]);
    setSelectedItemDetails([]);
    setSelectedItemOptions([]);
    setSearchItem("");
    setSearchOptionPackage("");
    setSearchItemDetail("");
    setSearchItemOption("");
  };

  const fetchItemPackageAll = async () => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];

    try {
      const [itemPackageData, optionPackageData, menuData, optionData] =
        await Promise.all([
          getItemPackage(branchCodes),
          getOptionPackage(branchCodes),
          getMenu(branchCodes),
          getOption(branchCodes),
        ]);

      setItemPackages(itemPackageData);
      setOptionPackages(optionPackageData);
      setMenus(menuData);
      setOptions(optionData);
    } catch (error) {
      console.error("Error fetching option:", error);
    }
  };

  useEffect(() => {
    fetchItemPackageAll();
  }, []);

  const BranchName = JSON.parse(localStorage.getItem("userData")).branchName;
  const BranchCode = JSON.parse(localStorage.getItem("userData")).branchCode;

  const filteredItems = menus.filter(
    (menu) =>
      menu.MenuName.toLowerCase().includes(searchItem.toLowerCase()) &&
      menu.MenuPackage === true
  );

  const filteredOptionPackages = optionPackages.filter((optionPackage) =>
    optionPackage.OptionPackageName.toLowerCase().includes(
      searchOptionPackage.toLowerCase()
    )
  );

  const filteredItemDetails = menus.filter(
    (menu) =>
      menu.MenuName.toLowerCase().includes(searchItemDetail.toLowerCase()) &&
      menu.MenuPackage === false
  );

  const filteredItemOptions = options.filter((option) =>
    option.OptionName.toLowerCase().includes(searchItemOption.toLowerCase())
  );

  const handleSelectItem = (itemId, setSelectedState, isUnlimited = false) => {
    setSelectedState((prevSelected) => {
      if (isUnlimited) {
        // Tidak ada batasan untuk jumlah pilihan
        return prevSelected.includes(itemId)
          ? prevSelected.filter((id) => id !== itemId)
          : [...prevSelected, itemId];
      }

      // Logika default (batas hanya satu pilihan)
      return prevSelected.includes(itemId) ? [] : [itemId];
    });
  };

  const handleSubmit = async () => {
    if (selectedItemDetails.length === 0) {
      toast.error("Item Package Detail harus dipilih.");
      return;
    }

    try {
      const selectedOptionPackage = optionPackages.find(
        (pkg) => pkg.OptionPackageId === selectedOptionPackages[0]
      );

      const selectedMenu = menus.find(
        (menu) => menu.MenuId === selectedItems[0]
      );

      const selectedOption = options.find(
        (opt) => opt.OptionId === selectedItemOptions[0]
      );

      const dataToSubmit = selectedItemDetails.map((detailId) => {
        const selectedDetail = menus.find((menu) => menu.MenuId === detailId);

        return {
          BranchCode: BranchCode.toString(),
          BranchName: BranchName.toString(),
          AltMenuName: altMenuName || null,
          ItemPackageDetailPrice: parseFloat(itemPackageDetailPrice) || 0,
          PackageName: selectedMenu?.MenuName,
          ItemPackage_i_id: selectedMenu?.i_id || 0,
          OptionPackageName: selectedOptionPackage?.OptionPackageName,
          AutoInsert: selectedOptionPackage?.AutoInsert || false,
          MaxChoosen: selectedOptionPackage?.MaxChoosen || 0,
          MinChoosen: selectedOptionPackage?.MinChoosen || 0,
          ItemPackageDetail: selectedDetail?.MenuName,
          i_id: selectedDetail?.i_id || 0,
          ItemOptionPackage: selectedOption?.OptionName,
          op_id: selectedOption?.op_id || 0,
        };
      });

      for (const data of dataToSubmit) {
        await createItemPackage(data);
      }

      toast.success("Item Packages created successfully!");
      handleModalClose();
      fetchItemPackageAll();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data.");
    }
  };

  const handleDeleteClick = async (itemPackageId) => {
    if (!itemPackageId) {
      toast.error("Item Package ID tidak ditemukan.");
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      try {
        await deleteItemPackage(itemPackageId);
        toast.success("Item Package berhasil dihapus.");
        fetchItemPackageAll();
      } catch (error) {
        console.error("Error deleting item package:", error);
        toast.error("Gagal menghapus Item Package.");
      }
    }
  };

  const columns = [
    {
      field: "PackageName",
      headerName: "Package Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "AltMenuName",
      headerName: "ALt Menu Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "OptionPackageName",
      headerName: "Option Package",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "ItemPackageDetail",
      headerName: "Item Package Detail",
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field: "ItemOptionPackage",
      headerName: "Item Option Package",
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
          height="100%"
        >
          {/* <Button
            onClick={() => handleEditClick(params.row)}
            sx={{
              color: "green",
              minWidth: "auto",
              padding: 0,
              height: "auto",
            }}
          >
            <EditIcon />
          </Button> */}
          <Button
            onClick={() => handleDeleteClick(params.row.ItemPackageId)}
            sx={{
              color: "red",
              minWidth: "auto",
              padding: 0,
              height: "auto",
            }}
          >
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title={`ITEM PACKAGE  ${BranchName}`}
        subtitle="Managing the Item Package"
      />
      <Button variant="contained" color="secondary" onClick={handleModalOpen}>
        Create New Item Package
      </Button>
      <Box
        m="40px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            display: "flex",
            fontSize: "0.9rem",
            fontWeight: "bold",
          },
        }}
      >
        <DataGrid
          rows={itemPackages}
          columns={columns}
          getRowId={(row) => row.ItemPackageId}
          disableSelectionOnClick
        />
      </Box>

      <Modal open={openCreateModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1300,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <h2>Create New Item Package</h2>
          <Box display="flex" gap={2}>
            {/* Input untuk Alt Menu Name */}
            <TextField
              label="Alt Menu Name"
              value={altMenuName}
              onChange={(e) => setAltMenuName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            {/* Input untuk Item Package Detail Price */}
            <TextField
              label="Item Package Detail Price"
              value={itemPackageDetailPrice}
              type="number"
              onChange={(e) => setItemPackageDetailPrice(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Box>
          <Box display="flex" gap={2}>
            {/* Kolom MenuName */}
            <Box
              sx={{
                width: "25%",
                maxHeight: 500,
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <TextField
                placeholder="Search Package Name"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <List>
                {filteredItems.map((menu) => (
                  <ListItem
                    key={menu.MenuId}
                    button
                    onClick={() =>
                      handleSelectItem(menu.MenuId, setSelectedItems)
                    }
                  >
                    <Checkbox
                      checked={selectedItems.includes(menu.MenuId)}
                      color="secondary"
                    />
                    <ListItemText primary={menu.MenuName} />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Kolom PackageName */}
            <Box
              sx={{
                width: "25%",
                maxHeight: 500,
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <TextField
                placeholder="Search Package Name"
                value={searchOptionPackage}
                onChange={(e) => setSearchOptionPackage(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <List>
                {filteredOptionPackages.map((pkg) => (
                  <ListItem
                    key={pkg.OptionPackageId}
                    button
                    onClick={() =>
                      handleSelectItem(
                        pkg.OptionPackageId,
                        setSelectedOptionPackages
                      )
                    }
                  >
                    <Checkbox
                      checked={selectedOptionPackages.includes(
                        pkg.OptionPackageId
                      )}
                      color="secondary"
                    />
                    <ListItemText primary={pkg.OptionPackageName} />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Kolom ItemPackageDetail */}
            <Box
              sx={{
                width: "25%",
                maxHeight: 500,
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <TextField
                placeholder="Search Item Package Detail"
                value={searchItemDetail}
                onChange={(e) => setSearchItemDetail(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <List>
                {filteredItemDetails.map((detail) => (
                  <ListItem
                    key={detail.MenuId}
                    button
                    onClick={
                      () =>
                        handleSelectItem(
                          detail.MenuId,
                          setSelectedItemDetails,
                          true
                        ) // Tidak dibatasi
                    }
                  >
                    <Checkbox
                      checked={selectedItemDetails.includes(detail.MenuId)}
                      color="secondary"
                    />
                    <ListItemText primary={detail.MenuName} />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Kolom ItemOptionPackage */}
            <Box
              sx={{
                width: "25%",
                maxHeight: 500,
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <TextField
                placeholder="Search Item Option Package"
                value={searchItemOption}
                onChange={(e) => setSearchItemOption(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <List>
                {filteredItemOptions.map((option) => (
                  <ListItem
                    key={option.OptionId}
                    button
                    onClick={() =>
                      handleSelectItem(option.OptionId, setSelectedItemOptions)
                    }
                  >
                    <Checkbox
                      checked={selectedItemOptions.includes(option.OptionId)}
                      color="secondary"
                    />
                    <ListItemText primary={option.OptionName} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>

          {/* Tombol Simpan */}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={handleModalClose}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
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

export default ItemPackage;
