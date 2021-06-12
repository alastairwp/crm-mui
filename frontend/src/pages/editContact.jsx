import React, { useState, useEffect } from "react";

import PageHeader from "../components/PageHeader";
import EmployeeForm from "../pages/Employees/EmployeeForm";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";

import * as personAPI from "../services/personAPI";
import { raiseNotification } from "../index";

const EditContact = (props) => {
  const { mode, title, subTitle } = props;
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

  useEffect(() => {
    const contactId = props.match.params.id;
    console.log(contactId);
    const getUser = async () => {
      try {
        const res = await personAPI.getPersonById(contactId);
        if (res.status === 200 && res.data !== null) {
          setContactProfile(res.data);
        } else {
          raiseNotification(
            "Error",
            "Could not get user with id: " + contactId,
            "danger"
          );
        }
      } catch (err) {
        raiseNotification("API Error", "me " + err.message, "danger");
      }
    };

    getUser();
  }, [props, mode]);

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
    const { firstName, lastName } = contactProfile;
    if (validate()) {
      const res = await personAPI.newPerson(contactProfile);
      if (res.status === 200 && res.data !== null) {
        resetForm();

        raiseNotification(
          "",
          `New person ${firstName} ${lastName} added successfully`,
          "success"
        );
      }
    }
  };

  const handleUpdateContact = async (e) => {
    const updatedPerson = contactProfile;
    e.preventDefault();
    try {
      const res = await personAPI.updatePerson(updatedPerson);
      if (res.status === 200 && res.data !== null) {
        resetForm();

        raiseNotification(
          "",
          `Profile '${updatedPerson.firstName} ${updatedPerson.lastName}' was updated successfully`,
          "success"
        );
        props.history.push("/person/all");
      } else {
        raiseNotification(
          "Error",
          `Could not update user ${updatedPerson.firstName} ${updatedPerson.lastName}`,
          "danger"
        );
      }
    } catch (err) {
      raiseNotification("API Error", err.message, "danger");
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
        onUpdateContact={handleUpdateContact}
      />
    </>
  );
};

export default EditContact;
