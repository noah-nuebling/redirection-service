# redirection-service

Redirect urls and stuff

We created this because in GitHub Markdown, I couldn't make links clickable that had macOS-System-Settings-URLs such as `x-apple.systempreferences:com.apple.LoginItems-Settings.extension`.

This simple redirection service should serve as a workaround.

## Post actions

At the time of writing, after redirecting, the redirection service will try to navigate back in the window/tab history, or, if there is no history, it will try to close the redirection window. Closing doesn't work in all circumstances due to browser security stuff.

## Usage examples

- To go to latest MMF 2 GitHub Release :
  - https://noah-nuebling.github.io/redirection-service?message=&target=mmf2-latest
- To compose an email to me:
  - https://noah-nuebling.github.io/redirection-service?message=&target=mailto-noah&body=&subject=Cool%20Beans

## Query Params

**target**

Possible values:

- `macos-settings-loginitems` redirects to the macOS login items settings
- `mmf2-latest` redirects to the GitHub release of the latest version of MMF 2. This is useful because this is the latest free version of MMF. (NOTE: **Update this** when you release new version of MMF 2!)
- `mmf-questions` redirects to where common questions that users might have are answered. We might want to move this from the GitHub Readme to the MMF website at some point, that's why were creating a redirection-service entry for it.
- `mailto-noah` Compose an email to my public email account. I try not to include the email on the web to avoid spam. But I hope this indirect way to linking to my email through the redirection service will prevent spam.
  - You can also prefill the subject by adding a `&subject` query param.
  - You can prefill the body by adding a `&body` query param
- `mmf-about` Links to the about document for Mac Mouse Fix. At the time of writing this is the GitHub readme. Later we might want to move this to the MMF website.
- Guides:
  - `localization-guide`: Link to instructions for helping to translate Mac Mouse Fix.
  - `mmf-compatibility-guide` We might want to move this from the GitHub Readme to the MMF website at some point, that's why were creating a redirection-service entry for it. Takes `&locale=` param
  - `captured-buttons-guide`: Link to instructions explaining the concept of 'captured' buttons in Mac Mouse Fix. Takes `&locale=` param.
  
**message**
- The `&message=` param determines what text to display in the window while redirecting. Can be URL encoded with %20 and stuff or left blank.

**page-title**
- The `&page-title=` param determines what text to display inside the tab button while redirecting. It defaults to `...` (Last updated: 30.08.2024)

**locale**
- Some targets take an additional `&locale=` param, which opens the target in a specific language. Valid values are Xcode language IDs for languages our project supports, such as 'pt-BR' for Brazilian Portugese or 'de' for German.
  - Discussion: (Last updated: 30.08.2024) These locale specifiers are used consistently between the MMF Website, MMF App and MMF Markdown documents and they are defined inside Xcode project settings inside the mac-mouse-fix and mac-mouse-fix-website repos. We really only need this `&locale=` param for linking to markdown documents, since the website and app have their own logic for deciding which language to display themselves in.
