import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';

function App() {
  return (
    <UserPreferencesProvider>
      <RouterProvider router={router} />
    </UserPreferencesProvider>
  );
}

export default App;