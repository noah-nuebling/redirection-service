# redirection-service

Redirect urls and stuff

We created this because in GitHub Markdown, I couldn't make links clickable that had macOS-System-Settings-URLs such as `x-apple.systempreferences:com.apple.LoginItems-Settings.extension`.

This simple redirection service should serve as a workaround.

## Post actions

At the time of writing, after redirecting, the redirection service will try to navigate back in the window/tab history, or, if there is no history, it will try to close the redirection window. Closing doesn't work in all circumstances due to browser security stuff.

## Usage examples

- To open Login Items Settings:
  - https://noah-nuebling.github.io/redirection-service/?target=macos-settings-loginitems&message=

## Query Params

**target**

Possible values:

- `macos-settings-loginitems` redirects to the macOS login items settings
- `mmf2-latest` redirects to the GitHub release of the latest version of MMF 2. This is useful because this is the latest free version of MMF. (NOTE: Update this when you release new version of MMF 2!)

**message**
- What text to display in the window while redirecting. Can be URL encoded with %20 and stuff or left blank.
