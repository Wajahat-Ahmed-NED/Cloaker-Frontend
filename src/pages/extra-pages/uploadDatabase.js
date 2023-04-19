// material-ui
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Countries from './countries';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FileUploadIcon from '@mui/icons-material/FileUpload';

// ==============================|| SAMPLE PAGE ||============================== //

const UploadDatabase = () => (
    <>
        <MainCard title="Upload Database">
            <TextField id="outlined-basic" label="Outlined" type="file" variant="outlined" fullWidth />
            <br />
            <br />
            <Button variant="contained">
                Upload <FileUploadIcon />{' '}
            </Button>
        </MainCard>
    </>
);

export default UploadDatabase;
