import './App.css';
import { TableComponent } from './components/TableComponent';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

function App() {

  return (
    <div className="App">
      <TableComponent/>
    {/* <BrowserRouter>

      <Routes>
        <Route path='/' element={<TableComponent/>}>
        </Route>
      </Routes>
      </BrowserRouter> */}
    </div>

  );
}
export default App;
