// CONSTANTS
const SKIP_CREDIT_CLASSNAME = "watch-video--skip-content"; // subject to change by Netflix
const SKIP_CREDIT_BUTTON_CLASSNAME = "watch-video--skip-content-button"; // subject to change by Netflix
const SKIP_COUNTDOWN_SECONDS = 2;
const ENABLE_SKIP_TRIGGER_COUNTDOWN_SECONDS = 5;

// GLOBAL VARIABLES
let enableSkipTrigger = true;

/**
 * trigger the click event on the skip button
 * @param {object} skipButtonContainerElement 
 */
function triggerSkip(skipButtonContainerElement) {
  // do nothing if skip credit button container isn't present in the DOM
  const skipButtonContainerElementList = document.body.getElementsByClassName(SKIP_CREDIT_CLASSNAME);
  if (!skipButtonContainerElementList.length) return;

  const skipElementButton = skipButtonContainerElement.children[0];
  if(skipElementButton == null) {
    enableSkipTrigger = true;
    return;
  };

  /**
   * if the skip button is visible on the page
   * and the click anchor element exists
   * then trigger a click event on the anchor element
   */
  skipElementButton.click();
  console.info("==========SkipAssist Skipped Intro!==========");

  /**
   * Deliberately using setTimeout to enable skip trigger
   * here so the skip button is not triggered multiple times
   * within a short period.
   * When the skip button is clicked, the element's class is updated which
   * triggers the MutationObserver on the body which will
   * attempt to trigger the skip button again if enableSkipTrigger is true.
   * This happens within 1 - 2s after the skip button is clicked.
   */
   setTimeout(() => {
    enableSkipTrigger = true;
  }, ENABLE_SKIP_TRIGGER_COUNTDOWN_SECONDS * 1000);
}

/**
 * Creates the mutation observer to observe the body element's children.
 * The skip button isn't added to the dom after page load therefore,
 * we need to observe the body element to know when the skip button is added to the dom.
 * @param {object} bodyElement
 */
function AttachBodyMutationObserver(bodyElement) {
  const options = { childList: true, subtree: true };
  const callback = function(mutations, observer) {
    if(!enableSkipTrigger) return;

    const skipButtonContainerElementList = bodyElement.getElementsByClassName(SKIP_CREDIT_CLASSNAME);

    if (!skipButtonContainerElementList.length) return;

    const skipButtonContainerElement = skipButtonContainerElementList[0];
    if (!skipButtonContainerElement) return;

    /**
     * if skip button has been added to the dom as a child of the body element
     * and the skip button hasn't been triggered
     */

    enableSkipTrigger = false;
    setTimeout(() => {
      triggerSkip(skipButtonContainerElement);
    }, SKIP_COUNTDOWN_SECONDS * 1000);
  }

  const observer = new MutationObserver(callback);

  observer.observe(bodyElement, options);
}

/**
 * get body element and attach a mutation observer
 */
function init() {
  const body = document.body;

  if (!body.children || !body.children.length) return;

  AttachBodyMutationObserver(body);
}

init();
