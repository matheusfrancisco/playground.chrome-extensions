console.log("this is a popup.js file")

function extractUri(url) {
  const match = url.match(/uri=(https?:\/\/[^\s&]+)/);
  if (match) return match[1];
  return null;
}

//const hosts = {"google.com": ["google.com"]};
//const hostContainer = document.getElementById('hostContainer');

//chrome.tabs.query({}, async (tabs) => {
//
//
//  for (let tab of tabs) {
//    let uri = tab.url;
//    if (tab.url.startsWith("chrome-")) {
//      uri = extractUri(tab.url);
//    }
//
//
//    try {
//
//      let URIObj = new URL(uri);
//      let host = URIObj.host;
//      if (!hosts[host]) {
//        hosts[host] = [];
//      }
//      hosts[host].push(uri);
//    } catch (e) {
//      console.error(e);
//    }
//
//
//  }
//
//})


//for (let host in hosts) {
//  let hostDiv = document.createElement('div');
//  hostDiv.classList.add('host');
//
//  // Add the host name as a header
//  let hostHeader = document.createElement('h3');
//  hostHeader.textContent = `Host: ${host}`;
//  hostDiv.appendChild(hostHeader);
//
//  // Create an unordered list for the URLs under this host
//  let ul = document.createElement('ul');
//
//  hosts[host].forEach((uri) => {
//    let li = document.createElement('li');
//    let a = document.createElement('a');
//    a.href = uri;
//    a.textContent = uri;
//    a.target = "_blank"; // Open the link in a new tab
//    li.appendChild(a);
//    ul.appendChild(li);
//  });
//
//  hostDiv.appendChild(ul);
//  hostContainer.appendChild(hostDiv);
//
//}

console.log("end file")

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({}, async (tabs) => {
    let groupedUris = {};
    const hostContainer = document.getElementById('hostContainer');
    const copyButton = document.getElementById('copyButton');
    let allUrlsText = '';

    for (let tab of tabs) {
      let uri = tab.url;
      if (tab.url.startsWith("chrome-")) {
        uri = extractUri(tab.url); 
      }

      try {
        let urlObj = new URL(uri);
        let host = urlObj.host;

        if (!groupedUris[host]) {
          groupedUris[host] = [];
        }
        groupedUris[host].push([uri, tab.title]);
      } catch (error) {
        console.error(`Invalid URL: ${uri}`, error);
      }
    }

    for (let host in groupedUris) {
      let hostDiv = document.createElement('div');
      hostDiv.classList.add('host');

      let hostHeader = document.createElement('h3');
      hostHeader.textContent = `Host: ${host}`;
      hostDiv.appendChild(hostHeader);

      let ul = document.createElement('ul');

      groupedUris[host].forEach(([uri, title]) => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.href = uri;

        if (title == "" || title == "...") {
          a.textContent = uri;
        } else {
          a.textContent = title;
        }
        a.target = "_blank"; // Open the link in a new tab
        li.appendChild(a);
        ul.appendChild(li);

        allUrlsText += `Host: ${host}\n${uri}\n\n`;
      });

      hostDiv.appendChild(ul);
      hostContainer.appendChild(hostDiv);
    }
    copyButton.addEventListener('click', () => {
      copyToClipboard(allUrlsText);
    });
  });
});

//async function fetchPageTitle(uri) {
//  try {
//    const response = await fetch(uri);
//    const text = await response.text();
//    const titleMatch = text.match(/<title>(.*?)<\/title>/i);
//
//    if (titleMatch && titleMatch.length > 1) {
//      return titleMatch[1]; // Return the page title
//    } else {
//      return null;
//    }
//  } catch (error) {
//    console.error(`Error fetching title for ${uri}:`, error);
//    return null;
//  }
//}

// Function to copy the text to the clipboard
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  alert('All URLs copied to clipboard!');
}
