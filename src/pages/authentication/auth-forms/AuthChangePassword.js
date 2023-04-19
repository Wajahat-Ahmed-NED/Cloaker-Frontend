import React, { useEffect } from 'react';

// material-ui
import { Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import { message } from 'antd';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets

import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { changePassword } from 'api/api';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// ============================|| FIREBASE - LOGIN ||============================ //
message.config({
    top: 70,
    duration: 3
});
const AuthChangePassword = () => {
    const [loader, setLoader] = React.useState(false);
    const [notify, setNotify] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [val, setVal] = React.useState({});

    const handleChangePassword = async (values) => {
        console.log(values);
        setLoader(true);

        changePassword(values)
            .then((res) => {
                message.success('Password Changed Successfully');
                setTimeout(() => {
                    localStorage.removeItem('clientToken');
                    window.location.replace('/');
                }, 2000);
            })
            .catch((err) => message.error('Password Could Not Be Updated'));
        setLoader(false);
    };

    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            {notify && (
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert severity="error" sx={{ width: '100%' }} onClose={handleClose}>
                        Wrong Email or Password!
                    </Alert>
                </Snackbar>
            )}

            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    newPassword: '',
                    confirmPassword: '',
                    checkPassword: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().max(255).required('Username is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    newPassword: Yup.string().max(255).required('New Password is required'),
                    confirmPassword: Yup.string().max(255).required('Confirm Password is required'),
                    checkPassword: Yup.string().max(255).required('Passwords do not match')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(false);
                        setVal(values);
                        handleChangePassword(values);
                    } catch (err) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-login">Username</InputLabel>
                                    <OutlinedInput
                                        id="email-login"
                                        type="username"
                                        value={values.username}
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter username"
                                        fullWidth
                                        error={Boolean(touched.username && errors.username)}
                                    />
                                    {touched.username && errors.username && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.username}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login">Old Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter password"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="newpassword-login">New Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.newPassword && errors.newPassword)}
                                        id="-newpassword-login"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={values.newPassword}
                                        name="newPassword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowNewPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter New Password"
                                    />
                                    {touched.newPassword && errors.newPassword && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.newPassword}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="confirmpassword-login">Confirm Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                        id="-confirmpassword-login"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={values.confirmPassword}
                                        name="confirmPassword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter Confirm password"
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.confirmPassword}
                                        </FormHelperText>
                                    )}
                                    {values.newPassword !== values.confirmPassword && values.confirmPassword.length > 0 && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.checkPassword}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting || loader}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleChangePassword(values)}
                                    >
                                        Update Password
                                    </Button>
                                    {loader && <LinearProgress />}
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthChangePassword;
