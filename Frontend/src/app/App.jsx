import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
import { router } from './router';

export function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
