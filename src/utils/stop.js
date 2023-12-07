import { notify } from "./notify.js"

export function stopScript(name) {
  const message = `🛑 Stopped script: Dark Hole - ${name}`

  console.log({ content: message })
  notify({ content: message })
}
