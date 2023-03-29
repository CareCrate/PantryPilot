import DataCard from "@/components/dashboard/DataCard";
import Modal from "@/components/dashboard/Modal";
import { useFirestore, useVisitsListener } from "@/service/hooks";
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useEffect, useState } from "react";
import { Family, Visit } from "../types";

// Available Fields for Mapping
const fields: GridColDef[] = [
  {
    field: "firstName",
    headerName: "First Name",
    width: 150,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 150,
  },
  {
    field: "checkInType",
    headerName: "Method of Checkin",
    width: 150,
  },
  {
    field: "timeOfVisit",
    headerName: "Timestamp",
    width: 300,
  },
];
//

// TODO: Generate based on Real Data.
// const myData: GridRowsProp = [
//   {
//     id: 1,
//     first_name: "Jane",
//     last_name: "Doe",
//     method_of_checkin: "Doordash",
//     timestamp: "12:30 PM",
//   },
//   {
//     id: 2,
//     first_name: "Bob",
//     last_name: "Doen",
//     method_of_checkin: "On-Site",
//     timestamp: "1:15 PM",
//   },
//   {
//     id: 3,
//     first_name: "Jenna",
//     last_name: "Worthington",
//     method_of_checkin: "Doordash",
//     timestamp: "3:45 PM",
//   },
//   {
//     id: 4,
//     first_name: "Bill",
//     last_name: "Nye",
//     method_of_checkin: "On-Site",
//     timestamp: "9:20 AM",
//   },
//   {
//     id: 5,
//     first_name: "Sara",
//     last_name: "SpringStein",
//     method_of_checkin: "Doordash",
//     timestamp: "7:15 AM",
//   },
// ];

const allData: GridRowsProp = [
  {
    id: 1,
    firstName: "Bob",
    lastName: "Doe",
    checkInType: "Doordash",
    timeOfVisit: "12:30 PM",
  },
  {
    id: 2,
    firstName: "Mary",
    lastName: "Doen",
    checkInType: "On-Site",
    timeOfVisit: "1:15 PM",
  },
  {
    id: 3,
    firstName: "Amy",
    lastName: "Worthington",
    checkInType: "Doordash",
    timeOfVisit: "3:45 PM",
  },
  {
    id: 4,
    firstName: "Dylan",
    lastName: "Nye",
    checkInType: "On-Site",
    timeOfVisit: "9:20 AM",
  },
  {
    id: 5,
    firstName: "Josh",
    lastName: "SpringStein",
    checkInType: "Doordash",
    timeOfVisit: "7:15 AM",
  },
];

export default function Dashboard() {
  const firestore: any = useFirestore();
  // const allVisits = useVisitsListener();
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isFoodWeightDisabled, setIsFoodWeightDisabled] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkInType, setCheckInType] = useState("");
  const [foodWeight, setFoodWeight] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [numInHousehold, setNumInHousehold] = useState(0);
  const [numChildren, setNumChildren] = useState(0);
  const [numElderly, setNumElderly] = useState(0);
  const [isShowMyVisits, setIsShowMyVisits] = useState(true);
  const [myVisits, setMyVisits] = useState<Visit[]>([]);
  const [isFamilyFound, setIsFamilyFound] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isAppendingFamily, setIsAppendingFamily] = useState(false);

  // let isAppendingFamily: boolean = false;

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

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isAppendingFamily
      ? setIsAppendingFamily(false)
      : setIsAppendingFamily(true);
    setChecked(e.target.checked);

    // if (checked) {
    //   setIsAppendingFamily(true);
    //   setChecked(false);

    //   console.log("Checked: " + checked);
    //   console.log("isAppending: " + isAppendingFamily);
    // } else {
    //   setIsAppendingFamily(false);
    //   setChecked(true);

    //   console.log("Checked: " + checked);
    //   console.log("isAppending: " + isAppendingFamily);
    // }

    // checked ? (isAppendingFamily = true) : (isAppendingFamily = false);
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
      setIsFamilyFound(true);
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

  const resetCheckInModal = () => {
    setPhoneNumber("");
    setCheckInType("");
    setFoodWeight("");
    setIsFoodWeightDisabled(true);
    setIsAppendingFamily(false);
    resetTextFields();

    setIsCheckInModalOpen(false);
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
      timeOfVisit: date.toLocaleTimeString(),
    };

    if (!isAppendingFamily) {
      // firestore.saveFamily(familyToSave);
      console.log("Save Family");
    } else {
      firestore.appendFamily(familyToSave);
    }
    // firestore.saveVisit(visitToSave);
    setMyVisits((current) => [...current, visitToSave]);

    resetCheckInModal();
  };

  useEffect(() => {
    if (phoneNumber.length === 10) {
      findFamily();
    } else {
      resetTextFields();
      if (isFamilyFound) {
        setIsFamilyFound(false);
      }
      setChecked(false);
      setIsAppendingFamily(false);
    }
  }, [phoneNumber]);
  //
  useEffect(() => {
    if (checkInType === "Drive In") {
      setFoodWeight("45");
      setIsFoodWeightDisabled(true);
    } else if (checkInType === "DoorDash") {
      setFoodWeight("25");
      setIsFoodWeightDisabled(true);
    } else if (checkInType === "Walk In") {
      setFoodWeight("");
      setIsFoodWeightDisabled(false);
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
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue="mine"
          >
            <FormControlLabel
              value="mine"
              control={
                <Radio
                  size="small"
                  onClick={() => {
                    setIsShowMyVisits(true);
                  }}
                />
              }
              label="Mine"
            />
            <FormControlLabel
              value="all"
              control={
                <Radio
                  size="small"
                  onClick={() => {
                    setIsShowMyVisits(false);
                  }}
                />
              }
              label="All"
            />
          </RadioGroup>
          <Paper
            component="div"
            elevation={3}
            sx={{ height: 500, width: "100%", marginTop: "2em" }}
          >
            <DataGrid
              rows={isShowMyVisits ? myVisits : allData}
              columns={fields}
            />
          </Paper>
        </Grid>
      </Grid>
      <Modal
        open={isCheckInModalOpen}
        onSubmit={saveCheckIn}
        onClose={() => {}}
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
            disabled={isFoodWeightDisabled}
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
              sx={{ display: isFamilyFound ? "block" : "none" }}
              control={
                <Checkbox checked={checked} onChange={handleCheckBoxChange} />
              }
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
