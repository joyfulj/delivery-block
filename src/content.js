console.log("Injected...");

let isShow = true;

const parser = new DOMParser();

const itemListQueryName = '#searchListItems';

let itemList = [
    { itemName: '#smartClickItems', linkParser: parseLinkFromSmartClickItems },
    { itemName: '#searchListItems', linkParser: parseLinkFromSearchItems }
]

let itemListQueryNames = ['#searchListItems']


for (let item of itemList) {
    let itemListNode = document.querySelector(item.itemName);
    if (itemListNode) {
        for (const node of itemListNode.querySelectorAll('li')) {
            let href = node.querySelector('div.item_info a')['href'];
            let link = item.linkParser(href);
            let title = node.querySelector('span.title').textContent;
            if (link) {
                // console.log("[" + item.itemName + "] 상품: " + title);
                // console.log("[" + item.itemName + "] link: " + link);
                checkItemPage(link).then((delComp) => {
                    // console.log('택배회사: ' + delComp);
                    if ((delComp != undefined) && delComp.includes('CJ', '대한통운')) {
                        console.log('CJ!!')
                        node.setAttribute("class", "delivery-block");
                    }
                });
            }
        }
    }
}

function hideCJ() {
    console.log('hide');
    let css = document.createElement("style");
    css.id = 'delivery-block-style';
    css.type = "text/css";
    css.innerHTML = ".delivery-block {display:none}";
    document.body.appendChild(css);
}

function showCJ() {
    console.log('show');
    let element = document.querySelector('#delivery-block-style');
    element.parentElement.removeChild(element);
}


function parseLinkFromSmartClickItems(href) {
    let link = href.substring(href.indexOf('nextUrl=') + 'nextUrl='.length, href.indexOf('\&'));
    return decodeURIComponent(link);
}


function parseLinkFromSearchItems(href) {
    return href;
}

function checkItemPage(link) {
    return fetch(link, { method: 'GET' })
        .then((response) => {
            return response.text();
        })
        .then((text) => {
            let dom = parser.parseFromString(text, 'text/html');
            let queryResult = dom.querySelector('span.delcomp');
            if(queryResult != null){
                return queryResult.textContent;
            }
            return undefined;
        })
        .catch((err) => {
            console.log('Fetch error!', err);
        });
}

function toggle(sendResponse) {
    isShow = !isShow;
    if (isShow) {
        showCJ();
        sendResponse({icon:"show.png"});
    } else {
        hideCJ();
        sendResponse({icon:"hide.png"});
    }
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == 'toggle') {
        toggle(sendResponse);
    }
});