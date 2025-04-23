const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");

const srcDir = path.join(__dirname, "dist/public/images");
const destDir = path.join(process.cwd(), "public/images");

async function copyAssets() {
  if (!fs.existsSync(srcDir)) {
    console.error("❌ Source assets not found:", srcDir);
    process.exit(1);
  }

  try {
    await fse.ensureDir(destDir);
    await fse.copy(srcDir, destDir);
    console.log(`✅ Copied SVG assets to ${destDir}`);
  } catch (err) {
    console.error("❌ Failed to copy assets:", err);
    process.exit(1);
  }
}

copyAssets();
