# nitro-release

With this package, Nitro can produce releases by using `gulp release` on the CLI.
You can influence the version bump by using the `--bump` option.

All possibilities in examples:

    $ gulp release --bump
    \> Version bumped from 0.0.0 -> 0.0.1

    $ gulp release --bump=minor
    \> Version bumped from 0.0.1 -> 0.1.0

    $ gulp release --bump=major
    \> Version bumped from 0.1.0 -> 1.0.0

    $ gulp release --bump=patch
    \> Version bumped from 1.0.0 -> 1.0.1

## Configuration options

### release.bumpFiles (Array)

A list of files, where a version bump should be processed.

- example: `["package.json"]`

### release.commit (Boolean)

Defines, if the `bumpFiles` should be committed. A commit will have the message `Release VERSION`.

- example: `false`

### release.commitMessage (String)

Defines the commit message. Use `%VERSION%` to replace with current (bumped) version.

- example: `"Release %VERSION%"`

### release.push (Boolean)

Defines, if a commit should be pushed automatically. Only pushes, if `commit` is set to `true`.

- example: `false`

### release.pushBranch (String)

Defines the branch, which should be pushed. This should be the name of the branch, where the release happens.

- example: `"master"`

### release.pushTo (String)

Defines the remote origin name.

- example: `"origin"`

### release.tag (Boolean)

Defines, if a release git tag should be created. The name is `vVERSION`, e.g. `v0.1.0`.

- example: `false`

### release.tagName (String)

Defines the tag name. Use `%VERSION%` to replace with current (bumped) version.

- example: `"v%VERSION%"`

## Example Release Config

```
"release": {
    "bumpFiles": ["package.json"],
    "commit": false,
    "push": false,
    "pushBranch": "master",
    "pushTo": "origin",
    "tag": false
}
```
