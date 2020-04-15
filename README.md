# Custom GuardRails Engine Seed

This is a skeleton repository to speed up creation of custom engines.

## Directory Structure

The key directories and files are:

```bash
├── test-src/           # place vulnerable code here
├── tools/
|   ├── build.sh        # builds the latest docker image
|   └── run.sh          # runs the latest docker image
├── Dockerfile          # installs and executes the custom engine logic
├── guardrails.json     # GuardRails manifest file
├── mappings.json       # GuardRails mappings file
├── README.md           # basic documentation and output reference
```

## How to use it

- Use this repo as a template: https://github.com/guardrailsio/custom-engine-seed/generate

## Custom Engine Requirements

The custom engines have certain requirements to be able to run on our platform.

### The GuardRails Manifest File

The GuardRails manifest file has the following format:

```json
{
  "name": "custom-engine-name",
  "version": "1.0.0",
  "private": true,
  "allowFor": {
    "providers": {
      "github": ["orgname-A", "orgname-B"],
      "gitlab": ["orgname-A", "orgname-B"]
    }
  },
  "runForLanguages": ["general", "java"],
  "timeoutInSeconds": 600
}
```

The `name` will be the name of the new engine.
The `private` flag determine whether the engine is accessible by other users or just by the creator.
Currently, only `"private": true` is valid.
The `allowFor` object defines which organizations/groups are allowed to run the engine.
The `runForLanguages` array defines which languages the engine can run against.
Note: `general` would run this engine for every scan against every repository.
The `timeoutInSeconds` defines a specific timeout for a scan of the engine. By default this value is 600 (10 minutes), and can be increased to a maximum of 1800 (30 minutes).

### The Guardrails Mapping File

The GuardRails mapping file has the following format:

```json
{
  "customEngineRuleID1": {
    "grID": "GR000X",
    "enabled": true
  },
  "customEngineRuleID2": {
    "grID": "GR000Y",
    "enabled": false
  }
}
```

The `customEngineRuleID1` must uniquely identify a ruleID of the custom engine.
To give an example, let's say you have improved upon the `gosec` tool and have some new rules that haven't been open-sourced.
You would have to map all [existing rules of `gosec`](https://github.com/securego/gosec#available-rules) from `G101` until `G505`.
If you have created a custom rule `G606`, then the mapping file must contain that as well.

For each ruleID of the custom engine, it has to define whether it is `enabled` or not.
If it is not `enabled`, it is not going to be considered a `vulnerability` by GuardRails, rather a `finding` of a tool that is considered irrelevant. This makes it possible to customize the reporting of tools based on risk appetite, internal company requirements and ensure that the noise of tools is kept to a minimum.

Finally, every ruleId of the custom engine has to be mapped to our internal GuardRails vulnerability ID.
This is important to allow us to group different vulnerabilities across engines and run de-duplication of findings, amongst other useful things.

The latest mapping table can be found below:

| GR ID  | GuardRails Category Title              |
| ------ | -------------------------------------- |
| GR0001 | Insecure Use of SQL Queries            |
| GR0002 | Insecure Use of Dangerous Function     |
| GR0003 | Insecure Use of Regular Expressions    |
| GR0004 | Hard-Coded Secrets                     |
| GR0005 | Insecure Authentication                |
| GR0006 | Insecure Access Control                |
| GR0007 | Insecure Configuration                 |
| GR0008 | Insecure File Management               |
| GR0009 | Insecure Use of Crypto                 |
| GR0010 | Insecure Use of Language/Framework API |
| GR0011 | Insecure Processing of Data            |
| GR0012 | Insecure Network Communication         |
| GR0013 | Using Vulnerable Libraries             |

### The Custom Engine Logic

The main purpose of the custom engine is to run against repositories with the supported language for the security check.
Regardless of what the custom engine logic does, it has to ensure that a [certain output](#the-guardrails-output-format) is generated.

An example engine is provided at this [link](todo-link-to-the-new-custom-engine).

### The GuardRails Output Format

The following code snipped contains an example of the GuardRails output format and has clarifying comments for each line.

```json
{
    "engine": {
        "name": "custom-engine-name", // should be the same as the name in the GR manifest file
        "version": "1.0.0" // should be the same as the version in the GR manifest file
    },
    "language": "general", // language that this engine runs against
    "status": "success", // status of the engine scan
    "executionTime": 17413,  // execution time
    "findings": 1, // amount of issues that were identified  // Todo: this is currently called issues
    "process": { // if you are orchestrating another tool, then:
        "name": "engine-general-ossindex", // add the name of that tool here
        "version": "1.0.0"  //  show the version number of that tool here
    },
    "output": [ // Todo: should we change this to `result`?
        {
            "type": "sast", //  possible types are (sast|sca|secret|cloud)
            "ruleId": "OSSINDEX001", // the unique ruleID of the custom engine, that can cause multiple findings
            "location": {
                "path": "benchmark/pom.xml", // relative path to the file that caused that finding
                "positions": {
                    "begin": {
                        "line": 594 // line within the file that caused that finding
                    }
                }
            },
            "metadata": { // this block is mostly unstructured data that will be stored with the finding
                "lineContent": "self.try(params[:graph])", // the only required data in the metadata object
                "description": "User controlled method execution", // optional: add a description
                "severity": "High", // optional: add a severity
                "language": "javascript", // optional: especially for general language engines, you can override
                // the language of a given issue, to point to the right documentation link.
                "falsePositive": false // optional: when you add findings to the output, you can add some checks
                // to determine whether this is likely a false positive or not. E.g. the file path is in a test folder
                // or the lineContent contains a test string, etc. The findings with a false positive flag set to true
                // will still be stored in our database, but not considered a vulnerability. Unless the flag is changed
                // for a given finding in the dashboard.
            }
        }
    ]
};
```

### The Test Source

The test source is required to allow the engines to be fully self contained and testable.
That means add a sample repository, or just relevant files that contain the code which would produce at least one output for your custom engine.

### Test Steps

- Ensure that the schema validator returns no errors
  - example command and output
- Build an Image with `tools/build`
- Run it with `tools/run` for the test command that parses the output
