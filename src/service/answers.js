import { grabAWSObjects, grabCurrentVersion } from "../utils/aws_s3";

const parseAnswers = (type, answers) => {
  switch (type) {
    case "envName":
      return envNameChange(answers);
    case "projectName":
      return projectNameChange(answers);
    case "versionName":
      return versionChange(answers);
  }
};

const projectNameChange = ({ project }) => {
  console.log("You Choose:", project);
  return grabAWSObjects("envs", project);
};

const envNameChange = ({ environment, project }) => {
  console.log("You Choose:", environment);
  const path = `lib/${project}/environments/${environment}/manifest.json`;
  grabCurrentVersion(path);
  return grabAWSObjects("versions", project);
};

const versionChange = version => {
  console.log("You Choose:", version);
};

export default parseAnswers;
