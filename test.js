/*
Helper functions for doings tests inside index.html
*/

function setUpTests() {

    /*

        Update: (04.09.2024)
            I could not find a way to do this reliably.
            In Safari we can almost reliably detect whether we are in the 'Always Allow' case or not. But it breaks if the user is moving the mouse while the page is loading.
            I didn't analyze the other browsers too much since Safari is our priority.

            Idea (05.09.2024): Maybe monitoring document.activeElement could give us the needed extra info to reliably close the window right after the URL is opened?

    Trying to improve post-action timing:
    (Last updated: 02.09.2024)

        Our goal is to detect when the url was opened, and then execute the post-action immediately. This is very difficult.
        Here we documented some tests to try and solve the problem:

        To reset always-allow:
            See index.html

        We set up window.onblur() and window.onfocus() listeners with console.logs() and the documented the sequence and timing of the resulting console.logs().
            We tested the timings before and after selecting the 'Always Allow' option.
            Here are the results:

            Safari:

                Before Always Allow:
                    - page/dialog open -> nothing
                    - first input -> `blur` 
                        ("first input" can be mouse move/click, or keyboard press)
                        Happens >~ 300ms after addEventListener()
                    - dialog click 'allow' -> `focus`
                    - dialog click 'cancel' -> `focus`
                    - dialog click 'always allow' -> `focus`
                    - window click after app open -> `focus`
                        (Seems like this can produce double `focus` log without `blur` log in between, which is weird. (02.09.2024, macOS 15 Sequoia Beta))
                
                After Always Allow:
                    - page/app open -> `blur`
                        <~ 100ms after addEventListener()
                    - window click after app open -> `focus`

            Chrome:

                Before Always Allow:
                    - page/dialog open -> `blur`
                    <~ 25ms after addEventListener()
                    - page reload with open dialog -> nothing (feels like a bug)
                    - dialog click 'allow' -> 'Launched external handler for 'macmousefix:activate'.'
                    - dialog click 'cancel' -> `focus`
                    - dialog click with 'always allow' selected -> same as normal 'allow' and 'cancel'.
                    - window click after app open -> `focus`

                After Always Allow:
                    - page/app open -> `blur` and `Launched external handler for 'macmousefix:activate'.`
                    <~ 50ms after addEventListener()
                    - window click after app open -> `focus`

            Firefox:

                Before Always Allow:
                    - page/dialog open -> `focus` AND `blur`
                        -> `focus` ~< 5ms, `blur` ~< 10 ms after addEventListener()
                    - page reload with open dialog -> nothing (same weirdness as Chrome)
                    - dialog click 'allow' -> `focus` AND `blur`
                    - dialog click 'cancel' -> `focus`
                    - dialog click with 'always allow' selected -> same as normal 'allow' and 'cancel'
                    - window click after app open -> `focus`

                After Always Allow:
                    - page/app open -> `focus` AND `blur`
                        `focus` ~< 5ms, `blur` ~< 40 ms after addEventListener()
                    - window click after app open -> `focus`

            -> All browsers behave pretty different. Firefox is the only one where the behaviour seems consistent to me.
            -> Our goal is to detect when the url was opened, and then execute the post-action. 
                Do we have enough information to do this on every browser?
                Safari: 
                    - When window.onblur is triggered shortly after page load, we know we're in the always-allow case, then we can immediately do the post-action.
                    - When there's a delay before window.onblur, we're in the `not-always-allow` case. Then we can wait for the next window.onfocus() before we do the post-action.
                Chrome: 
                    - Chrome logs "Launched external handler for 'macmousefix:activate'." right when it opens the url. We can simply do the post-action right after that, if we can intercept the logs.
                Firefox:
                    - The only way I see to differentiate between the "`focus` AND `blur`" that happens when the dialog opens vs the "`focus` AND `blur` when the app is opened in the 'always-allow' case is the 
                        slight timing difference of `blur`. However, this seems very non-robust, since we have to normalize the timing based on CPU Speed somehow. I could divide blurtime / focustime, to normalize, which
                        might work well but might also break in edge cases or when the performance characteristics of a users system are very different. And if Firefox gets optimized, that could also break the thing.
                Update: 
                    I don't think any of this is robust. I cannot find a way to intercept the Chrome logs. (I can swap out console.log for my own implementation but this doesn't affect the logs produced by Chrome.)
                        All the other stuff is timing-based heuristics with not that much difference between the timings. (If it was a huge difference like 1ms vs 1000ms, I'd be ok with the heuristic I think but it's 10ms vs 40ms on FF, 100ms vs >= 300ms on Safari, and 25ms vs 50ms on Chrome. I don't feel confident using any of that.)
                        -> Soooo we'll give up on the idea of doing the post-action immediately after redirect page has opened an app/been dismissed by the user.

                    Alternative approaches I considered: 
                        navigator.permissions.query() lets you query certain permissions but not app-opening permissions (as of 02.09.2024)
                        We tried monitoring other events than onblur and onfocus to maybe establish a 'baseline' for the timing heuristics to increase their accuracy, but the only other event I could find that fires is `window.onpageshow()` and that always fires within 0ms or 1ms, so not useful for establishing the baseline.
                
                Small udpate: 
                    (04.09.2024)
                    We found something that almost worked on Safari: Observing the order of blur (or focus or sth?) and mouseover (or mousemoved?) events would let us determine whether we're in the always-allow case or not - which let us close the page immediately after opening the URL, however, this breaks when moving the mouse pointer in those few frames after opening the page, but before the dialog is shown.

    */
        
    // Test permissions API
    if (false) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            console.log(`Permissions API test: ${result.state}`);
        })
    }
    
    // Get ts
    const tsStart = Date.now();

    function setUpDOMEventListeners() {
        return;
        console.log(`Setting up DOM listeners...`);

        document.body.onmouseenter = (ev) => {
            console.log(`b mousenter`);
            console.log(`   -> ${Date.now() - tsStart}ms, mouse: (${ev.clientX}, ${ev.clientY})`);
        }
        document.body.onmouseleave = (ev) => {  
            console.log(`b mouseleave`);
            console.log(`   -> ${Date.now() - tsStart}ms, mouse: (${ev.clientX}, ${ev.clientY})`);
        }
    }

    function setUpEventListeners() {

        console.log(`Setting up event listeners...`);

        document.addEventListener('DOMContentLoaded', () => {
            console.log(`DOMContentLoaded`);
            console.log(`   -> ${Date.now() - tsStart}ms`);
            setUpDOMEventListeners();
        });
        document.addEventListener('visibilitychange', () => {
            console.log(`visiblity: ${document.visibilityState}`); // 'visible' or 'hidden'
            console.log(`   -> ${Date.now() - tsStart}ms`);
        });
        window.addEventListener('load', () => {
            console.log('load');
            console.log(`   -> ${Date.now() - tsStart}ms`);
        });
        document.addEventListener('readystatechange', () => {
            console.log(`readystatechange: ${document.readyState}`);
            console.log(`   -> ${Date.now() - tsStart}ms`);
        });

        // Setup other event intercepts
        //  We might use this as a timing baseline for the blur/focus events
        document.onmouseover = (ev) => {
            console.log(`mouseover`);
            console.log(`   -> ${Date.now() - tsStart}ms, mouse: (${ev.clientX}, ${ev.clientY})`);
        }
        document.onmouseout = (ev) => {  
            console.log(`mouseout`);
            console.log(`   -> ${Date.now() - tsStart}ms, mouse: (${ev.clientX}, ${ev.clientY})`);
        }
        var isFirstMouseMove = true;
        window.onmousemove = (ev) => {
            // if (isFirstMouseMove) {
                console.log(`mousemove`);
                console.log(`   -> ${Date.now() - tsStart}ms, mouse: (${ev.clientX}, ${ev.clientY})`);
                isFirstMouseMove = false;
            // }
        }

        if (true) {

            window.onmessage = () => {
                console.log(`message`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onmessageerror = () => {
                console.log(`messageerror`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onerror = () => {
                console.log(`error`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }

            window.oncancel = () => {
                console.log(`cancel`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onclick = () => {
                console.log(`click`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onload = () => {
                console.log(`load`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onloadstart = () => {
                console.log(`loadstart`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onloadeddata = () => {
                console.log(`loadeddata`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onloadedmetadata = () => {
                console.log(`loadedmetadata`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onpageshow = () => {
                console.log(`pageshow`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onrejectionhandled = () => {
                console.log(`rejectionhandled`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onwaiting = () => {
                console.log(`waiting`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onstalled = () => {
                console.log(`stalled`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            window.onsecuritypolicyviolation = () => {
                console.log(`securitypolicyviolation`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            document.onblur = () => {
                console.log(`dblur`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            document.onfocus = () => {
                console.log(`dfocus`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            document.onended = () => {
                console.log(`dended`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            document.oncuechange = () => {
                console.log(`doncuechange`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            document.oninput = () => {
                console.log(`dinput`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            document.onload = () => {
                console.log(`dload`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            document.onloadstart = () => {
                console.log(`dloadstart`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            document.onloadeddata = () => {
                console.log(`dloadeddata`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
            document.onloadedmetadata = () => {
                console.log(`dloadedmetadata`);
                console.log(`   -> ${Date.now() - tsStart}ms`);
            }
        }

        // Setup blur/focus intercept
        window.onblur = (ev) => { 
            console.log(`blur`);
            console.log(`   -> ${Date.now() - tsStart}ms, mouse: (${ev.clientX}, ${ev.clientY})`);
        };
        window.onfocus = (ev) => {

            console.log(`focus`);
            console.log(`   -> ${Date.now() - tsStart}ms, mouse: (${ev.clientX}, ${ev.clientY})`);
        };
    };
    setUpEventListeners();

    // Setup console.log intercept
    if (false) {
        (function() {
            var exLog = console.log;
            console.log = function(msg) {
                exLog.call(console, '(intercepted:)')
                exLog.apply(console, arguments);
            }
        })()

        console.log(`testtt`);
    }
    // TEST
    //  Simulate escape-press
    // (Doesn't do anything to the dialog.)
    if (false) {
        setTimeout(() => {
            console.log(`Simulating escape-press...`);
            window.dispatchEvent(
                new KeyboardEvent("keydown", {
                    altKey: false,
                    code: "Escape",
                    ctrlKey: false,
                    isComposing: false,
                    key: "Escape",
                    location: 0,
                    metaKey: false,
                    repeat: false,
                    shiftKey: false,
                    which: 27,
                    charCode: 0,
                    keyCode: 27,
                })
            );
        }, 500);
    };
}