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
import { Family, Visit } from "../types";

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
  const [isDisabled, setIsDisabled] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkInType, setCheckInType] = useState("");
  const [foodWeight, setFoodWeight] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [numInHousehold, setNumInHousehold] = useState(0);
  const [numChildren, setNumChildren] = useState(0);
  const [numElderly, setNumElderly] = useState(0);

  let currentFamily: Family;

  const handleAddCheckinClick = () => {
    setIsCheckInModalOpen(true);
  };

  const handleCheckInTypeChange = (event: SelectChangeEvent) => {
    setCheckInType(event.target.value as string);
  };

  const handleTextBoxChange = (e: any, textBoxToUpdate: string) => {
    const numRegex = /^[0-9\b]+$/;
    const letterRegex = /^[a-zA-Z\-b]+$/;
    const emailRegex = /^[a-zA-Z0-9.@\-]+$/;
    if (
      textBoxToUpdate !== "email" &&
      textBoxToUpdate !== "firstName" &&
      textBoxToUpdate !== "lastName" &&
      (e.target.value === "" || numRegex.test(e.target.value))
    ) {
      switch (textBoxToUpdate) {
        case "phoneNumber": {
          setPhoneNumber(e.target.value);
          break;
        }
        case "foodWeight": {
          setFoodWeight(e.target.value);
          break;
        }
        case "numInHousehold": {
          setNumInHousehold(e.target.value);
          break;
        }
        case "numChildren": {
          setNumChildren(e.target.value);
          break;
        }
        case "numElderly": {
          setNumElderly(e.target.value);
          break;
        }
      }
    } else if (
      textBoxToUpdate !== "email" &&
      (e.target.value === "" || letterRegex.test(e.target.value))
    ) {
      switch (textBoxToUpdate) {
        case "firstName": {
          setFirstName(e.target.value);
          break;
        }
        case "lastName": {
          setLastName(e.target.value);
          break;
        }
      }
    } else if (
      textBoxToUpdate === "email" &&
      (e.target.value === "" || emailRegex.test(e.target.value))
    ) {
      setEmail(e.target.value);
    }
  };

  const findFamily = async () => {
    currentFamily = await firestore.getFamily(phoneNumber);
    if (currentFamily.firstName === undefined) {
      console.log("Family does not exist");
      resetTextFields();
    } else {
      console.log(currentFamily);
      setFirstName(currentFamily.firstName);
      setLastName(currentFamily.lastName);
      setEmail(currentFamily.email);
      setNumInHousehold(currentFamily.numInHousehold);
      setNumChildren(currentFamily.numChildren);
      setNumElderly(currentFamily.numElderly);
    }
  };

  const resetTextFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setNumInHousehold(0);
    setNumChildren(0);
    setNumElderly(0);
  };

  const saveCheckIn = () => {
    const date = new Date();
    let familyToSave: Family = {
      firstName,
      lastName,
      email,
      phoneNumber,
      numInHousehold,
      numChildren,
      numElderly,
      visits: [],
    };
    let visitToSave: Visit = {
      id: date.getTime(),
      phoneNumber,
      firstName,
      lastName,
      foodWeight: parseInt(foodWeight),
      checkInType,
      timeOfVisit: date.toLocaleString(),
    };

    // firestore.saveFamily(familyToSave);
    // firestore.saveVisit(visitToSave);

    setPhoneNumber("");
    setCheckInType("");
    setFoodWeight("");
    setIsDisabled(true);
    resetTextFields();

    setIsCheckInModalOpen(false);
  };

  useEffect(() => {
    if (phoneNumber.length === 10) {
      findFamily();
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
        onClose={() => saveCheckIn()}
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
              handleTextBoxChange(e, "phoneNumber");
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
            disabled={isDisabled}
            autoFocus
            margin="dense"
            id="weight"
            label="Food Weight"
            type="weight"
            fullWidth
            variant="standard"
            onChange={(e) => {
              handleTextBoxChange(e, "foodWeight");
            }}
            value={foodWeight || ""}
          />,
          <TextField
            autoFocus
            margin="dense"
            id="first_name"
            label="First Name"
            type="first-name"
            fullWidth
            variant="standard"
            onChange={(e) => {
              handleTextBoxChange(e, "firstName");
            }}
            value={firstName}
          />,
          <TextField
            autoFocus
            margin="dense"
            id="last_name"
            label="Last Name"
            type="last-name"
            fullWidth
            variant="standard"
            onChange={(e) => {
              handleTextBoxChange(e, "lastName");
            }}
            value={lastName}
          />,
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => {
              handleTextBoxChange(e, "email");
            }}
            value={email}
          />,
          <TextField
            autoFocus
            margin="dense"
            id="number_in_household"
            label="Number of People in Household"
            type="number-in-household"
            fullWidth
            variant="standard"
            onChange={(e) => {
              handleTextBoxChange(e, "numInHousehold");
            }}
            value={numInHousehold}
          />,
          <TextField
            autoFocus
            margin="dense"
            id="number_under_18"
            label="Number of Children Under 18"
            type="number-under-18"
            fullWidth
            variant="standard"
            onChange={(e) => {
              handleTextBoxChange(e, "numChildren");
            }}
            value={numChildren}
          />,
          <TextField
            autoFocus
            margin="dense"
            id="number_over_60"
            label="Number of Adults Over 60"
            type="number-over-60"
            fullWidth
            variant="standard"
            onChange={(e) => {
              handleTextBoxChange(e, "numElderly");
            }}
            value={numElderly}
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

//-----RECIPIENT DROP DOWN-----
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
