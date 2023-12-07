import metablock from "rollup-plugin-userscript-metablock"
import terser from "@rollup/plugin-terser"
import glob from "glob"
import path from "path"
import fs from "fs"

import pkg from "./package.json"
import metaVersions from "./meta-versions.json"

const repoRootUrl = pkg.repository.url.slice(4, -4)
const scriptSources = glob.sync(path.resolve("src/!(utils)/*.js"))

function getScriptUrl(name) {
  return `${repoRootUrl}/raw/main/dist/${name}.user.js`
}

function getBetaScriptUrl(name) {
  return `${repoRootUrl}/raw/develop/dist/${name}-dev.user.js`
}

/**
 * Generates an array of rollup configs with a shallow iterationthrough src/
 *
 * - config.input is always src\/*\/index.js
 * - config.output.file is always dist/<src_dir_name>[-<build_type>].user.js
 * - override to meta block is derived from src\/*\/meta.json
 */

export default scriptSources.reduce((configs, sourcePath) => {
  const pathParts = sourcePath.split("/")
  const dir = pathParts[pathParts.length - 2]
  const dirPath = pathParts.slice(0, -1).join("/")
  const name = pathParts[pathParts.length - 1].replace(".js", "")
  const standardFile = path.resolve(
    process.cwd(),
    `dist/${dir}-${name}.user.js`
  )
  const betaFile = path.resolve(
    process.cwd(),
    `dist/${dir}-${name}-dev.user.js`
  )

  const metaPath = `${dirPath}/${name}.meta.json`
  const metaOverride = fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
    : undefined

  const scriptUrl = getScriptUrl(name)
  const betaScriptUrl = getBetaScriptUrl(name)

  return [
    ...configs,
    /* Standard build */
    {
      input: sourcePath,
      output: [
        {
          file: standardFile,
          format: "iife",
          plugins: [
            metablock({
              file: path.resolve(process.cwd(), "./meta-common.json"),
              override: {
                ...metaOverride,
                version: metaVersions.main,
                downloadURL: scriptUrl,
                updateURL: scriptUrl,
              },
            }),
          ],
        },
      ],
      plugins: [
        terser({
          mangle: true,
          format: {
            comments: function (_, comment) {
              var text = comment.value
              var type = comment.type
              if (type == "comment1") {
                return /@[a-zA-Z]|UserScript/i.test(text)
              }
            },
          },
        }),
      ],
    },
    /* Beta build */
    {
      input: sourcePath,
      output: [
        {
          file: betaFile,
          format: "iife",
          generatedCode: { compact: false },
          plugins: [
            metablock({
              file: path.resolve(process.cwd(), "./meta-common.json"),
              override: {
                ...metaOverride,
                version: metaVersions.develop,
                downloadURL: betaScriptUrl,
                updateURL: betaScriptUrl,
              },
            }),
          ],
        },
      ],
    },
  ]
}, [])
