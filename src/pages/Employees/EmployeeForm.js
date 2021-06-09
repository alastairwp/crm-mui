import React from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { makeStyles } from "@material-ui/core/styles";

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
  const {
    mode,
    onInputChange,
    contactProfile,
    errors,
    onNewContact,
    onUpdateContact,
    onResetForm,
  } = props;

  return (
    <form className={classes.root} autoComplete="off">
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="firstName"
            label="First name"
            value={contactProfile.firstName ? contactProfile.firstName : ""}
            onChange={onInputChange}
            error={errors.firstName}
          />
          <Controls.Input
            name="lastName"
            label="Last name"
            value={contactProfile.lastName ? contactProfile.lastName : ""}
            onChange={onInputChange}
            error={errors.lastName}
          />
          <Controls.Input
            name="jobTitle"
            label="Job Title"
            value={contactProfile.jobTitle ? contactProfile.jobTitle : ""}
            onChange={onInputChange}
            error={errors.jobTitle}
          />
          <Controls.Input
            name="role"
            label="Role"
            value={contactProfile.role ? contactProfile.role : ""}
            onChange={onInputChange}
            error={errors.role}
          />
          <Controls.Input
            name="organisation"
            label="Organisation"
            value={
              contactProfile.organisation ? contactProfile.organisation : ""
            }
            onChange={onInputChange}
            error={errors.organisation}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.Input
            label="Department"
            name="department"
            value={contactProfile.department ? contactProfile.department : ""}
            onChange={onInputChange}
            error={errors.department}
          />
          <Controls.Input
            label="Email"
            name="email"
            value={contactProfile.email ? contactProfile.email : ""}
            onChange={onInputChange}
            error={errors.email}
          />
          <Controls.Input
            label="Location"
            name="location"
            value={contactProfile.location ? contactProfile.location : ""}
            onChange={onInputChange}
            error={errors.location}
          />
          <Controls.Input
            label="Phone (work)"
            name="phoneWork"
            value={contactProfile.phoneWork ? contactProfile.phoneWork : ""}
            onChange={onInputChange}
            error={errors.phoneWork}
          />
          <Controls.Input
            label="Phone (mob)"
            name="phoneMobile"
            value={contactProfile.phoneMobile ? contactProfile.phoneMobile : ""}
            onChange={onInputChange}
            error={errors.phoneMobile}
          />

          <div>
            {mode === "new" ? (
              <Controls.Button
                type="submit"
                text="Create"
                onClick={onNewContact}
              />
            ) : (
              <Controls.Button
                type="submit"
                text="Update"
                onClick={onUpdateContact}
              />
            )}

            <Controls.Button
              text="Reset"
              color="default"
              onClick={onResetForm}
            />
          </div>
        </Grid>
      </Grid>
    </form>
  );
}
