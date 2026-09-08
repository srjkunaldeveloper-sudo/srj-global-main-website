const fs = require('fs');
const path = require('path');
const axios = require('axios');

const destDir = path.join(__dirname, 'src', 'assets', 'services');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const imagesToDownload = [
  { name: 'website-designing.jpg', url: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=600&q=80' },
  { name: 'custom-software.jpg', url: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=600&q=80' },
  { name: 'web-dev.jpg', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80' },
  { name: 'backend-dev.jpg', url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80' },
  { name: 'fullstack-dev.jpg', url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80' },
  { name: 'ecommerce-dev.jpg', url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80' },
  { name: 'android-dev.jpg', url: 'https://images.unsplash.com/photo-1607252631359-3c873b645ab8?auto=format&fit=crop&w=600&q=80' },
  { name: 'ios-dev.jpg', url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80' },
  { name: 'cross-platform.jpg', url: 'https://images.unsplash.com/photo-1610986603166-f7842862c172?auto=format&fit=crop&w=600&q=80' },
  { name: 'mobile-dev.jpg', url: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=600&q=80' },
  { name: 'mobile-uiux.jpg', url: 'https://images.unsplash.com/photo-1618761767732-835639b18d24?auto=format&fit=crop&w=600&q=80' },
  { name: 'uiux-designing.jpg', url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=600&q=80' },
  { name: 'product-design.jpg', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80' },
  { name: 'website-design.jpg', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80' },
  { name: 'user-research.jpg', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80' },
  { name: 'design-systems.jpg', url: 'https://images.unsplash.com/photo-1581291518655-9523c932dedf?auto=format&fit=crop&w=600&q=80' },
  { name: 'prototyping.jpg', url: 'https://images.unsplash.com/photo-1553876005-4308d78a0ab6?auto=format&fit=crop&w=600&q=80' },
  { name: 'ai-automation.jpg', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80' },
  { name: 'ai-dev.jpg', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80' },
  { name: 'machine-learning.jpg', url: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=600&q=80' },
  { name: 'ai-chatbots.jpg', url: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=600&q=80' },
  { name: 'computer-vision.jpg', url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80' },
  { name: 'nlp.jpg', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80' },
  { name: 'cloud-computing.jpg', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80' },
  { name: 'cloud-migration.jpg', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80' },
  { name: 'aws-solutions.jpg', url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=600&q=80' },
  { name: 'azure-solutions.jpg', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80' },
  { name: 'gcp-solutions.jpg', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80' },
  { name: 'devops.jpg', url: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80' },
  { name: 'data-analytics.jpg', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
  { name: 'business-intelligence.jpg', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' },
  { name: 'data-engineering.jpg', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80' },
  { name: 'data-visualization.jpg', url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80' },
  { name: 'database-dev.jpg', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80' },
  { name: 'data-science.jpg', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80' },
  { name: 'cyber-security.jpg', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80' },
  { name: 'security-audits.jpg', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80' },
  { name: 'pentesting.jpg', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80' },
  { name: 'app-security.jpg', url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80' },
  { name: 'cloud-security.jpg', url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&q=80' },
  { name: 'vulnerability-assessment.jpg', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80' },
  { name: 'mvp-planning.jpg', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80' },
  { name: 'product-roadmap.jpg', url: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=600&q=80' },
  { name: 'gtm-strategy.jpg', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' },
  { name: 'market-research.jpg', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80' },
  { name: 'funding-pitch.jpg', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80' },
  { name: 'startup-scaling.jpg', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80' }
];

async function downloadImage(url, filename) {
  const filePath = path.join(destDir, filename);
  const writer = fs.createWriteStream(filePath);

  console.log(`Downloading ${filename}...`);
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Successfully downloaded ${filename}`);
        resolve();
      });
      writer.on('error', (err) => {
        console.error(`Error downloading ${filename}:`, err);
        reject(err);
      });
    });
  } catch (err) {
    console.error(`Failed to request ${url}:`, err.message);
  }
}

async function run() {
  for (const img of imagesToDownload) {
    await downloadImage(img.url, img.name);
  }
  console.log('All images downloaded successfully.');
}

run();
