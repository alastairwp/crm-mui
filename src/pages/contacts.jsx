import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import Employees from "../pages/Employees/Employees";
import EmployeeForm from "../pages/Employees/EmployeeForm";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import * as personAPI from "../services/personAPI";
import { raiseNotification } from "../index";

const Contacts = (props) => {
  const { mode, title, subTitle } = props;
  const [errors, setErrors] = useState({});
  const [contactProfile, setContactProfile] = useState([]);
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState([]);
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
          //console.log(contactProfile);
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

    if (mode === "edit") {
      getUser();
    }
    getAllUsers();
  }, [props, mode]);

  const handleRowClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = records.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const getAllUsers = async () => {
    try {
      const res = await personAPI.getAllPersons();
      if (res.status === 200 && res.data !== null) {
        setRecords(res.data);
      }
    } catch (err) {
      raiseNotification(
        "Error",
        `Person could not get all persons: ${err.message}`,
        "danger"
      );
    }
  };

  const handleInputChange = (e) => {
    //e.preventDefault();
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
    // if ("department" in fieldValues)
    //   temp.department =
    //     fieldValues.department.length !== 0 ? "" : "This field is required.";
    // if ("jobTitle" in fieldValues)
    //   temp.jobTitle = fieldValues.jobTitle ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === contactProfile)
      return Object.values(temp).every((x) => x === "");
  };

  const handleNewContact = async (e) => {
    //e.preventDefault();

    const { firstName, lastName } = contactProfile;
    if (validate()) {
      const res = await personAPI.newPerson(contactProfile);
      if (res.status === 200 && res.data !== null) {
        resetForm();
        getAllUsers();
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
        getAllUsers();
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

  const handleDelete = async () => {
    setSelected(
      records.filter((r) => selected.filter((sr) => sr.id === r.id).length < 1)
    );

    for (let i = 0; i < selected.length; i++) {
      try {
        const res = await personAPI.deletePerson(selected[i]);
        if (res.data.deletedCount === 1) {
          raiseNotification("", "Person was deleted successfully", "success");
          setSelected([]);
          try {
            const res = await personAPI.getAllPersons();
            if (res.status === 200 && res.data !== null) {
              setRecords(res.data);
            }
          } catch (err) {
            raiseNotification(
              "Error",
              `Person could not get all persons: ${err.message}`,
              "danger"
            );
          }
        }
      } catch (err) {
        raiseNotification(
          "Error",
          `Person could not be deleted: ${err.message}`,
          "danger"
        );
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
        onUpdateContact={handleUpdateContact}
      />
      <Employees
        records={records}
        onDelete={handleDelete}
        onSelectAllClick={handleSelectAllClick}
        onRowClick={handleRowClick}
        selected={selected}
      />
    </>
  );
};

export default Contacts;
