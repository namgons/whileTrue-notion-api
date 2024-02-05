import { queryDatabase } from "./src/notion/database";
require("dotenv").config();
import { printProblems } from "./src/notion/utils";

(async () => {
  printProblems(process.env.ACCESS_TOKEN);
})();
