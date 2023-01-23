import mustache from "mustache";
import axios from "axios";
import { writeFileSync, readFileSync } from "fs";

const API_URL = "https://api.github.com/users/freitagfelipe";

function getAge() {
    const startDate = new Date("2002-10-21");
    const endDate = new Date();

    const ms = endDate.getTime() - startDate.getTime();

    const date = new Date(ms);

    return date.getUTCFullYear() - 1970;
}

async function getHireableStatus() {
    const result = await axios.get(`${API_URL}`);

    return result.data.hireable;
}

async function getRepositoriesCount() {
    const result = await axios.get(`${API_URL}`);

    return result.data.public_repos;
}

async function getStarsCount() {
    const result = await axios.get(`${API_URL}/starred`);

    return result.data.length;
}

const PATH = "./template.txt";

const content = readFileSync(PATH, "utf-8");

const age = getAge();
const hireableStatus = await getHireableStatus();
const repositoriesCount = await getRepositoriesCount();
const starredCount = await getStarsCount();

const README = mustache.render(content, {
    age,
    hireableStatus,
    repositoriesCount,
    starredCount
});

writeFileSync("README.md", README);