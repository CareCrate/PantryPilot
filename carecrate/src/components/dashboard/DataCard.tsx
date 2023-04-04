import { Card, CardContent, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { FunctionComponent, useState, MouseEvent } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';

type Props = {
    subtitle: string,
    value: number,
    prev: number,
    units?: string | '',
    showPercent: boolean
}

const DataCard: FunctionComponent<Props> = ({ subtitle, value, prev, units, showPercent }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const percentage: number = -1 * Math.round(((prev - value) / prev) * 100);
    return (
        <Card>
            <CardContent>
                <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography variant='h6' sx={{ flexGrow: 1 }}>{value} {units}</Typography>
                    {showPercent && 
                        <Typography variant='subtitle2' sx={{ background: percentage < 0 ? '#F66E64' : '#7FB069', color: '#FFF', borderRadius: '0.7em', padding: '0.5em', opacity: '80%' }}>{percentage > 0 ? `+${percentage}` : percentage}%</Typography>
                    }
                    <IconButton aria-label='more options' onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                </Stack>
                <Typography variant='body2' sx={{ marginTop: '2em', textTransform: 'none' }}>{subtitle}</Typography>
            </CardContent>
            <Menu id='more-options-menu' anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Edit</MenuItem>
                {/* <MenuItem onClick={handleClose}>View Data</MenuItem> */}
            </Menu>
        </Card>
    )
}

export default DataCard;