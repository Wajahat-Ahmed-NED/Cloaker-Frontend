// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthChangePassword from './auth-forms/AuthChangePassword';
import AuthWrapper from './AuthWrapper';

// ================================|| LOGIN ||================================ //

const ChangePassword = () => (
    <AuthWrapper>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="center" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                    <Typography variant="h3">Change Password</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <AuthChangePassword />
            </Grid>
        </Grid>
    </AuthWrapper>
);

export default ChangePassword;
