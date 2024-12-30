import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import { createUser } from "../../data/teamData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddUserPage = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await createUser(values);
      resetForm();
      toast.success("User created successfully!");
      setTimeout(() => {
        navigate("/team");
      }, 2000);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user.");
    }
  };

  const branches = [
    { code: "AN", name: "Ancol" },
    { code: "AS", name: "Alam Sutera" },
    { code: "BK", name: "Bekasi" },
    { code: "BTR", name: "Bintaro" },
    { code: "CR", name: "Cirebon" },
    { code: "PIK", name: "Pantai Indah Kapuk 2" },
    { code: "PS", name: "Meruya" },
  ];

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                select
                variant="filled"
                label="Role"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                name="role"
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 4" }}
              >
                {[
                  "IT",
                  "Business Development",
                  "Manager Accounting",
                  "Assistant Manager Accounting",
                  "Head Accounting",
                  "Accounting",
                  "GRO",
                ].map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
              <Box gridColumn="span 4">
                <FormGroup>
                  {branches.map((branch) => (
                    <Box
                      key={branch.code}
                      display="flex"
                      alignItems="center"
                      mb={1}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.branchCode[branch.code] || false}
                            onChange={(e) =>
                              setFieldValue(
                                `branchCode.${branch.code}`,
                                e.target.checked
                              )
                            }
                            sx={{
                              color: "#00C853",
                              "&.Mui-checked": {
                                color: "#00C853",
                              },
                            }}
                          />
                        }
                        label={branch.code}
                        sx={{ marginRight: "10px" }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {branch.name}
                      </Typography>
                    </Box>
                  ))}
                </FormGroup>
                {touched.branchCode && errors.branchCode && (
                  <p style={{ color: "red", marginTop: "5px" }}>
                    {errors.branchCode}
                  </p>
                )}
              </Box>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone is required"),
  role: yup.string().required("Role is required"),
  photo: yup.string().url("Photo must be a valid URL").optional(),
  branchCode: yup
    .object()
    .test(
      "at-least-one-checked",
      "At least one branch must be selected",
      (value) => Object.values(value).some((v) => v)
    )
    .required("Branch Code is required"),
});

const initialValues = {
  name: "",
  phone: "",
  role: "",
  photo: "",
  branchCode: {
    AC: false,
    AS: false,
    BK: false,
    BTR: false,
    CR: false,
    PIK: false,
    PS: false,
  },
};

export default AddUserPage;
