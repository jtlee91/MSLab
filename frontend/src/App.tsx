import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastProvider } from './components/common';
import { AppLayout } from './components/layout';
import { CagesPage, DashboardPage, SettingsPage } from './pages';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <CagesPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
