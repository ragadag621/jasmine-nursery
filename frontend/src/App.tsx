import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AppRouter } from '@/routes/AppRouter';

/**
 * dir="rtl" at the app root — Hebrew and Arabic are both RTL, and the
 * whole layout (public + admin) is built RTL-first per the design plan.
 */
function App() {
  return (
    <div dir="rtl" lang="he">
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
