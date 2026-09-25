import fs from 'fs';
import path from 'path';
import https from 'https';

const imagePaths = [
  'assets/icons/team_member.png',
  'assets/icons/logo.png',
  'assets/icons/logo_512.png',
  'assets/icons/Icon-192.png',
  'assets/icons/Loaction Icon.png',
  'assets/icons/trophy.png',
  'assets/icons/linkdein_icon.png',
  'assets/icons/instagram.png',
  'assets/icons/Github.png',
  'assets/icons/Email_Icon.png',
  'assets/icons/whatsapp.png',
  'assets/icons/twitter.png',
  'assets/icons/youtube.png',
  'assets/images/team.png',
  'assets/images/Ecell.png',
  'assets/images/innovate.png',
  'assets/images/create.png',
  'assets/images/lead.png',
  'assets/images/anouncment.png',
  'assets/images/prizepool.png',
  'assets/images/ticket.png',
  'assets/images/ticket-2.png',
  'assets/images/network.png',
  'assets/images/location.png',
  'assets/images/partner/collaborate.png',
  'assets/images/partner/create.png',
  'assets/images/partner/growth.png',
  'assets/images/partner/innovate.png',
  'assets/images/partner/network.png',
];

const baseUrl = 'https://ecellvitb.in/assets/';
const outputDir = path.resolve('public/ecell-assets');

async function downloadAsset(relPath) {
  // In Flutter web, 'assets/icons/logo.png' is hosted at https://ecellvitb.in/assets/assets/icons/logo.png
  const url = `${baseUrl}${relPath}`;
  const localRelative = relPath.replace(/^assets\//, '');
  const dest = path.join(outputDir, localRelative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`[Skip] ${relPath} returned HTTP ${res.statusCode}`);
        return resolve(false);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`[Downloaded] ${localRelative} (${fs.statSync(dest).size} bytes)`);
        resolve(true);
      });
    }).on('error', (err) => {
      console.error(`[Error] ${relPath}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  console.log(`Downloading ${imagePaths.length} official images from ${baseUrl}...`);
  for (const asset of imagePaths) {
    await downloadAsset(asset);
  }
  console.log('All official ecellvitb.in assets downloaded successfully.');
}

run();
