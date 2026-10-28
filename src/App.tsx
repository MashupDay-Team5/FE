import AppRouter from '@/routes/AppRouter';
import ToastProvider from '@/components/common/ToastProvider';
import HospitalBookmarksProvider from '@/components/hospital/HospitalBookmarksProvider';

function App() {
  return (
    <ToastProvider>
      <HospitalBookmarksProvider>
        <AppRouter />
      </HospitalBookmarksProvider>
    </ToastProvider>
  );
}

export default App;
