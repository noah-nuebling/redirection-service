# redirection-service

Redirect urls and stuff

We created this because in GitHub Markdown, I couldn't make links clickable that had macOS-System-Settings-URLs such as `x-apple.systempreferences:com.apple.LoginItems-Settings.extension`.

This simple redirection service should serve as a workaround.

## Post actions

At the time of writing, after redirecting, the redirection service will try to navigate back in the window/tab history, or, if there is no history, it will try to close the redirection window. Closing doesn't work in all circumstances due to browser security stuff.

## Usage examples

- To go to latest MMF 2 GitHub Release :
  - https://noah-nuebling.github.io/redirection-service?message=&target=mmf2-latest

## Query Params

**target**

Possible values:

- `macos-settings-loginitems` redirects to the macOS login items settings
- `mmf2-latest` redirects to the GitHub release of the latest version of MMF 2. This is useful because this is the latest free version of MMF. (NOTE: Update this when you release new version of MMF 2!)
- `mmf-questions` redirects to where common questions that users might have are answered. We might want to move this from the GitHub Readme to the MMF website at some point, that's why were creating a redirection-service entry for it.
- `mmf-compatibility-guide` We might want to move this from the GitHub Readme to the MMF website at some point, that's why were creating a redirection-service entry for it.
  
**message**
- What text to display in the window while redirecting. Can be URL encoded with %20 and stuff or left blank.
