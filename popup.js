console.log("this is a popup.js file")

function extractUri(url) {
  const match = url.match(/uri=(https?:\/\/[^\s&]+)/);
  if (match) return match[1];
  return null;
}

const hosts = {};
const hostContainer = document.getElementById('hostContainer');

chrome.tabs.query({}, async (tabs) => {


  for (let tab of tabs) {
    let uri = tab.url;
    if (tab.url.startsWith("chrome-")) {
      uri = extractUri(tab.url);
    }


    try {

      let URIObj = new URL(uri);
      let host = URIObj.host;
      if (!hosts[host]) {
        hosts[host] = [];
      }
      hosts[host].push(uri);
    } catch (e) {
      console.error(e);
    }


  }

})

for (let host in groupedUris) {
  let hostDiv = document.createElement('div');
  hostDiv.classList.add('host');

  // Add the host name as a header
  let hostHeader = document.createElement('h3');
  hostHeader.textContent = `Host: ${host}`;
  hostDiv.appendChild(hostHeader);

  // Create an unordered list for the URLs under this host
  let ul = document.createElement('ul');

  groupedUris[host].forEach((uri) => {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.href = uri;
    a.textContent = uri;
    a.target = "_blank"; // Open the link in a new tab
    li.appendChild(a);
    ul.appendChild(li);
  });

  hostDiv.appendChild(ul);
  hostContainer.appendChild(hostDiv);

}
