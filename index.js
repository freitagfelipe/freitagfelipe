import mustache from "mustache";
import { writeFileSync, readFileSync } from "fs";

function getAge() {
    const startDate = new Date("2002-10-21");
    const endDate = new Date();

    const ms = endDate.getTime() - startDate.getTime();

    const date = new Date(ms);

    return date.getUTCFullYear() - 1970;
}

const PATH = "./template.txt";
const content = readFileSync(PATH, "utf-8");
const age = getAge();

const README = mustache.render(content, { age });

writeFileSync("README.md", README);
