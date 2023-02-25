import mustache from "mustache";
import axios from "axios";
import * as cheerio from "cheerio";
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

async function getTotalRepositories() {
    const result = await axios.get(`${API_URL}`);

    return result.data.public_repos;
}

async function getGithubStats() {
    const URL =
        "https://github-readme-stats.vercel.app/api?username=freitagfelipe&count_private=true";
    const result = await axios.get(URL);
    const $ = cheerio.load(result.data);
    const githubStats = $("text[data-testid]")
        .toArray()
        .map((el) => $(el).text().trim());

    return {
        starsEarned: githubStats[1],
        totalCommits: githubStats[2],
        totalPullRequests: githubStats[3],
        totalIssues: githubStats[4],
    };
}

async function getMostUsedLanguages() {
    const URL =
        "https://github-readme-stats.vercel.app/api/top-langs/?username=freitagfelipe&hide_progress=true";
    const result = await axios.get(URL);
    const $ = cheerio.load(result.data);
    const languages = $("text.lang-name")
        .toArray()
        .map((el) => $(el).text().trim());

    return languages.join(", ");
}

const PATH = "./template.txt";

const content = readFileSync(PATH, "utf-8");

const age = getAge();
const hireableStatus = await getHireableStatus();
const totalRepositories = await getTotalRepositories();
const { starsEarned, totalCommits, totalPullRequests, totalIssues } =
    await getGithubStats();
const mostUsedLanguages = await getMostUsedLanguages();

const README = mustache.render(content, {
    age,
    hireableStatus,
    totalRepositories,
    starsEarned,
    totalCommits,
    totalPullRequests,
    totalIssues,
    mostUsedLanguages,
});

writeFileSync("README.md", README);
