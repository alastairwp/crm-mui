import React from "react";
import PageHeader from "../components/PageHeader";
import Employees from "../pages/Employees/Employees";
import EmployeeForm from "../pages/Employees/EmployeeForm";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";

const Contacts = (props) => {
  const { mode, title, subTitle } = props;
  return (
    <>
      <PageHeader
        title={title}
        subTitle={subTitle}
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />
      <EmployeeForm {...props} mode={mode} />
      <Employees />
    </>
  );
};

export default Contacts;
