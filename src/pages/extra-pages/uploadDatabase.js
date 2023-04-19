// material-ui
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Countries from './countries';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useState } from 'react';
import axios from '../../../node_modules/axios/index';
import Swal from 'sweetalert2';

// ==============================|| SAMPLE PAGE ||============================== //

const UploadDatabase = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [btn, setBtn] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        setBtn(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        axios
            .post('http://localhost:2001/uploadFile', formData)
            .then((response) => {
                // console.log(response.data);
                Swal.fire('File Uploaded', 'Successfully', 'success');
                setSelectedFile(null);
                setBtn(false);
            })
            .catch((error) => {
                Swal.fire('File Upload', 'Failed', 'error');
                setSelectedFile(null);
                setBtn(false);
                // console.log(error);
            });
    };
    return (
        <>
            <MainCard title="Upload Database">
                <TextField id="outlined-basic" label="Outlined" type="file" variant="outlined" fullWidth onChange={handleFileChange} />
                <br />
                <br />
                <Button variant="contained" onClick={handleFileUpload} disabled={btn}>
                    Upload <FileUploadIcon />{' '}
                </Button>{' '}
                &nbsp;&nbsp;
                {btn && <span>Uploading...</span>}
            </MainCard>
        </>
    );
};

export default UploadDatabase;
