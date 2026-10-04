
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RegistrationPage from "./RegistrationPage";
import RegistrationGrid from "./RegistrationGrid";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/registration" />}
        />

        {/* Registration form */}
        <Route
          path="/registration"
          element={<RegistrationPage />}
        />

        {/* Edit user */}
        <Route
          path="/registration/:id"
          element={<RegistrationPage />}
        />

        {/* Grid */}
        <Route
          path="/grid"
          element={<RegistrationGrid />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

