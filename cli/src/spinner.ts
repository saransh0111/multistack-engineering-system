import pc from "picocolors";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

/**
 * Runs an async task while showing a single-line Braille spinner (clears when done).
 */
export async function withSpinner<T>(message: string, fn: () => Promise<T>): Promise<T> {
  let i = 0;
  const id = setInterval(() => {
    const frame = FRAMES[i % FRAMES.length];
    process.stdout.write(`\r  ${pc.cyan(frame)} ${pc.dim(message)}`);
    i += 1;
  }, 80);
  try {
    return await fn();
  } finally {
    clearInterval(id);
    process.stdout.write("\r\x1b[K");
  }
}
