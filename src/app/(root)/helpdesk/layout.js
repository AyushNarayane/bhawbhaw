import React from "react";

export const metadata = {
  title: "Helpdesk",
  description: "Submit and view your queries.",
  keywords: "helpdesk, support, queries"
};

const HelpdeskLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default HelpdeskLayout;