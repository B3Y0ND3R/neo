const fs = require('fs');
const path = require('path');

// Function to update ngrok URL in all files
function updateNgrokUrl(newUrl) {
  const files = [
    'test-simple.js',
    'generate-vectors-simple.js',
    'test-visual-search-complete.js',
    'controllers/admin/products-controller.js',
    '../client/src/pages/shopping-view/visual-search.jsx'
  ];

  console.log(`🔄 Updating ngrok URL to: ${newUrl}\n`);

  files.forEach(file => {
    try {
      const filePath = path.join(__dirname, file);
      
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update the URL in the file
        const oldUrlPattern = /https:\/\/[a-f0-9]+\.ngrok-free\.app/g;
        const newContent = content.replace(oldUrlPattern, newUrl);
        
        if (content !== newContent) {
          fs.writeFileSync(filePath, newContent);
          console.log(`✅ Updated: ${file}`);
        } else {
          console.log(`⏭️ No changes needed: ${file}`);
        }
      } else {
        console.log(`❌ File not found: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${file}:`, error.message);
    }
  });

  console.log('\n🎉 URL update completed!');
  console.log('\nNext steps:');
  console.log('1. Test the service: node test-simple.js');
  console.log('2. Generate vectors: node generate-vectors-simple.js');
}

// Get new URL from command line argument
const newUrl = process.argv[2];

if (!newUrl) {
  console.log('❌ Please provide the new ngrok URL');
  console.log('Usage: node update-ngrok-url.js "https://your-new-url.ngrok-free.app"');
  process.exit(1);
}

if (!newUrl.includes('ngrok-free.app')) {
  console.log('❌ Please provide a valid ngrok URL');
  process.exit(1);
}

updateNgrokUrl(newUrl); 