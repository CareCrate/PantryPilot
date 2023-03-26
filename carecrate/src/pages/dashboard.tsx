import DataCard from "@/components/dashboard/DataCard";
import Modal from "@/components/dashboard/Modal";
import { useFirestore } from "@/service/hooks";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Family } from "../types";

// ----- Number not change on scroll in text field-----
//
// onFocus={(e) =>
//   e.target.addEventListener(
//     "wheel",
//     function (e) {
//       e.preventDefault();
//     },
//     { passive: false }
//   )
// }

// Available Fields for Mapping
const fields: GridColDef[] = [
  {
    field: "first_name",
    headerName: "First Name",
    width: 150,
  },
  {
    field: "last_name",
    headerName: "Last Name",
    width: 150,
  },
  {
    field: "method_of_checkin",
    headerName: "Method of Checkin",
    width: 150,
  },
  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 300,
  },
];

// TODO: Generate based on Real Data.
const data: GridRowsProp = [
  {
    id: 1,
    first_name: "Jane",
    last_name: "Doe",
    method_of_checkin: "Doordash",
    timestamp: "12:30 PM",
  },
  {
    id: 2,
    first_name: "Bob",
    last_name: "Doen",
    method_of_checkin: "On-Site",
    timestamp: "1:15 PM",
  },
  {
    id: 3,
    first_name: "Jenna",
    last_name: "Worthington",
    method_of_checkin: "Doordash",
    timestamp: "3:45 PM",
  },
  {
    id: 4,
    first_name: "Bill",
    last_name: "Nye",
    method_of_checkin: "On-Site",
    timestamp: "9:20 AM",
  },
  {
    id: 5,
    first_name: "Sara",
    last_name: "SpringStein",
    method_of_checkin: "Doordash",
    timestamp: "7:15 AM",
  },
];

export default function Dashboard() {
  const firestore: any = useFirestore();

  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkInType, setCheckInType] = useState("");
  const [foodWeight, setFoodWeight] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  let currentFamily: Family;

  const handleAddCheckinClick = () => {
    setIsCheckInModalOpen(true);
    setPhoneNumber("");
    setCheckInType("");
    setFoodWeight("");
    setIsDisabled(false);
  };

  const handleCheckInTypeChange = (event: SelectChangeEvent) => {
    setCheckInType(event.target.value as string);
  };

  const handlePhoneNumberChange = (e: any) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setPhoneNumber(e.target.value);
    }
  };

  const pleaseWork = async () => {
    currentFamily = await firestore.getFamily(phoneNumber);
    console.log(phoneNumber);
    // console.log(currentFamily);
    console.log(
      "Current Family: " +
        currentFamily.firstName +
        " " +
        currentFamily.lastName
    );
  };

  useEffect(() => {
    if (phoneNumber.length === 10) {
      pleaseWork();
      // console.log(
      //   "Current Family: " +
      //     currentFamily.firstName +
      //     " " +
      //     currentFamily.lastName
      // );
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (checkInType === "Drive In") {
      setFoodWeight("45");
      setIsDisabled(true);
    } else if (checkInType === "DoorDash") {
      setFoodWeight("25");
      setIsDisabled(true);
    } else if (checkInType === "Walk In") {
      setFoodWeight("");
      setIsDisabled(false);
    }
  }, [checkInType]);

  return (
    <Box
      component="div"
      sx={{
        overflowX: "clip",
        position: "relative",
        margin: "auto",
        maxWidth: "1920px",
        padding: "2em",
      }}
    >
      <Grid container spacing={0} direction="column" sx={{ width: "100%" }}>
        <Grid
          item
          container
          direction="column"
          spacing={0}
          sx={{ flexDirection: "column" }}
        >
          {/* TODO: Implement Cards. */}
          <Stack direction="row" spacing={3}>
            <DataCard
              subtitle={"Total checkins today"}
              value={100}
              prev={120}
            />
            <DataCard subtitle={"Total volunteers today"} value={4} prev={20} />
            <DataCard
              subtitle={"Total household today"}
              value={3000}
              prev={2700}
            />
            {/* <DataCard subtitle={'Food weight'} value={25} units={'lbs'} /> */}
          </Stack>

          {/* TODO: Implement Dynamic List */}
          <Stack direction="row" spacing={0} sx={{ marginTop: "5em" }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Recent Checkins
            </Typography>
            <Button
              variant="contained"
              disableElevation
              disableRipple
              disableTouchRipple
              sx={{ textTransform: "none" }}
              onClick={handleAddCheckinClick}
            >
              + Add Family
            </Button>
          </Stack>
          <Paper
            component="div"
            elevation={3}
            sx={{ height: 500, width: "100%", marginTop: "2em" }}
          >
            <DataGrid rows={data} columns={fields} />
          </Paper>
        </Grid>
      </Grid>
      <Modal
        open={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Checkin"
        content="To checkin a user, please enter in their associated informaton. If a phone number is found, the information will be populated automatically."
        submitText="Submit"
        inputFields={[
          <TextField
            autoFocus
            margin="dense"
            id="phone_number"
            label="Phone Number"
            type="text"
            fullWidth
            inputProps={{ maxLength: 10 }}
            variant="standard"
            onChange={(e) => {
              handlePhoneNumberChange(e);
            }}
            value={phoneNumber}
          />,
          <TextField
            autoFocus
            margin="dense"
            id="recipient"
            label="Recipient"
            type="recipient"
            fullWidth
            variant="standard"
          />,
          //   <FormControl fullWidth>
          //     <InputLabel id="family">Family</InputLabel>
          //     <Select
          //       labelId="family"
          //       id="family"
          //       value={age}
          //       label="Family"
          //       onChange={handleChange}
          //     >
          //       <MenuItem value={10}>Ten</MenuItem>
          //       <MenuItem value={20}>Twenty</MenuItem>
          //       <MenuItem value={30}>Thirty</MenuItem>
          //     </Select>
          //   </FormControl>,
          //   <TextField
          //     autoFocus
          //     margin="dense"
          //     id="checkin_type"
          //     label="Check In Type"
          //     type="checkin-type"
          //     fullWidth
          //     variant="standard"
          //   />,
          <FormControl fullWidth>
            <InputLabel id="check-in-type">Check In Type</InputLabel>
            <Select
              labelId="check-in-type"
              id="check-in-type"
              value={checkInType}
              label="Check in Type"
              onChange={handleCheckInTypeChange}
            >
              <MenuItem value={"Drive In"}>Drive In</MenuItem>
              <MenuItem value={"Walk In"}>Walk In</MenuItem>
              <MenuItem value={"DoorDash"}>DoorDash</MenuItem>
            </Select>
          </FormControl>,
          <TextField
            value={foodWeight || ""}
            disabled={isDisabled}
            autoFocus
            margin="dense"
            id="weight"
            label="Food Weight"
            type="weight"
            fullWidth
            variant="standard"
          />,
          <TextField
            autoFocus
            margin="dense"
            id="first_name"
            label="First Name"
            type="first-name"
            fullWidth
            variant="standard"
          />,
          <TextField
            autoFocus
            margin="dense"
            id="last_name"
            label="Last Name"
            type="last-name"
            fullWidth
            variant="standard"
          />,
          <TextField
            autoFocus
            margin="dense"
            id="number_in_household"
            label="Number of People in Household"
            type="number-in-household"
            fullWidth
            variant="standard"
          />,
          <TextField
            autoFocus
            margin="dense"
            id="number_under_18"
            label="Number of People Under 18"
            type="number-under-18"
            fullWidth
            variant="standard"
          />,
          <TextField
            autoFocus
            margin="dense"
            id="number_over_60"
            label="Number of People Over 60"
            type="number-over-60"
            fullWidth
            variant="standard"
          />,
          <FormGroup>
            {" "}
            <FormControlLabel
              control={<Checkbox defaultChecked={false} />}
              label="Add New Family to Existing Phone Number"
            />
          </FormGroup>,
        ]}
      />
    </Box>
  );
}
