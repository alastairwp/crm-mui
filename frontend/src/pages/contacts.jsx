import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import Employees from "../pages/Employees/Employees";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import * as personAPI from "../services/personAPI";
import { raiseNotification } from "../index";

const Contacts = (props) => {
  const { mode, title, subTitle } = props;
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
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

  return (
    <>
      <PageHeader
        title={title}
        subTitle={subTitle}
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
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
