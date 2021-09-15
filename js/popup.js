document.addEventListener("DOMContentLoaded", () => {
  $(function () {
    $(document).tooltip();
  });

  chrome.storage.sync.get("netflixAutoSkip_setting_v133", function (items) {
    const setting = items.netflixAutoSkip_setting_v133;
    let checkboxList = document.querySelectorAll(".option input");
    for (let i = 0; i < checkboxList.length; i++) {
      checkboxList[i].checked = setting[i];
    }
  });

  document.querySelector("body").addEventListener("change", () => {
    const checkbox = Array.from(document.querySelectorAll(".option input"));

    const result = checkbox.reduce((prev, curr, i) => {
      if (!prev) prev = [];
      return [...prev, curr.checked];
    }, "");
    chrome.storage.sync.set(
      {
        netflixAutoSkip_setting_v133: result,
      },
      function () {}
    );
  });
});
