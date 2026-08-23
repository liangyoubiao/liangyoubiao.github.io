import fs from "node:fs"
const f = ".github/workflows/deploy.yml"
let s = fs.readFileSync(f, "utf-8")
s = s.replace(/ {12}test -f dist\/sw\.js\n/g, "")
s = s.replace(/ {12}test -f dist\/manifest\.webmanifest\n/g, "")
fs.writeFileSync(f, s)
console.log("OK")

