import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import * as personAPI from "../../services/personAPI";
import { raiseNotification } from "../../index";
import { makeStyles } from "@material-ui/core/styles";

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

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
}));

export default function EmployeeForm(props) {
  const classes = useStyles();
  const [errors, setErrors] = useState({});
  const [userProfile, setUserProfile] = useState([]);
  const { mode } = props;

  useEffect(() => {
    const personId = props.match.params.id;
    const getUser = async () => {
      try {
        const res = await personAPI.getPersonById(personId);
        if (res.status === 200 && res.data !== null) {
          setUserProfile(res.data);
        } else {
          raiseNotification(
            "Error",
            "Could not get user with id: " + personId,
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
  }, [props, mode]);

  const handleInputChange = (e) => {
    //e.preventDefault();
    const { name, value } = e.target;

    setUserProfile({
      ...userProfile,
      [name]: value,
    });

    validate({ [name]: value });
  };

  const validate = (fieldValues = userProfile) => {
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

    if (fieldValues === userProfile)
      return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    //e.preventDefault();
    if (mode === "new") {
      const { firstName, lastName } = userProfile;
      if (validate()) {
        const res = await personAPI.newPerson(userProfile);
        if (res.status === 200 && res.data !== null) {
          resetForm();

          raiseNotification(
            "",
            `New person ${firstName} ${lastName} added successfully`,
            "success"
          );
        }
      }
      props.history.push("/person/all");
    } else {
      const updatedPerson = userProfile;

      try {
        const res = await personAPI.updatePerson(updatedPerson);
        if (res.status === 200 && res.data !== null) {
          raiseNotification(
            "",
            `Profile '${updatedPerson.firstName} ${updatedPerson.lastName}' was updated successfully`,
            "success"
          );
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
    }
  };

  const resetForm = () => {
    setUserProfile(initialFValues);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className={classes.root} autoComplete="off">
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="firstName"
            label="First name"
            value={userProfile.firstName ? userProfile.firstName : ""}
            onChange={handleInputChange}
            error={errors.firstName}
          />
          <Controls.Input
            name="lastName"
            label="Last name"
            value={userProfile.lastName ? userProfile.lastName : ""}
            onChange={handleInputChange}
            error={errors.lastName}
          />
          <Controls.Input
            name="jobTitle"
            label="Job Title"
            value={userProfile.jobTitle ? userProfile.jobTitle : ""}
            onChange={handleInputChange}
            error={errors.jobTitle}
          />
          <Controls.Input
            name="role"
            label="Role"
            value={userProfile.role ? userProfile.role : ""}
            onChange={handleInputChange}
            error={errors.role}
          />
          <Controls.Input
            name="organisation"
            label="Organisation"
            value={userProfile.organisation ? userProfile.organisation : ""}
            onChange={handleInputChange}
            error={errors.organisation}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.Input
            label="Department"
            name="department"
            value={userProfile.department ? userProfile.department : ""}
            onChange={handleInputChange}
            error={errors.department}
          />
          <Controls.Input
            label="Email"
            name="email"
            value={userProfile.email ? userProfile.email : ""}
            onChange={handleInputChange}
            error={errors.email}
          />
          <Controls.Input
            label="Location"
            name="location"
            value={userProfile.location ? userProfile.location : ""}
            onChange={handleInputChange}
            error={errors.location}
          />
          <Controls.Input
            label="Phone (work)"
            name="phoneWork"
            value={userProfile.phoneWork ? userProfile.phoneWork : ""}
            onChange={handleInputChange}
            error={errors.phoneWork}
          />
          <Controls.Input
            label="Phone (mob)"
            name="phoneMobile"
            value={userProfile.phoneMobile ? userProfile.phoneMobile : ""}
            onChange={handleInputChange}
            error={errors.phoneMobile}
          />

          <div>
            <Controls.Button
              type="submit"
              text={mode === "new" ? "Submit" : "Update"}
            />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </form>
  );
}
