const fs = require('fs');
const path = require('path');

const appDir = path.resolve(__dirname, '../src/pages/app');
const files = fs.readdirSync(appDir).filter(f => f.endsWith('.jsx'));

const linkMap = [
  ['href="index.html"', 'href="/app"'],
  ['href="explore.html"', 'href="/app/explore"'],
  ['href="opportunity.html"', 'href="/app/opportunity"'],
  ['href="participation-type.html"', 'href="/app/participation-type"'],
  ['href="create-team.html"', 'href="/app/create-team"'],
  ['href="teams.html"', 'href="/app/teams"'],
  ['href="team-dashboard.html"', 'href="/app/team-dashboard"'],
  ['href="registration-success.html"', 'href="/app/registration-success"'],
  ['href="my-applications.html"', 'href="/app/my-applications"'],
  ['href="saved.html"', 'href="/app/saved"'],
  ['href="posts.html"', 'href="/app/posts"'],
  ['href="notifications.html"', 'href="/app/notifications"'],
  ['href="profile.html"', 'href="/app/profile"'],
  ['href="rafeeq.html"', 'href="/app/rafeeq"'],
  ['href="../The%20Visitor/about.html"', 'href="/about"'],
  ['href="../The%20Visitor/landing.html#faq"', 'href="/#faq"'],
  ['href="../The%20Visitor/landing.html"', 'href="/"'],
  ['href="../The%20Visitor/contact.html"', 'href="/contact"'],
  ['href="../auth/privacy.html"', 'href="/auth/privacy"'],
  ['href="../auth/terms.html"', 'href="/auth/terms"'],
  ['href="../auth/login.html"', 'href="/auth/login"'],
  ['href="../auth/signup.html"', 'href="/auth/signup"'],
];

let totalChanges = 0;

for (const f of files) {
  const filePath = path.join(appDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [from, to] of linkMap) {
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
      changed = true;
      totalChanges++;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated links in ${f}`);
  }
}

console.log(`Total link replacements in pages/app: ${totalChanges}`);
