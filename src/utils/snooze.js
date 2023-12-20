export async function snooze(delay = 50) {
  return new Promise(() =>
    setTimeout(() => requestAnimationFrame(() => {}), delay)
  )
}
