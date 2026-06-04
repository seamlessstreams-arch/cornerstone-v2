import { chromium } from "playwright";
const URL = "https://cornerstone-v2-fresh.vercel.app";
const pages = ["/dashboard","/event-stream","/event-intelligence","/incidents","/complaints"];
const b = await chromium.launch();
for (const route of pages) {
  const pg = await b.newPage();
  const failed = [];
  pg.on("response", r => { const s=r.status(); if (s>=400) { const u=r.url().replace(URL,""); failed.push(s+" "+u); } });
  pg.on("pageerror", e => failed.push("PAGEERROR "+(e.message||e).slice(0,120)));
  await pg.goto(URL+route, { waitUntil:"networkidle", timeout:45000 }).catch(e=>failed.push("GOTO "+e.message));
  await pg.waitForTimeout(2000);
  const uniq=[...new Set(failed)];
  console.log("\n=== "+route+" === ("+uniq.length+" failures)");
  uniq.slice(0,25).forEach(f=>console.log("  "+f));
  await pg.close();
}
await b.close();
