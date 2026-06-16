import { spawnSync } from 'child_process';

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = 'file:./test.db';
  console.log('DATABASE_URL not set — using sqlite test.db');
} else {
  console.log('Using DATABASE_URL from environment');
}

const res = spawnSync('npx', ['prisma', 'migrate', 'deploy'], { stdio: 'inherit', env });
if (res.status !== 0) {
  process.exit(res.status);
}
