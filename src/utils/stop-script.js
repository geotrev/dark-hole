import { notify } from "./notify.js"

export function stopScript(name) {
  const content = `🛑 Stopped script: Dark Hole - ${name}`

  console.log({ content })
  notify({ content })
}
