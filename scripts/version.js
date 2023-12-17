#!/usr/bin/env node

import fs from "fs"
import path from "path"
import semver from "semver"
import yargs from "yargs"
import versions from "../meta-versions.json" assert { type: "json" }

const args = yargs(process.argv.slice(2))
  .option("increment", {
    type: "string",
    alias: "i",
    choices: ["major", "minor", "patch", "prerelease"],
    describe: "Specifies the new version",
  })
  .option("prerelease", {
    type: "boolean",
    alias: "p",
    default: false,
    describe: "Specifies whether this is a prerelease",
  })
  .demandOption("increment")
  .parse()

;(function run() {
  const { prerelease, increment } = args
  let newVersions = { ...versions }

  // Only bump the current pre-release version
  if (prerelease && increment === "prerelease") {
    const { develop } = versions

    newVersions.develop = semver.inc(
      develop,
      "prerelease",
      prerelease ? "beta" : undefined
    )

    console.log(`🎉 Successfully updated to version ${newVersions.develop}`)
  }

  // Set a new prerelease at the new increment
  else if (prerelease) {
    const { develop } = versions

    newVersions.develop = semver.inc(
      develop,
      increment,
      prerelease ? "beta" : undefined
    )

    console.log(`🎉 Successfully updated to version ${newVersions.develop}`)
  }

  // Set the version by the new increment
  else {
    const { main } = versions

    newVersions.main = semver.inc(main, increment)

    console.log(`🎉 Successfully updated to version ${newVersions.main}`)
  }

  fs.writeFileSync(
    path.resolve(process.cwd(), "./meta-versions.json"),
    JSON.stringify(newVersions, null, 2),
    "utf8"
  )
})()
