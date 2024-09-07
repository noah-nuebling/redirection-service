# redirection-service

Redirect urls and stuff

We created this because in GitHub Markdown, I couldn't make links clickable that had macOS-System-Settings-URLs such as `x-apple.systempreferences:com.apple.LoginItems-Settings.extension`.

This simple redirection service should serve as a workaround.

Later we started trying to use this for pretty much all our internal project links, so we can update links retroactively and easily link to a specific localization of a Document.

## Is this part of MMF?

This was initially intended as a general redirection service that is not specifically part of the mac-mouse-fix project.
That's also why all the `&target=`s that relate to mmf have `mmf` in their name.
However, I thought that giving the redirection service a nice favicon, and making it available under the familiar macmousefix.com domain makes it less confusing or sketchy-seeming to users.

For the forseeable future I'll probably only use this for MMF.
However, I think we should keep using the `mmf-` prefixes for the `&target=`s, to stay consistent and allow us to reuse this outside of MMF at some point.

The redirection-service is accessible through.
- https://noah-nuebling.github.io/redirection-service/
- https://redirect.macmousefix.com/ 

## Why not use mac-mouse-fix-website?

The main website is a big slow vue app, this is basically just a html.file which we can edit pretty easily directly in the browser.

## Post actions

At the time of writing, after opening an application (e.g. with a mailto: link), the redirection service will try to navigate back in the window/tab history, or, if there is no history, it will try to close the redirection window. 

It will try to do this as soon as possible after the application is opened, but often we have to fall back to closing the redirection window once the user clicks on it or after a timeout.

Closing doesn't work in all circumstances due to browser security stuff.

## Usage examples

- To go to latest MMF 2 GitHub Release :
  - https://noah-nuebling.github.io/redirection-service?message=&target=mmf2-latest
- To compose an email to me:
  - https://noah-nuebling.github.io/redirection-service?message=&target=mailto-noah&body=&subject=Cool%20Beans

## Query Params

**target**

Discussion:

Choose `target` names that are as specific to the use-case as possible. E.g. right now (05.09.2024) there are some places with a "Tip me on PayPal" link and some places with a "Buy me a Milkshake" link. These both currently link to the same place, but we still create 2 different `target`s so we can change them independently.

Possible values for the `&target=` param:

- **macmousefix: links**
  - `mmfl-activate` opens the activateLicense screen inside the MMF app.
    - We already have a redirect for the same thing at `http://noah-nuebling.github.io/mac-mouse-fix-website/activate`. We use that link on the Gumroad post-checkout page. Not sure if anywhere else. Using `mmfl-activate` is preferable going forward, so we have all the redirects in one place.
    - Note that `macmousefix:` links only work if MMF is installed, otherwise Safari will say the link is 'invalid'. Maybe mention that to users where this is used.
- **General**
  - `buy-me-a-milkshake` place where people can 'buy me a milkshake'. Takes `&locale=` param.
- **Non-browser:**
  - `macos-settings-loginitems` opens macOS login items settings
  - `mailto-noah` Composes an email to my public email account.
    - I try not to include the email on the web to avoid spam. But I hope this indirect way to linking to my email through the redirection service will prevent spam.
    - You can also prefill the subject by adding a `&subject` query param.
    - You can prefill the body by adding a `&body` query param
- **MMF:**
  - `mmf-github` redirects to the MMF GitHub Readme. Takes `&locale=` param.
    - We plan to use this for the 'Check it out on GitHub' link inside the MMF app. (Last updated: 01.09.2024)
  - `mmf-acknowledgements` redirects to MMF Acknowledgements page. Takes `&locale=` param.
  - `mmf-about` Links to the about document for Mac Mouse Fix. Takes `&locale=` param.
    - At the time of writing this is the GitHub readme. (Last updated: 02.09.2024) (Later we might want to move this to the MMF website.)
  - `mmf-questions` redirects to where common questions that users might have are answered. Takes `&locale=` param.
    - (We might want to move this from the GitHub Readme to the MMF website at some point, that's why were creating a redirection-service entry for it.)
  - `mmf2-latest` redirects to the GitHub release of the latest version of MMF 2. Takes `&locale=` param.
    - This is useful because this is the latest free version of MMF.
    - (Not sure if we can ever feasibly localize GitHub release notes. Maybe with AI or something. But it doesn't hurt to pass in a locale, in case we figure something out.)
    - (NOTE: **Update this** when you release new version of MMF 2!)
  - `mmf-localization-contribution` Place where people can help to translate Mac Mouse Fix. Does **not** take `&locale=` param.
    - This is the 'Localization Guide' at the time of writing (05.09.2024), but maybe later we'll link to Crowd In/Localazy or something.
    - Not localizing this since it is only directed towards people who speak English.
  - `mmf-help-and-feedback` Page for accessing help or, or giving Feedback. Takes `&locale=` param. 
    - Used in the GitHub Readme (as of 07.09.2024). Not sure it makes any sense to use redirection-service for this since we can easily just update the GH Readme, and it's unlikely we'll use this anywhere else.
  - `mmf-releases`: Overview of MMF releases. Takes `&locale=` param.
    - Used in the GitHub Readme (as of 07.09.2024). Not sure it makes sense to use redirection-service, since I feel it's unlikely we'll move this or make it localizable.
- **MMF Feedback:**
  - `mmf-feedback-bug-report` page for submitting bug reports. Takes `&locale=` param.
    - (Last updated 30.08.2024: Locale params aren't yet supported by the feedback assistant but we should already pass the locale in for once we add locale support.
  - `mmf-feedback-feature-request` page for submitting feature requests. Takes `&locale=` param.
  - `mmf-feedback-other` page for submitting other feedback. Takes `&locale=` param.
- **MMF Guides:**
  - `mmf-guides-and-community` Used for the "Help > View Guides or Ask the Community" menu item inside MMF. Redirects to GitHub Discussions as of 05.09.2024. Takes `&locale=` param.
    - Probably not feasible to localize this. Think we should not use this inside MMF.
  - `mmf-guides`: Overview of available guides for MMF. Takes `&locale=` param.
  - `mmf-compatibility-guide`: Explains which MMF versions are compatible with which macOS versions. Takes `&locale=` param.
    - (We might want to move this from the GitHub Readme to the MMF website at some point, that's why were creating a redirection-service entry for it.) 
  - `mmf-captured-buttons-guide`: Explanation of the concept of 'captured' buttons in Mac Mouse Fix. Takes `&locale=` param.
  - `mmf-ventura-enabling-guide`: Workaround for problems with enabling the app on macOS 13 Ventura and macOS 14 Sonoma. Takes `&locale` param
    - As of 05.09.2024, I don't plan on actually localizing this, since it's a lot of text and will soon be outdated since it only applies to macOS 13 Ventura and 14 Sonoma (problem was fixed in macOS 15 Sequoia)
  
**message**
- The `&message=` param determines what text to display in the window while redirecting. Can be URL encoded with %20 and stuff or left blank.

**page-title**
(Last updated: 04.09.2024)
- The `&page-title=` param determines what text to display inside the tab bar while redirecting. It defaults to `Mac Mouse Fix...` 
  - (previously just `...` when we wanted to keep the redirection-service independent from MMF.)
- When the page-title ends with `...`, the dots will appear one-by-one. Until, after the last dot appears, the page closes.

**locale**
- Some targets take an additional `&locale=` param, which opens the target in a specific language. Valid values are Xcode language IDs for languages our project supports, such as 'pt-BR' for Brazilian Portugese or 'de' for German.
  - Discussion: (Last updated: 30.08.2024) These locale specifiers are used consistently between the MMF Website, MMF App and MMF Markdown documents and they are defined inside Xcode project settings inside the mac-mouse-fix and mac-mouse-fix-website repos. We really only need this `&locale=` param for linking to markdown documents, since the website and app have their own logic for deciding which language to display themselves in.
