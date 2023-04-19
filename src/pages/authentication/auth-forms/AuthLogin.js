import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Button, FormHelperText, Grid, Link, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets

import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { signIn } from 'api/api';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
    const [loader, setLoader] = React.useState(false);
    const [notify, setNotify] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [val, setVal] = React.useState({});

    const handleLogin = async (values) => {
        setLoader(true);
        console.log(values);
        signIn(values)
            .then((res) => {
                console.log(res.data);
                setLoader(false);
                localStorage.setItem('clientToken', JSON.stringify(res.data.data));
                window.location.replace('/');
            })
            .catch((err) => {
                setOpen(true);
                setNotify(true);
                setLoader(false);
            });
    };

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
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

    // useEffect(() => {
    //     Wazuh();
    // }, []);

    return (
        <>
            {notify && (
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert severity="error" sx={{ width: '100%' }} onClose={handleClose} style={{ color: 'white' }}>
                        Wrong Credentials
                    </Alert>
                </Snackbar>
            )}

            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().max(255).required('Username is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(false);
                        setVal(values);
                        handleLogin(values);
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
                                        value={values.email}
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Username"
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
                                    <InputLabel htmlFor="password-login">Password</InputLabel>
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
                                                    {showPassword ? (
                                                        <EyeOutlined style={{ color: 'white' }} />
                                                    ) : (
                                                        <EyeInvisibleOutlined style={{ color: 'white' }} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Password"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            {/* <Grid item xs={12} sx={{ mt: -1 }}>
                                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                                    
                                    <Link variant="h6" component={RouterLink} to="" color="text.primary">
                                        Forgot Password?
                                    </Link>
                                </Stack>
                            </Grid> */}
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
                                    >
                                        Login
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

export default AuthLogin;
