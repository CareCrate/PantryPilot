import DataCard from '@/components/dashboard/DataCard';
import Modal from '@/components/dashboard/Modal';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SessionUser } from '@/types';

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

export default function Dashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user as SessionUser | undefined;
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false)
    const handleAddCheckinClick = () => {
        setIsCheckInModalOpen(true);
    }

    useEffect(() => {
        if (status === "unauthenticated" && !session) {
            router.push('/login');
        }
    }, [status, session, router]);

    if (session) {
        console.log(session.user);
        return (
            <Box component='div' sx={{ overflowX: 'clip', position: 'relative', margin: 'auto', maxWidth: '1920px', padding: '2em' }}>
                <Grid container spacing={0} direction='column' sx={{ width: '100%' }}>
                    <Grid item container direction='column' spacing={0} sx={{ flexDirection: 'column' }}>
                        {/* TODO: Implement Cards. */}
                        <Stack direction='row' spacing={3}>
                            <DataCard subtitle={'Total checkins today'} value={100} prev={120} showPercent={true} session={session} editTitle={''} editSubtext={''} editElements={[]} />
                            <DataCard subtitle={'Total volunteers today'} value={4} prev={20} showPercent={true} session={session} editTitle={''} editSubtext={''} editElements={[]} />
                            <DataCard subtitle={'Total household today'} value={3000} prev={2700} showPercent={true} session={session} editTitle={''} editSubtext={''} editElements={[]} />
                            <DataCard subtitle={'Total weight tossed (lbs)'} value={0} prev={0} showPercent={false} session={session} editTitle={'Change Weight of Food Lost'} editSubtext={'Some cool subtext that makes sense.'} editElements={[
                                <TextField autoFocus margin="dense" id="weight" label="Weight" type="weight" fullWidth variant="standard" />
                            ]} />
                            {(user?.role === 'admin') && (
                            <DataCard subtitle={'Total weight of food (lbs)'} value={0} prev={0} showPercent={false} session={session} editTitle={'Change Weight of Food'} editSubtext={'Some cool subtext that makes sense.'} editElements={[
                                <TextField autoFocus margin="dense" id="weight" label="Weight" type="weight" fullWidth variant="standard" />
                            ]} />)}
                        </Stack>

                        {/* TODO: Implement Dynamic List */}
                        <Stack direction='row' spacing={0} sx={{ marginTop: '5em' }}>
                            <Typography variant='h6' sx={{ flexGrow: 1 }}>Recent Checkins</Typography>
                            <Button variant='contained' disableElevation disableRipple disableTouchRipple sx={{ textTransform: 'none' }} onClick={handleAddCheckinClick}>+ Add Checkin</Button>
                        </Stack>
                        <Paper component='div' elevation={3} sx={{ height: 500, width: '100%', marginTop: '2em' }}>
                            <DataGrid rows={data} columns={fields} />
                        </Paper>
                    </Grid>
                </Grid>
                <Modal open={isCheckInModalOpen} onClose={() => setIsCheckInModalOpen(false)} title='Checkin' content='To checkin a user, please enter in their associated informaton. If a phone number is found, the information will be populated automatically.' submitText='Submit' inputFields={[
                    <TextField autoFocus margin="dense" id="phone_number" label="Phone Number" type="phone-number" fullWidth variant="standard" />,
                    <TextField autoFocus margin="dense" id="recipient" label="Recipient" type="recipien" fullWidth variant="standard" />,
                    <TextField autoFocus margin="dense" id="checkin_type" label="Type" type="checkin-type" fullWidth variant="standard" />,
                    <TextField autoFocus margin="dense" id="weight" label="Weight" type="weight" fullWidth variant="standard" />,
                    <TextField autoFocus margin="dense" id="first_name" label="First Name" type="first-name" fullWidth variant="standard" />,
                    <TextField autoFocus margin="dense" id="last_name" label="last Name" type="last-name" fullWidth variant="standard" />,
                    <TextField autoFocus margin="dense" id="number_in_household" label="# in Household" type="number-in-household" fullWidth variant="standard" />,
                    <TextField autoFocus margin="dense" id="number_under_18" label="# Under 18" type="number-under-18" fullWidth variant="standard" />,
                    <TextField autoFocus margin="dense" id="number_over_60" label="# Over 60" type="number-over-60" fullWidth variant="standard" />,
                    <FormGroup> <FormControlLabel control={<Checkbox defaultChecked={false} />} label="Add Associated Name to Phone Number" /></FormGroup>
                ]}/>
            </Box>
        )
    }
}