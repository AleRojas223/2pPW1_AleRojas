import { RouterProvider } from 'react-router-dom';
import './App.css';
import './index.css';
import router from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}


