import "./App.css";
import Form from "./component/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./component/Dashboard";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isloggedin = localStorage.getItem("user:token") !== null;
  if (!isloggedin) {
    return <Navigate to="/" />;
  }
  return children
};

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<Form isSignIn={true} />} />
      <Route path="/" element={<Form isSignIn={false} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
    //
  );
}

export default App;
