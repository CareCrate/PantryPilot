import DataCard from '@/components/dashboard/DataCard';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

// Available Fields for Mapping
const fields: GridColDef[] = [
    {
        field: 'first_name',
        headerName: 'First Name',
        width: 150
    },
    {
        field: 'last_name',
        headerName: 'Last Name',
        width: 150
    },
    {
        field: 'method_of_checkin',
        headerName: 'Method of Checkin',
        width: 150
    },
    {
        field: 'timestamp',
        headerName: 'Timestamp',
        width: 300
    },
];

// TODO: Generate based on Real Data.
const data: GridRowsProp = [
    {
        id: 1,
        first_name: 'Jane',
        last_name: 'Doe',
        method_of_checkin: 'Doordash',
        timestamp: '12:30 PM'
    },
    {
        id: 2,
        first_name: 'Bob',
        last_name: 'Doen',
        method_of_checkin: 'On-Site',
        timestamp: '1:15 PM'
    },
    {
        id: 3,
        first_name: 'Jenna',
        last_name: 'Worthington',
        method_of_checkin: 'Doordash',
        timestamp: '3:45 PM'
    },
    {
        id: 4,
        first_name: 'Bill',
        last_name: 'Nye',
        method_of_checkin: 'On-Site',
        timestamp: '9:20 AM'
    },
    {
        id: 5,
        first_name: 'Sara',
        last_name: 'SpringStein',
        method_of_checkin: 'Doordash',
        timestamp: '7:15 AM'
    }
];

function addCheckin() {
  const phoneNumber = prompt("Phone number");
  const recipients = prompt("Recipients");
  const type = prompt("Type");
  const weight = prompt("Weight");
}

export default function Dashboard() {
    return (
        <Box component='div' sx={{ overflowX: 'clip', position: 'relative', margin: 'auto', maxWidth: '1920px', padding: '2em' }}>
            <Grid container spacing={0} direction='column' sx={{ width: '100%' }}>

                <Grid item container direction='column' spacing={0} sx={{ flexDirection: 'column' }}>

                    {/* TODO: Implement Cards. */}
                    <Stack direction='row' spacing={3}>
                        <DataCard subtitle={'Total checkins today'} value={100} prev={120} />
                        <DataCard subtitle={'Total volunteers today'} value={4} prev={20} />
                        <DataCard subtitle={'Total household today'} value={3000} prev={2700} />
                        {/* <DataCard subtitle={'Food weight'} value={25} units={'lbs'} /> */}
                    </Stack>

                    {/* TODO: Implement Dynamic List */}
                    <Stack direction='row' spacing={0} sx={{ marginTop: '5em' }}>
                        <Typography variant='h6' sx={{ flexGrow: 1 }}>Recent Checkins</Typography>
                        <Button variant='contained' disableElevation disableRipple disableTouchRipple sx={{ textTransform: 'none' }} onClick={addCheckin}>+ Add Checkin</Button>
                    </Stack>
                    <Paper component='div' elevation={3} sx={{ height: 500, width: '100%', marginTop: '2em' }}>
                        <DataGrid rows={data} columns={fields} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}