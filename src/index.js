#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import { table } from "table";
import { version } from "../package.json";
import createQuestions from "./script/questions";
import parseAnswers from "./service/answers";
import { getManifest, grabAWSObjects, uploadNewVersionFile } from "./utils/aws_s3";
import { objectToStream } from "./utils/toStream";

(async () => {
  try {
    console.log(`Welcome to prd-cli ${version}! your deployments your way ;p`);

    const answers = {
      project: null,
      environment: null,
      version: null
    };
    const options = {
      projects: await grabAWSObjects("projects"),
      environments: [],
      versions: []
    };

    const uploadToS3 = async () => {
      const files = Object.values(await getManifest(answers));
      const fullPath = `lib/${answers.project}/environments/${answers.environment}/manifest.json`;
      const stream = objectToStream({ version: answers.version, files });
      return uploadNewVersionFile(fullPath, stream);
    };

    const promptUser = async question =>
      Object.assign(
        answers,
        await inquirer.prompt(createQuestions(question, options.environments, options.versions, options.projects))
      );

    // Project Name
    await promptUser("project");

    // Environment Name
    options.environments = await parseAnswers("projectName", answers);
    await promptUser("environment");

    // Version
    options.versions = await parseAnswers("envName", answers);
    await promptUser("version");

    // Confirm
    console.log(table(Object.entries(answers)));
    await promptUser("confirmation");

    if (answers.confirmation) {
      await uploadToS3();
      console.log(chalk.green("Deploy success!"));
    }

    console.log("Thank you for using prd-cli, visit again! :)");
  } catch (err) {
    console.log(chalk.red(err));
  }
})();
