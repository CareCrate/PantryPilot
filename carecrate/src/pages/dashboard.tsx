import DataCard from "@/components/dashboard/DataCard";
import Modal from "@/components/dashboard/Modal";
import {
  useDriveInWeightListener,
  useFirestore,
  useReportGenerator,
  useVisitsListener,
} from "@/service/hooks";
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
import { Family, Visit, Weight } from "../types";

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

const dummyData: any = [
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
  const allVisits: any = useVisitsListener();
  const driveInWeight: Weight = useDriveInWeightListener();
  const reportGenerator: any = useReportGenerator();

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
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedFamilyIndex, setSelectedFamilyIndex] = useState(-1);
  const [hasAdditionalFamilies, setHasAdditionalFamilies] = useState(false);
  const [queriedFamilies, setQueriedFamilies] = useState<Family[]>([]);

  const handleAddCheckinClick = () => {
    setIsCheckInModalOpen(true);
    firestore.updateFoodWeight(12);
  };

  const handleCheckInTypeChange = (event: SelectChangeEvent) => {
    setCheckInType(event.target.value as string);
  };

  const handleSelectedFamilyChange = (index: number) => {
    setSelectedFamilyIndex(index);
    setSelectedFamily(
      queriedFamilies[index].firstName + " " + queriedFamilies[index].lastName
    );
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
  };

  const findFamily = async () => {
    setQueriedFamilies(await firestore.queryFamilies(phoneNumber));
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
    setSelectedFamily("");
    setSelectedFamilyIndex(-1);
    setQueriedFamilies([]);
    setHasAdditionalFamilies(false);
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

    firestore.newSaveFamily(familyToSave);
    firestore.saveVisit(visitToSave);
    reportGenerator.generate(
      familyToSave.numInHousehold,
      familyToSave.numChildren,
      familyToSave.numElderly,
      visitToSave.foodWeight
    );

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
      setHasAdditionalFamilies(false);
      setSelectedFamilyIndex(-1);
      setQueriedFamilies([]);
      setSelectedFamily("");
    }
  }, [phoneNumber]);
  //
  useEffect(() => {
    if (checkInType === "Drive In") {
      setFoodWeight(driveInWeight.weight.toString());
      console.log(driveInWeight);
      setIsFoodWeightDisabled(true);
    } else if (checkInType === "DoorDash") {
      setFoodWeight("25");
      setIsFoodWeightDisabled(true);
    } else if (checkInType === "Walk In") {
      setFoodWeight("");
      setIsFoodWeightDisabled(false);
    }
  }, [checkInType]);

  useEffect(() => {
    if (queriedFamilies.length === 0) {
      resetTextFields();
    } else if (queriedFamilies.length === 1) {
      setFirstName(queriedFamilies[0].firstName);
      setLastName(queriedFamilies[0].lastName);
      setEmail(queriedFamilies[0].email);
      setNumInHousehold(queriedFamilies[0].numInHousehold);
      setNumChildren(queriedFamilies[0].numChildren);
      setNumElderly(queriedFamilies[0].numElderly);
      setIsFamilyFound(true);
    } else if (queriedFamilies.length > 1 && selectedFamilyIndex == -1) {
      console.log("No family selected");
      setHasAdditionalFamilies(true);
      resetTextFields();
      setIsFamilyFound(true);
    } else if (queriedFamilies.length > 1 && selectedFamilyIndex != -1) {
      console.log("Using queried families");
      setHasAdditionalFamilies(true);
      setFirstName(queriedFamilies[selectedFamilyIndex].firstName);
      setLastName(queriedFamilies[selectedFamilyIndex].lastName);
      setEmail(queriedFamilies[selectedFamilyIndex].email);
      setNumInHousehold(queriedFamilies[selectedFamilyIndex].numInHousehold);
      setNumChildren(queriedFamilies[selectedFamilyIndex].numChildren);
      setNumElderly(queriedFamilies[selectedFamilyIndex].numElderly);
      setIsFamilyFound(true);
    }
  }, [queriedFamilies, selectedFamilyIndex]);

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
              showPercent={false}
            />
            <DataCard
              subtitle={"Total volunteers today"}
              value={4}
              prev={20}
              showPercent={false}
            />
            <DataCard
              subtitle={"Total household today"}
              value={3000}
              prev={2700}
              showPercent={false}
            />
            {/* <DataCard subtitle={'Food weight'} value={25} units={'lbs'} /> */}
          </Stack>

          {/* TODO: Implement Dynamic List */}
          <Stack direction="row" spacing={0} sx={{ marginTop: "5em" }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Today's Checkins
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
              rows={isShowMyVisits ? myVisits : allVisits}
              columns={fields}
            />
          </Paper>
        </Grid>
      </Grid>
      <Modal
        open={isCheckInModalOpen}
        onSubmit={saveCheckIn}
        onCancel={resetCheckInModal}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Checkin"
        content="You must fill out all form fields before you are able to submit."
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
          <FormControl
            fullWidth
            sx={{ display: hasAdditionalFamilies ? "inline-flex" : "none" }}
          >
            <InputLabel id="select-family">Select Family</InputLabel>
            <Select
              labelId="select-family"
              id="select-family"
              value={selectedFamily}
              label="Select Family"
              // onChange={handleSelectedFamilyChange}
            >
              {queriedFamilies.map((family: any, index: number) => {
                return (
                  <MenuItem
                    key={index}
                    value={family.firstName + " " + family.lastName}
                    onClick={() => handleSelectedFamilyChange(index)}
                  >
                    {family.firstName + " " + family.lastName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>,
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
            disabled={isFamilyFound && !isAppendingFamily}
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
            disabled={isFamilyFound && !isAppendingFamily}
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
        ]}
      />
    </Box>
  );
}
