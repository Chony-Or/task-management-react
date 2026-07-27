import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page at root */}
        <Route path="/" element={<Login />} />
        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


// function App() {

//   return (
//     <>
//       <div className="flex items-center justify-center h-screen bg-blue-500">
//         <h1 className="text-5xl font-bold text-white">
//           Tailwind is Working!
//         </h1>
//       </div>
//     </>
//   )
// }

// export default App
