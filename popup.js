console.log("this is a popup.js file")

function extractUri(url) {
  const match = url.match(/uri=(https?:\/\/[^\s&]+)/);
  if (match) return match[1];
  return null;
}


console.log("popup.js loaded");

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({}, async (tabs) => {
    const hostContainer = document.getElementById('hostContainer');
    const copyButton = document.getElementById('copyButton');
    let groupedUris = {};
    let allUrlsText = '';

    for (let tab of tabs) {
      let uri = tab.url;
      if (tab.url.startsWith("chrome-")) {
        uri = extractUri(tab.url);
      }

      const regex = /https?:\/\/([a-zA-Z0-9.-]+)/;
      let hostname = uri.match(regex);

      if (hostname == null) {
        hostname = uri
      } else {
        hostname = hostname[1]
      }

      if (!groupedUris[hostname]) {
        groupedUris[hostname] = [];
      }
      groupedUris[hostname].push([uri, tab.title]);
      //try {
      //  let urlObj = new URL(uri);
      //  let host = urlObj.host;

      //  if (!groupedUris[host]) {
      //    groupedUris[host] = [];
      //  }
      //  groupedUris[host].push([uri, tab.title]);
      //} catch (error) {
      //  console.error(`Invalid URL: ${uri}`, error);
      //}
    }

    for (let host in groupedUris) {
      let hostDiv = document.createElement('div');
      hostDiv.classList.add('host');

      let hostHeader = document.createElement('h3');
      hostHeader.textContent = `Host: ${host}`;
      hostDiv.appendChild(hostHeader);

      let ul = document.createElement('ul');
      allUrlsText += `Host: ${host}\n`;

      groupedUris[host].forEach(([uri, title]) => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.href = uri;
        if (title == "..." || title == "") {
          a.textContent = uri;
        } else {
          a.textContent = title;
        }
        a.target = "_blank"; // Open the link in a new tab
        li.appendChild(a);
        ul.appendChild(li);

        allUrlsText += `  - ${uri}\n`;
      });

      hostDiv.appendChild(ul);
      hostContainer.appendChild(hostDiv);

      // Add a newline after each host block for formatting
      allUrlsText += '\n';
    }
    copyButton.addEventListener('click', () => {
      copyToClipboard(allUrlsText);
    });
  });
});

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  alert('All URLs copied to clipboard!');
}
