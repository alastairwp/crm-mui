import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import EmployeeForm from "../pages/Employees/EmployeeForm";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import * as personAPI from "../services/personAPI";
import { raiseNotification } from "../index";
import { useHistory } from "react-router-dom";

const NewContact = (props) => {
  const { mode, title, subTitle } = props;
  let history = useHistory();
  const [errors, setErrors] = useState({});
  const [contactProfile, setContactProfile] = useState([]);
  const initialFValues = {
    id: 0,
    firstName: "",
    lastName: "",
    jobTitle: "",
    role: "",
    organisation: "",
    department: "",
    email: "",
    phoneWork: "",
    phoneMobile: "",
    location: "",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setContactProfile({
      ...contactProfile,
      [name]: value,
    });

    validate({ [name]: value });
  };

  const validate = (fieldValues = contactProfile) => {
    let temp = { ...errors };
    if ("firstName" in fieldValues)
      temp.firstName = fieldValues.firstName ? "" : "This field is required.";
    if ("lastName" in fieldValues)
      temp.lastName = fieldValues.lastName ? "" : "This field is required.";
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email)
        ? ""
        : "Email is not valid.";
    setErrors({
      ...temp,
    });

    if (fieldValues === contactProfile)
      return Object.values(temp).every((x) => x === "");
  };

  const handleNewContact = async (e) => {
    e.preventDefault();
    const { firstName, lastName } = contactProfile;
    if (validate()) {
      const res = await personAPI.newPerson(contactProfile);
      if (res.status === 200 && res.data !== null) {
        //resetForm();
        console.log(history);
        raiseNotification(
          "",
          `New person ${firstName} ${lastName} added successfully`,
          "success"
        );
        history.push("/person/all");
      }
    }
  };

  const resetForm = () => {
    setContactProfile(initialFValues);
    setErrors({});
  };

  return (
    <>
      <PageHeader
        title={title}
        subTitle={subTitle}
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />

      <EmployeeForm
        {...props}
        mode={mode}
        onInputChange={handleInputChange}
        onValidate={validate}
        onResetForm={resetForm}
        contactProfile={contactProfile}
        errors={errors}
        onNewContact={handleNewContact}
      />
    </>
  );
};

export default NewContact;
