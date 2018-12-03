const createQuestions = (index, envs, versions, projects) => {
  const questions = {
    project: {
      name: "project",
      type: "list",
      message: "Which project would you like to select:",
      choices: projects
    },
    environment: {
      name: "environment",
      type: "list",
      message: "Which env would you like to select:",
      choices: envs
    },
    version: {
      name: "version",
      type: "list",
      message: "Which version would you like to deploy:",
      choices: versions
    },
    confirmation: {
      name: "confirmation",
      type: "confirm",
      message: "Are you sure you would like to proceed?"
    }
  };

  return questions[index];
};

export default createQuestions;
