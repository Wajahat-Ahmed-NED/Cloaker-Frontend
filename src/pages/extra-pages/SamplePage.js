// material-ui
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Countries from './countries';
import DropDown from './dropDown';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
    <>
        <MainCard title="Countries">
            {/* <DropDown /> */}
            <Countries />
        </MainCard>
    </>
);

export default SamplePage;
