import { useTheme } from "@mui/material/styles";
import { AppBar, Box, Button, Toolbar, Typography, Tooltip, IconButton, Menu, MenuItem, FormControlLabel, Stack, Switch, Icon, FormControl, InputLabel, Select } from "@mui/material";
import Modal from "@/components/dashboard/Modal";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import TimelineIcon from "@mui/icons-material/Timeline";
import TuneIcon from "@mui/icons-material/Tune";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { ChangeEvent, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession, GetSessionParams, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { SessionUser } from "@/types";
import Link from "next/link";
import { useFirestore } from "@/service/hooks";

interface NavbarProps {
  toggleMode: () => void;
}

export default function Navbar({ toggleMode }: NavbarProps) {
  const firestore: any = useFirestore();

  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event: ChangeEvent<HTMLElement>) => {
    setAnchorEl(event?.currentTarget);
  };
  const handleSignout = async () => {
    await signOut({ callbackUrl: "/login" });
    setAnchorEl(null);
  };

  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const handleReportsClick = () => {
    setIsReportsModalOpen(true);
  };
  const resetReportsModal = () => {
    setIsReportsModalOpen(false);
  };
  const closeModal = () => {
    resetReportsModal();
  };

  //Reports modal
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isReportFound, setIsReportFound] = useState(false);
  const [displayReportData, setDisplayReportData] = useState<JSX.Element[]>([]);
  const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years: number[] = Array.from({ length: 77 }, (_, i) => i + 2023);
  const generateReport = () => {
    firestore.getMonthlyReport(selectedMonth + " " + selectedYear);
    if (isReportFound) {
      setIsReportFound(false);
    } else {
      setIsReportFound(true);
    }
  };
  const foundReportData: JSX.Element[] = [
    <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
      Households Served: {session?.user?.name}
    </Typography>,
    <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
      Persons Served: {session?.user?.name}
    </Typography>,
    <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
      Children Served: {session?.user?.name}
    </Typography>,
    <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
      Elderly Served: {session?.user?.name}
    </Typography>,
    <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
      Pounds of Food Distributed: {session?.user?.name}
    </Typography>,
    <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
      Pounds of Food Discarded: {session?.user?.name}
    </Typography>
  ];
  const undefinedReportData: JSX.Element[] = [
    <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
      No Report Found
    </Typography>
  ];

  useEffect(() => {
    if (isReportFound) {
      setDisplayReportData(foundReportData);
    } else {
      setDisplayReportData(undefinedReportData);
    }
  }, [isReportFound]);

  return (
    <AppBar position="static" elevation={0} sx={{ background: "#C2AFF0" }}>
      <Toolbar>
        {session && (
          <Stack spacing={0} sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: "#FFF" }}>
              PantryPilot
            </Typography>
            <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#FFF" }}>
              Hi, {session?.user?.name}
            </Typography>
          </Stack>
        )}
        {!session && (
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: "#FFF" }}>
            PantryPilot
          </Typography>
        )}
        <Box component="div">
          <Stack direction="row" sx={{ alignItems: "center" }}>
            {session && (
              <>
                <Link href="/dashboard" passHref>
                  <Tooltip title="Dashboard">
                    <IconButton size="large" disableRipple disableFocusRipple disableTouchRipple>
                      <DashboardIcon fontSize="large" sx={{ color: "#FFF" }} />
                    </IconButton>
                  </Tooltip>
                </Link>
                {user?.role === "admin" && (
                  <Tooltip title="Reports">
                    <IconButton size="large" disableRipple disableFocusRipple disableTouchRipple onClick={handleReportsClick}>
                      <TimelineIcon fontSize="large" sx={{ color: "#FFF" }} />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Profile">
                  <IconButton size="large" disableRipple disableFocusRipple disableTouchRipple onClick={handleMenu}>
                    <AccountCircle fontSize="large" sx={{ color: "#FFF" }} />
                  </IconButton>
                </Tooltip>
                {user?.role === "admin" && (
                  <Link href="/settings" passHref>
                    <Tooltip title="Settings">
                      <IconButton size="large" disableRipple disableFocusRipple disableTouchRipple>
                        <TuneIcon fontSize="large" sx={{ color: "#FFF" }} />
                      </IconButton>
                    </Tooltip>
                  </Link>
                )}
              </>
            )}
            {!session && (
              <>
                <Link href="/login" passHref style={{ textDecoration: "none", color: "#424242" }}>
                  <Button color="inherit">Login</Button>
                </Link>
                <Link href="/register" passHref style={{ textDecoration: "none", color: "#424242" }}>
                  <Button color="inherit" sx={{ color: "inherit" }}>
                    Register
                  </Button>
                </Link>
              </>
            )}
            <Tooltip title="Change Theme">
              <IconButton size="large" onClick={toggleMode}>
                <Brightness6Icon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          {session && (
            <Menu id="profile_menu" anchorEl={anchorEl} anchorOrigin={{ vertical: "top", horizontal: "right" }} keepMounted transformOrigin={{ vertical: "top", horizontal: "right" }} open={Boolean(anchorEl)} onClose={handleClose} sx={{ marginTop: "2em", marginLeft: "-1em" }}>
              <MenuItem onClick={handleSignout}>Logout</MenuItem>
            </Menu>
          )}
          <Modal
            open={isReportsModalOpen}
            onClose={() => setIsReportsModalOpen(false)}
            title="Monthly Reports"
            content="Select a month and year to view the associated report."
            submitText="Done"
            inputFields={[
              <FormControl fullWidth>
                <InputLabel id="month">Month</InputLabel>
                <Select labelId="month" id="month" value={selectedMonth} label="Month">
                  {months.map((month: string, index: number) => {
                    return (
                      <MenuItem key={index} value={month} onClick={() => setSelectedMonth(month)}>
                        {month}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>,
              <FormControl fullWidth>
                <InputLabel id="year">Year</InputLabel>
                <Select labelId="year" id="year" value={selectedYear} label="Year">
                  {years.map((year: number, index: number) => {
                    return (
                      <MenuItem key={index} value={year} onClick={() => setSelectedYear(year.toString())}>
                        {year}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>,
              <Button variant="text" onClick={generateReport}>
                Generate
              </Button>,
              <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
                Household Served: {session?.user?.name}
              </Typography>,
              <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
                Persons Served: {session?.user?.name}
              </Typography>,
              <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
                Children Served: {session?.user?.name}
              </Typography>,
              <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
                Elderly Served: {session?.user?.name}
              </Typography>,
              <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
                Pounds of Food Distributed: {session?.user?.name}
              </Typography>,
              <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, color: "#000000" }}>
                Pounds of Food Discarded: {session?.user?.name}
              </Typography>
            ]}
            onSubmit={closeModal}
            onCancel={resetReportsModal}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
