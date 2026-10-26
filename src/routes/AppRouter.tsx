import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import HospitalDetailPage from '@/pages/HospitalDetailPage';
import HospitalSearchResultPage from '@/pages/HospitalSearchResultPage';
import UniversityMallPage from '@/pages/UniversityMallPage';

function AppLayoutRoute() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/mall/university" replace />} />
        <Route element={<AppLayoutRoute />}>
          <Route path="/mall/university" element={<UniversityMallPage />} />
          <Route
            path="/mall/university/results"
            element={<HospitalSearchResultPage />}
          />
          <Route
            path="/mall/university/hospitals/:hospitalId"
            element={<HospitalDetailPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
