const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');

// Helper to copy a directory if it exists
async function copyDirIfExists(src, dest) {
  if (await fs.pathExists(src)) {
    await fs.copy(src, dest);
  }
}

async function main() {
  // Parse command line arguments for target IDEs, source and output directories
  const args = process.argv.slice(2);
  let sourceDir = path.resolve(process.cwd(), 'examples', 'skills-main', 'skills');
  let outputDir = path.resolve(process.cwd(), 'dist');
  const targetIdes = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--src' && i + 1 < args.length) {
      sourceDir = path.resolve(args[++i]);
    } else if (args[i] === '--out' && i + 1 < args.length) {
      outputDir = path.resolve(args[++i]);
    } else {
      targetIdes.push(args[i].toLowerCase());
    }
  }

  if (targetIdes.length === 0) {
    targetIdes.push('all');
  }
  
  if (!(await fs.pathExists(sourceDir))) {
    console.error(`Source directory not found: ${sourceDir}`);
    return;
  }

  // Ensure output directory exists
  await fs.ensureDir(outputDir);
  
  // Read all skills in the source directory
  const skills = await fs.readdir(sourceDir);

  for (const skillName of skills) {
    const skillPath = path.join(sourceDir, skillName);
    const stat = await fs.stat(skillPath);
    if (!stat.isDirectory()) continue;

    const skillMdPath = path.join(skillPath, 'SKILL.md');
    if (!(await fs.pathExists(skillMdPath))) {
      console.warn(`SKILL.md not found in ${skillPath}, skipping.`);
      continue;
    }

    console.log(`Processing skill: ${skillName}...`);

    // Parse the Claude SKILL.md
    const fileContent = await fs.readFile(skillMdPath, 'utf8');
    const parsed = matter(fileContent);
    const { name = skillName, description = '', ...otherMeta } = parsed.data;
    const body = parsed.content;

    const referencesPath = path.join(skillPath, 'references');
    const hasReferences = await fs.pathExists(referencesPath);

    // ==========================================
    // 1. Trae IDE Output
    // ==========================================
    if (targetIdes.includes('all') || targetIdes.includes('trae')) {
      const traeDir = path.join(outputDir, '.trae', 'skills', name);
      await fs.ensureDir(traeDir);
      
      const traeContent = matter.stringify(body, { name, description });
      await fs.writeFile(path.join(traeDir, 'SKILL.md'), traeContent);
      
      await copyDirIfExists(referencesPath, path.join(traeDir, 'references'));
      await copyDirIfExists(path.join(skillPath, 'scripts'), path.join(traeDir, 'scripts'));
      
      console.log(`  ✓ Generated Trae format`);
    }

    // ==========================================
    // 2. Cursor Output (.mdc format)
    // ==========================================
    if (targetIdes.includes('all') || targetIdes.includes('cursor')) {
      const cursorRulesDir = path.join(outputDir, '.cursor', 'rules');
      await fs.ensureDir(cursorRulesDir);
      
      let cursorBody = body;
      if (hasReferences) {
        cursorBody = `*Note: This skill has supplementary reference files in \`.cursor/rules/${name}-references/\`. Please read them when necessary.*\n\n` + cursorBody;
        await copyDirIfExists(referencesPath, path.join(cursorRulesDir, `${name}-references`));
        await copyDirIfExists(path.join(skillPath, 'scripts'), path.join(cursorRulesDir, `${name}-scripts`));
      }

      const cursorContent = matter.stringify(cursorBody, {
        description: description.replace(/\n/g, ' ').trim() || `Skill for ${name}`,
        globs: "*",
        alwaysApply: false
      });
      await fs.writeFile(path.join(cursorRulesDir, `${name}.mdc`), cursorContent);
      
      console.log(`  ✓ Generated Cursor format`);
    }

    // ==========================================
    // 3. Codebuddy Output
    // ==========================================
    if (targetIdes.includes('all') || targetIdes.includes('codebuddy')) {
      const codebuddyDir = path.join(outputDir, '.codebuddy', 'skills');
      await fs.ensureDir(codebuddyDir);
      
      let cbBody = `# Skill: ${name}\n\n**Description:** ${description}\n\n${body}`;
      if (hasReferences) {
        cbBody = `*References for this skill are located in \`.codebuddy/skills/${name}-references/\`.*\n\n` + cbBody;
        await copyDirIfExists(referencesPath, path.join(codebuddyDir, `${name}-references`));
      }
      await fs.writeFile(path.join(codebuddyDir, `${name}.md`), cbBody);

      console.log(`  ✓ Generated Codebuddy format`);
    }

    // ==========================================
    // 4. Qoder Output
    // ==========================================
    if (targetIdes.includes('all') || targetIdes.includes('qoder')) {
      const qoderDir = path.join(outputDir, '.qoder', 'rules');
      await fs.ensureDir(qoderDir);
      
      let qoderBody = `# Rule: ${name}\n\n**Description:** ${description}\n\n${body}`;
      if (hasReferences) {
        qoderBody = `*References for this rule are located in \`.qoder/rules/${name}-references/\`.*\n\n` + qoderBody;
        await copyDirIfExists(referencesPath, path.join(qoderDir, `${name}-references`));
      }
      await fs.writeFile(path.join(qoderDir, `${name}.md`), qoderBody);

      console.log(`  ✓ Generated Qoder format`);
    }

    // ==========================================
    // 5. Codex Output
    // ==========================================
    if (targetIdes.includes('all') || targetIdes.includes('codex')) {
      const codexDir = path.join(outputDir, '.codex', 'prompts');
      await fs.ensureDir(codexDir);
      
      let codexBody = `# Codex Prompt: ${name}\n\n**Intent:** ${description}\n\n${body}`;
      if (hasReferences) {
        codexBody = `*Additional context available in \`.codex/prompts/${name}-context/\`*\n\n` + codexBody;
        await copyDirIfExists(referencesPath, path.join(codexDir, `${name}-context`));
      }
      await fs.writeFile(path.join(codexDir, `${name}.prompt.md`), codexBody);

      console.log(`  ✓ Generated Codex format`);
    }

    // ==========================================
    // 6. Antigravity Output
    // ==========================================
    if (targetIdes.includes('all') || targetIdes.includes('antigravity')) {
      const antigravityDir = path.join(outputDir, '.antigravity', 'skills', name);
      await fs.ensureDir(antigravityDir);
      
      await fs.writeFile(path.join(antigravityDir, 'instructions.md'), body);
      
      const agManifest = {
        id: name,
        description: description.replace(/\n/g, ' ').trim(),
        entrypoint: "instructions.md",
        hasReferences: hasReferences,
        metadata: otherMeta
      };
      await fs.writeFile(path.join(antigravityDir, 'manifest.json'), JSON.stringify(agManifest, null, 2));

      if (hasReferences) {
        await copyDirIfExists(referencesPath, path.join(antigravityDir, 'docs'));
      }

      console.log(`  ✓ Generated Antigravity format`);
    }
  }

  console.log('\n✅ Conversion completed successfully! Check the "dist" folder.');
}

main().catch(err => {
  console.error('Error during conversion:', err);
});
