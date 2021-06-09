import axios from "axios";
import { raiseNotification } from "../index";

export const getAllPersons = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/person");
    return res;
  } catch (err) {
    raiseNotification(
      "getAllUsers",
      "There was a problem getting all people from the database with error: " +
        err.message,
      "danger"
    );
  }
};

export const deletePerson = async (data) => {
  try {
    const res = await axios.delete(`http://localhost:5000/api/person/${data}`);
    return res;
  } catch (err) {
    raiseNotification(
      "deletePerson",
      "There was a problem deleting the person from the database with error: " +
        err.message,
      "danger"
    );
  }
};

export const updatePerson = async (updateData) => {
  try {
    const res = await axios.patch(
      `http://localhost:5000/api/person/${updateData.id}`,
      updateData
    );
    return res;
  } catch (err) {
    raiseNotification(
      "updatePerson",
      "There was a problem updating the person from the database with error: " +
        err.message,
      "danger"
    );
  }
};

export const getPersonById = async (personId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/person/${personId}`);
    return res;
  } catch (err) {
    raiseNotification(
      "getPersonById",
      "There was a problem getting the person by ID from the database with error: " +
        err.message,
      "danger"
    );
  }
};

export const getPersonByName = async (data) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/person?firstname=${data.firstName}&lastname=${data.lastName}`
    );
    return res;
  } catch (err) {
    raiseNotification(
      "getPersonByName",
      "There was a problem getting the person by name from the database with error: " +
        err.message,
      "danger"
    );
  }
};

export const newPerson = async (newPersonData) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/person",
      newPersonData
    );
    return res;
  } catch (err) {
    raiseNotification(
      "newPerson",
      "Error creating new person: " + err.message,
      "danger"
    );
  }
};
