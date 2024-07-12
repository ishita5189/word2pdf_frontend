import React from "react";

function Navbar() {
  return (
    <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40 shadow-lg h-16 fixed top-0 left-0 right-0 z-50 bg-slate-200">
      <div className="flex justify-between">
        <h1 className="text-2xl cursor-pointer font-bold text-pink-600">
          Word<span className="text-3xl text-blue-600">To</span>PDF
        </h1>
          </div>
    </div>
  );
}

export default Navbar;
