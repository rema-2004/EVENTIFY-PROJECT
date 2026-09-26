const fs = require('fs');
const path = require('path');

const routesMap = {
  'admin/admin-audit-log.html': 'admin/admin-audit-log.jsx',
  'admin/admin-categories.html': 'admin/admin-categories.jsx',
  'admin/admin-dashboard.html': 'admin/admin-dashboard.jsx',
  'admin/admin-event-review-details.html': 'admin/admin-event-review-details.jsx',
  'admin/admin-events.html': 'admin/admin-events.jsx',
  'admin/admin-reports.html': 'admin/admin-reports.jsx',
  'admin/admin-users.html': 'admin/admin-users.jsx',
  'admin/admin-verify-organizations.html': 'admin/admin-verify-organizations.jsx',
  'app/create-team.html': 'app/create-team.jsx',
  'app/explore.html': 'app/explore.jsx',
  'app/index.html': 'app/index.jsx',
  'app/my-applications.html': 'app/my-applications.jsx',
  'app/notifications.html': 'app/notifications.jsx',
  'app/opportunity.html': 'app/opportunity.jsx',
  'app/participation-type.html': 'app/participation-type.jsx',
  'app/posts.html': 'app/posts.jsx',
  'app/profile.html': 'app/profile.jsx',
  'app/rafeeq.html': 'app/rafeeq.jsx',
  'app/registration-success.html': 'app/registration-success.jsx',
  'app/saved.html': 'app/saved.jsx',
  'app/team-dashboard.html': 'app/team-dashboard.jsx',
  'app/teams.html': 'app/teams.jsx',
  'auth/forgot-password.html': 'auth/ForgotPassword.jsx',
  'auth/login.html': 'auth/Login.jsx',
  'auth/organization-pending.html': 'auth/OrganizationPending.jsx',
  'auth/organization-verification.html': 'auth/OrganizationVerification.jsx',
  'auth/privacy.html': 'auth/Privacy.jsx',
  'auth/signup.html': 'auth/Signup.jsx',
  'auth/terms.html': 'auth/Terms.jsx',
  'org/org-applicants.html': 'org/org-applicants.jsx',
  'org/org-create-event.html': 'org/org-create-event.jsx',
  'org/org-dashboard.html': 'org/org-dashboard.jsx',
  'org/org-opportunities.html': 'org/org-opportunities.jsx',
  'org/org-posts.html': 'org/org-posts.jsx',
  'org/org-profile.html': 'org/org-profile.jsx',
  'org/org-report-center.html': 'org/org-report-center.jsx',
  'org/org-settings.html': 'org/org-settings.jsx',
  'The Visitor/404.html': 'visitor/NotFound.jsx',
  'The Visitor/about.html': 'visitor/About.jsx',
  'The Visitor/contact.html': 'visitor/Contact.jsx',
  'The Visitor/landing.html': 'visitor/Landing.jsx',
};

const uiDir = path.resolve(__dirname, '../../UI-UX');
const reactDir = path.resolve(__dirname, '../src/pages');

let missingFiles = [];
let htmlLinksInJsx = [];
let relativeAssetSrcs = [];
let results = [];

for (const [htmlRel, jsxRel] of Object.entries(routesMap)) {
  const htmlPath = path.join(uiDir, htmlRel);
  const jsxPath = path.join(reactDir, jsxRel);
  
  if (!fs.existsSync(htmlPath)) {
    missingFiles.push(`Missing HTML: ${htmlPath}`);
    continue;
  }
  if (!fs.existsSync(jsxPath)) {
    missingFiles.push(`Missing JSX: ${jsxPath}`);
    continue;
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const jsxContent = fs.readFileSync(jsxPath, 'utf8');

  // Check for lingering .html references
  const htmlMatches = jsxContent.match(/href=["'][^"']*\.html[^"']*["']/g) || [];
  if (htmlMatches.length > 0) {
    htmlLinksInJsx.push({ file: jsxRel, matches: htmlMatches });
  }

  // Check for relative asset paths that might break in SPA routing
  const imgMatches = jsxContent.match(/src=["'][^"']*["']/g) || [];
  const brokenImgs = imgMatches.filter(m => m.includes('../assets') || m.includes('./assets'));
  if (brokenImgs.length > 0) {
    relativeAssetSrcs.push({ file: jsxRel, matches: brokenImgs });
  }

  // Check script tags in HTML to see what JS logic was in HTML
  const inlineScripts = (htmlContent.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi) || []).length;
  const externalScripts = (htmlContent.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi) || []).map(s => {
    const match = s.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : s;
  });

  results.push({
    htmlRel,
    jsxRel,
    htmlLines: htmlContent.split('\n').length,
    jsxLines: jsxContent.split('\n').length,
    inlineScripts,
    externalScripts,
    hasHtmlLinks: htmlMatches.length,
    hasBrokenAssets: brokenImgs.length
  });
}

console.log('=== VERIFICATION SUMMARY ===');
console.log(`Total mapped pages: ${Object.keys(routesMap).length}`);
console.log(`Missing files: ${missingFiles.length}`);
if (missingFiles.length > 0) console.log(missingFiles);

console.log(`Pages with lingering .html links in JSX: ${htmlLinksInJsx.length}`);
if (htmlLinksInJsx.length > 0) console.log(JSON.stringify(htmlLinksInJsx, null, 2));

console.log(`Pages with relative asset paths in JSX: ${relativeAssetSrcs.length}`);
if (relativeAssetSrcs.length > 0) console.log(JSON.stringify(relativeAssetSrcs, null, 2));

console.log('\n=== PAGE DETAILS ===');
for (const r of results) {
  console.log(`${r.htmlRel.padEnd(40)} -> ${r.jsxRel.padEnd(35)} (HTML: ${r.htmlLines} lines | JSX: ${r.jsxLines} lines) Scripts: ext[${r.externalScripts.join(', ')}] in[${r.inlineScripts}]`);
}
