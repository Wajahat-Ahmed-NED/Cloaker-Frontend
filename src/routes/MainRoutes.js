import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import ThirdPartyURL from 'pages/extra-pages/thirdPartyURL';
import UploadDatabase from 'pages/extra-pages/uploadDatabase';
// import AuthLogin from 'pages/authentication/auth-forms/AuthLogin';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
// ==============================|| MAIN ROUTING ||============================== //

const token = JSON.parse(localStorage.getItem('clientToken'));
const MainRoutes = {
    path: '/',
    element: token ? <MainLayout /> : <AuthLogin />,
    children: [
        {
            path: '/',
            element: <SamplePage />
        },
        {
            path: 'color',
            element: <Color />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'third-party',
            element: <ThirdPartyURL />
        },
        {
            path: 'upload-Database',
            element: <UploadDatabase />
        },
        {
            path: 'shadow',
            element: <Shadow />
        },
        {
            path: 'typography',
            element: <Typography />
        },
        {
            path: 'icons/ant',
            element: <AntIcons />
        }
    ]
};

export default MainRoutes;
