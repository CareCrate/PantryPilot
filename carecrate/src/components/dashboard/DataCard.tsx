import { Card, CardContent, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";

type Props = {
    subtitle: string,
    value: number,
    prev: number,
    units?: string | ''
}

const DataCard: FunctionComponent<Props> = ({ subtitle, value, prev, units }) => {
    const percentage: number = -1 * Math.round(((prev - value) / prev) * 100);
    return (
        <Card>
            <CardContent>
                <Stack direction='row' spacing={0} sx={{ alignItems: 'center' }}>
                    <Typography variant='h6' sx={{ flexGrow: 1 }}>{value} {units}</Typography>
                    <Typography variant='subtitle2' sx={{ background: percentage < 0 ? '#F66E64' : '#69F664', color: '#FFF', borderRadius: '0.7em', padding: '0.5em' }}>{percentage > 0 ? `+${percentage}` : percentage}%</Typography>
                </Stack>
                <Typography variant='body2' sx={{ marginTop: '2em', textTransform: 'none' }}>{subtitle}</Typography>
            </CardContent>
        </Card>
    )
}

export default DataCard;