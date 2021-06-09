const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let personSchema = new Schema({
  firstName: String,
  lastName: String,
  jobTitle: String,
  role: String,
  organisation: String,
  department: String,
  email: String,
  phoneWork: String,
  phoneMobile: String,
  location: String,
});

personSchema.method("transform", function () {
  let obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

module.exports = mongoose.model("Person", personSchema);
