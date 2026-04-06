import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const AppTemplate = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AppTemplate;
