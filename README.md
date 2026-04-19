# SkillTrans 🚀

[English](#english) | [中文](#中文)

<a id="english"></a>

A command-line tool that automatically converts Claude Code Skills into native configurations for various AI IDEs. 

It breaks down the walls between different AI assistants, allowing you to "Write Once, Run Anywhere" across Trae, Cursor, Codebuddy, Qoder, Codex, and Antigravity.

## ✨ Supported Platforms

- ✅ **Trae** (`.trae/skills/`)
- ✅ **Cursor** (`.cursor/rules/`)
- ✅ **Codebuddy** (`.codebuddy/skills/`)
- ✅ **Qoder** (`.qoder/rules/`)
- ✅ **Codex** (`.codex/prompts/`)
- ✅ **Antigravity** (`.antigravity/skills/`)

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/wuweiwei18/SkillTrans.git
cd SkillTrans
npm install
```

## 🚀 Usage

Place your Claude Code format skill folders (containing `SKILL.md` and optional `references/` or `scripts/`) into the `examples/skills-main/skills/` directory.

Then, run the converter:

```bash
# Convert to ALL supported IDE formats
node converter.js

# Convert to specific IDE formats only
node converter.js trae cursor
node converter.js antigravity
```

The generated configuration files will be output to the `dist/` directory. You can directly copy the `.trae` or `.cursor` folders to your project's root directory to apply the skills immediately.

## 🛠️ How it works

The tool parses the `SKILL.md` file using `gray-matter`, extracting the YAML Frontmatter (like `name` and `description`) and the Markdown body. It then restructures and formats this data into the specific schema required by each target IDE:

- **Trae**: Keeps the YAML Frontmatter structure, cleaning up unnecessary metadata.
- **Cursor**: Converts to `.mdc` format, merging descriptions into globals.
- **Antigravity**: Splits metadata into `manifest.json` and body into `instructions.md`.

## 📞 Contact

If you have any questions or suggestions, feel free to contact me:
- **WeChat**: `FLyuMwVM`

---

<a id="中文"></a>

# SkillTrans 🚀

一个命令行工具，用于将专门为 Claude Code 打造的 Skill（技能/规则）自动转化为各大主流 AI IDE 的原生配置。

打破不同 AI 编程助手之间的生态壁垒，实现“一次编写，到处运行”。完美适配 Trae, Cursor, Codebuddy, Qoder, Codex, 和 Antigravity。

## ✨ 支持的平台

- ✅ **Trae** (`.trae/skills/`)
- ✅ **Cursor** (`.cursor/rules/`)
- ✅ **Codebuddy** (`.codebuddy/skills/`)
- ✅ **Qoder** (`.qoder/rules/`)
- ✅ **Codex** (`.codex/prompts/`)
- ✅ **Antigravity** (`.antigravity/skills/`)

## 📦 安装

克隆仓库并安装依赖：

```bash
git clone https://github.com/wuweiwei18/SkillTrans.git
cd SkillTrans
npm install
```

## 🚀 使用方法

将你手头的 Claude Code 格式的技能文件夹（包含 `SKILL.md` 以及可选的 `references/` 或 `scripts/`）放入 `examples/skills-main/skills/` 目录下。

然后运行转换命令：

```bash
# 转换适配所有支持的 IDE
node converter.js

# 仅转换指定的 IDE 格式
node converter.js trae cursor
node converter.js antigravity
```

生成的配置文件将输出到 `dist/` 目录中。你可以直接将 `dist/.trae` 或 `dist/.cursor` 文件夹拷贝到你对应项目的根目录，即可立即生效！

## 🛠️ 工作原理

工具通过 `gray-matter` 解析 `SKILL.md`，提取出 YAML Frontmatter（如 `name` 和 `description` 触发条件）以及核心的 Markdown 指令正文。随后，它会根据各个目标 IDE 的架构规范进行重组：

- **Trae**: 保留 YAML Frontmatter 结构，清洗多余的元数据，实现原生兼容。
- **Cursor**: 转化为 `.mdc` 规则格式，处理全局 Description 和相对路径索引。
- **Antigravity**: 实施现代工程化拆分，生成 `manifest.json` 配置清单与 `instructions.md` 指令文件。

## 📞 联系方式

如果你有任何问题或建议，欢迎联系我：
- **微信**: `FLyuMwVM`
