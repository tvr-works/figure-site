import { Generator, getConfig } from '@tanstack/router-generator';

// Use the public ESM generator shared by Start, avoiding the CLI's CJS entry.
await new Generator({ config: getConfig(), root: process.cwd() }).run();
