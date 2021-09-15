let setting,
  skipList = [],
  setChange = false,
  pathName = "";

const makeSkipList = (setting) => {
  let intro = false;
  let next = false;

  if (setting[0] === true) intro = true;
  if (setting[1] === true) next = true;

  return {
    intro,
    next,
  };
};

chrome.storage.sync.get("netflixAutoSkip_setting_v133", function (items) {
  setting = items.netflixAutoSkip_setting_v133;
  if (setting === undefined) {
    chrome.storage.sync.set(
      {
        netflixAutoSkip_setting_v133: [true, true],
      },
      function () {}
    );
  }
  skipList = makeSkipList(setting);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  setting = changes.netflixAutoSkip_setting_v133.newValue;
  skipList = makeSkipList(setting);
  setChange = true;
});

/**************************************************************************************************** */

const target = document.getElementById("appMountPoint");

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.nextSibling && mutation.addedNodes.length) {
      Array.from(mutation.addedNodes).filter((node) => {
        if (node.classList && node.classList.contains("interrupter-action")) {
          node.firstChild.click();
        }

        if (
          skipList.intro &&
          node.classList &&
          node.classList.contains("skip-credits")
        ) {
          setTimeout(() => {
            node.querySelector("a").click();
          }, 200);
        }

        if (
          skipList.next &&
          node.className === "main-hitzone-element-container" &&
          document.querySelectorAll("button").length === 12
        ) {
          setTimeout(() => {
            document.querySelector(".button-nfplayerNextEpisode").click();
          }, 200);
        }
      });
    }
  });
});

const config = { childList: true, subtree: true };

const watchInterval = setInterval(() => {
  const newPathName = window.location.pathname;
  if (newPathName !== pathName) {
    if (newPathName.indexOf("watch") !== -1) {
      observer.disconnect();
      observer.observe(target, config);
    } else {
      observer.disconnect();
    }
  } else if (setChange) {
    observer.disconnect();
    observer.observe(target, config);
    setChange = false;
  }
  pathName = newPathName;
}, 3000);
