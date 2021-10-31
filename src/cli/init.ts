import inquirer from "inquirer";

const questions = [
  {
    type: "input",
    name: "source",
    message: "What's the path of your swagger or openapi",
    validate(input: any) {
      if (!input) {
        return "This field cannot be empty!";
      }
      return true;
    },
  },
  {
    type: "confirm",
    name: "hasOneMore",
    default: true,
    message: "Add one more swagger file",
  },
  {
    type: "input",
    name: "output",
    default: "mock-server",
    message: "Which folder you want to store your mock server",
    when(answers: any) {
      return !answers.hasOneMore;
    },
  },
];

let output: any = {};

function ask(): any {
  return inquirer.prompt(questions).then((answers: any) => {
    output = {
      ...output,
      ...answers,
      source: [...(output.source || []), answers.source],
    };

    if (answers.hasOneMore) {
      return ask();
    }
  });
}

ask().then(() => {
  console.log(output);
});
