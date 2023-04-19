// material-ui
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Countries from './countries';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createThirdURL } from 'api/api';
import Swal from 'sweetalert2';
import { useState } from 'react';

// ==============================|| SAMPLE PAGE ||============================== //

const ThirdPartyURL = () => {
    const [url, setURL] = useState('');

    const handleSave = () => {
        let obj = {
            url
        };
        url
            ? createThirdURL(obj)
                  .then((res) => {
                      Swal.fire('URL Saved', 'Done', 'success');
                      setURL('');
                  })
                  .catch((err) => {
                      Swal.fire('Failed', 'URL Could Not Saved', 'error');
                  })
            : Swal.fire('Failed', 'Enter URL First', 'error');
    };

    return (
        <>
            <MainCard title="Third Party URL">
                <TextField
                    id="outlined-basic"
                    label="Third Party URL"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                        setURL(e.target.value);
                    }}
                />
                <br />
                <br />
                <Button variant="contained" onClick={handleSave}>
                    Save URL
                </Button>
            </MainCard>
        </>
    );
};

export default ThirdPartyURL;
