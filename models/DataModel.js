const mongoose=require('mongoose');

const dataSchema = new mongoose.Schema({
    username: String,
    name: String,
    phone: String,
    regno: String,
    address: String,
    email: String,
    date: String,
    gender: String,
    age: String,
    fatherName: String,
    motherTongue: String,
    languages: [String],
    educationList: [
      {
        school: String,
        degree: String,
        board: String,
        startYear: String,
        endYear: String,
        marks: String,
      }
    ],
    hobbies: [String],
    profilePhoto: String,
    signature: String,
    coCurricularActivities: [String],
    extraCurricularActivities: [String],
    achievements: [String],
    professionalObjective: String,
    projectList: [
      {
        name: String,
        description: String,
        link: String,
      }
    ],
    programmingLanguages: [String],
    toolsAndTechnologies: [String],
    areasOfInterest: [String],
  });

const DataModel=mongoose.model("data",dataSchema);
module.exports=DataModel;