import { $ } from "bun";

async function runScript() {
    const response = await fetch("http://localhost:4000/healthz");


await $`cat < ${response} | wc -m`
}

runScript();