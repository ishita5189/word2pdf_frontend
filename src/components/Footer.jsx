import React, { useState } from "react";
function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <>
      <div className={`item-center justify-center`}>
        <hr className=" border-black" />
        <h1 className="text-center py-3 text-sm text-blue-700">
          Copyright © 2024 
        </h1>
      </div>
    </>
  );
}

export default Footer;