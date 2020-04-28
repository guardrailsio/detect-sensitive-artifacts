const startTime = new Date();
const glob = require("tiny-glob");
const DEBUG = false;

const pkg = require("./guardrails.json");
let engineInfo = {
  name: pkg.name,
  version: pkg.version,
};

const detectFiles = {
  groups: [
    {
      name: "IntelliJ",
      category: "sensitive",
      elements: [
        ".idea",
        // JIRA plugin
        "atlassian-ide-plugin.xml",
        // Crashlytics plugin (for Android Studio and IntelliJ)
        "com_crashlytics_export_strings.xml",
        "crashlytics.properties",
        "crashlytics-build.properties",
        "fabric.properties",
      ],
    },
    {
      name: "Git",
      category: "sensitive",
      elements: [".git"],
    },
    {
      name: "History files",
      category: "sensitive",
      elements: [
        // Shell History Files
        ".bash_history",
        ".zsh_history",
        ".zhistory",
        // SQL History Files
        ".mysql_history",
        ".psql_history",
      ],
    },
    {
      name: "Key files",
      category: "secrets",
      elements: [
        "otr.private_key",
        ".recon-ng/keys.db",
        ".dbeaver-data-sources.xml",
        ".s3cfg",
        "keystore",
        "keyring",
      ],
    },
  ],
};

function createLineItem(path, category, name) {
  let location = {
    path: path,
    positions: {
      begin: {
        line: 1,
      },
    },
  };

  let metadata = {
    description: name,
    lineContent: "[GR-Info] No line content provided by this engine.",
  };

  return {
    type: "secret",
    ruleId: category,
    location: location,
    metadata: metadata,
  };
}

(async function () {
  let files = await glob("**/*", { cwd: "/opt/mount/", dot: true });
  let lineItems = [];

  for (var a = 0, len = detectFiles.groups.length; a < len; a++) {
    var group = detectFiles.groups[a];

    for (var b = 0, lenB = group.elements.length; b < lenB; b++) {
      var element = group.elements[b];
      if (files.indexOf(element) > -1) {
        if (DEBUG) console.log("Add issue ", element, element.name);
        lineItems.push(createLineItem(element, group.category, group.name));
      } else {
        for (var c = 0, lenC = files.length; c < lenC; c++) {
          const pathElements = files[c].split("/");
          const pathLength = pathElements.length;
          const lastPathElement = pathElements[pathLength - 1];
          if (lastPathElement === element) {
            lineItems.push(
              createLineItem(files[c], group.category, group.name)
            );
          }
        }
      }
    }
  }

  const now = new Date();
  const executionTime = now - startTime;

  let output = {
    engine: engineInfo,
    process: engineInfo,
    language: "general",
    status: "success",
    executionTime: executionTime,
    issues: lineItems.length,
    output: lineItems,
  };

  console.log(JSON.stringify(output, null, 2));
})();
