let setting,
  skipList = [];

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
});

/**************************************************************************************************** */

const autoClick = (btn) => {
  if (btn) {
    console.log('autoClick');
    console.log(btn);
    btn.disabled = false;
    btn.click();
  }
}

const autoSkipAll = () => {
  if (skipList.intro) {
    autoClick(document.querySelector('.watch-video--skip-content-button'));
  }
  if (skipList.next) {
    autoClick(document.querySelector('button[data-uia=next-episode-seamless-button]'));
  }
}

const watchInterval = setInterval(() => {
  if (window.location.pathname.indexOf('watch') !== -1) {
    autoSkipAll();
  }
}, 1000);
