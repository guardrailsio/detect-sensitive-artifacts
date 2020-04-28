# Detect Sensitive Artifacts

This custom engine detects sensitive artifacts such as key files, IDE folders, Git folders and history files.

## Example GuardRails Output

The following code snipped contains an example of a successful engine run

```json
{
{
  "engine": {
    "name": "detect-sensitive-artifacts",
    "version": "1.0.0"
  },
  "process": {
    "name": "detect-sensitive-artifacts",
    "version": "1.0.0"
  },
  "language": "general",
  "status": "success",
  "executionTime": 28,
  "issues": 6,
  "output": [
    {
      "type": "secret",
      "ruleId": "sensitive",
      "location": {
        "path": ".idea",
        "positions": {
          "begin": {
            "line": 1
          }
        }
      },
      "metadata": {
        "description": "IntelliJ",
        "lineContent": "[GR-Info] No line content provided by this engine."
      }
    },
    {
      "type": "secret",
      "ruleId": "sensitive",
      "location": {
        "path": ".git",
        "positions": {
          "begin": {
            "line": 1
          }
        }
      },
      "metadata": {
        "description": "Git",
        "lineContent": "[GR-Info] No line content provided by this engine."
      }
    },
    {
      "type": "secret",
      "ruleId": "sensitive",
      "location": {
        "path": ".zhistory",
        "positions": {
          "begin": {
            "line": 1
          }
        }
      },
      "metadata": {
        "description": "History files",
        "lineContent": "[GR-Info] No line content provided by this engine."
      }
    },
    {
      "type": "secret",
      "ruleId": "secrets",
      "location": {
        "path": "random/keystore",
        "positions": {
          "begin": {
            "line": 1
          }
        }
      },
      "metadata": {
        "description": "Key files",
        "lineContent": "[GR-Info] No line content provided by this engine."
      }
    }
  ]
}
```
