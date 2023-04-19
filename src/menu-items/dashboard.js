// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',

    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Countries',
            type: 'item',
            url: '/sample-page',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        },
        {
            id: 'thirdparty',
            title: 'Third Party URL',
            type: 'item',
            url: '/third-party',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        },
        {
            id: 'uploadFB',
            title: 'Upload Database',
            type: 'item',
            url: '/upload-database',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
