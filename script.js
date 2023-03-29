const MAKEUP_API_URL = "https://makeup-api.herokuapp.com/api/v1/products.json";
const ITEMS_PER_PAGE = 5;
var TOTAL_PAGES = 0;
var MOCK_DATA_LENGTH = 0;
var JSON_DATA = null;

function newElement(type) {
  let element = document.createElement(type);
  return element;
}

function resolveBrandname(item) {
  if (item != null) {
    if (item.brand != null) {
      let tempStr = item.brand;
      let resultStr = tempStr.charAt(0).toUpperCase() + tempStr.slice(1);
      console.log(resultStr);
      return resultStr;
    } else {
      return item.name;
    }
  } else {
    return "NA";
  }
}

function resolvePrice(item) {
  if (item != null) {
    if (item.price != null) {
      if (item.price_sign != null) {
        let resultStr = item.price + " " + item.price_sign;
        console.log(resultStr);
        return resultStr;
      } else {
        return item.price;
      }
    } else {
      return "no data";
    }
  } else {
    return "NA";
  }
}

function initialization() {
  let h1Element = newElement("h1");
  h1Element.innerText = "GUVI - 1st Web code project (MAKE UP API)";
  document.body.append(h1Element);
}

function renderLayoutWithItems(dataItems) {
  let mainDiv = document.createElement("div");
  mainDiv.setAttribute("id", "main-div");
  let rootDiv = document.createElement("div");
  rootDiv.setAttribute("id", "root-div");
  rootDiv.setAttribute("class", "container pagination-custom");
  document.body.append(rootDiv);
  let tableColDiv = document.createElement("div");
  tableColDiv.setAttribute("class", "table-responsive");
  tableColDiv.setAttribute("id", "tableContainerDiv");
  let tableElement = document.createElement("table");
  tableElement.setAttribute("class", "table");
  tableElement.setAttribute("class", "table");
  tableElement.classList.add("table-bordered");
  tableColDiv.appendChild(tableElement);
  let tableHeadElement = document.createElement("thead");
  tableHeadElement.setAttribute("class", "thead-dark");
  let tableBodyElement = document.createElement("tbody");
  tableBodyElement.setAttribute("id", "tableContent");
  let tableRowElement = document.createElement("tr");
  ["Product Image", "Name", "Brand", "Description", "Price"].forEach((i) => {
    let thElement = document.createElement("th");
    thElement.innerText = i;
    tableRowElement.appendChild(thElement);
    thElement.setAttribute("scope", "col");
  });
  let initialDataItems = dataItems.slice(0, ITEMS_PER_PAGE);
  initialDataItems.forEach((obj) => {
    let trElement = document.createElement("tr");
    let tdElement1 = document.createElement("td");
    tdElement1.innerHTML = `<a href=${obj.product_link} target="_blank"><image src=${obj.api_featured_image} alt=${obj.name}/></a><br/><a href=${obj.product_link}  target="_blank">More product details</a>`;
    let tdElement2 = document.createElement("td");
    tdElement2.innerHTML = `<span class="name">${obj.name}</span>`;
    let tdElement3 = document.createElement("td");
    tdElement3.innerText = resolveBrandname(obj);
    let tdElement4 = document.createElement("td");
    tdElement4.innerText = obj.description;
    let tdElement5 = document.createElement("td");
    tdElement5.innerHTML = `<span class="price">${resolvePrice(obj)}</span>`;
    trElement.append(
      tdElement1,
      tdElement2,
      tdElement3,
      tdElement4,
      tdElement5
    );
    tableBodyElement.appendChild(trElement);
  });
  tableHeadElement.appendChild(tableRowElement);
  tableElement.appendChild(tableHeadElement);
  tableElement.appendChild(tableBodyElement);
  rootDiv.append(tableColDiv);
}

function createPagination(dataItems) {
//   console.log("************  createPagination  ***********");
//   console.log(" Data ", dataItems);
  let paginationDiv = document.createElement("div");
  paginationDiv.setAttribute("class", "pagination-section");
  paginationDiv.setAttribute("Id", "buttons");
  [1, 2, 3, 4, 5, 6].forEach((i) => {
    // console.log(i);
    let anchorElement = document.createElement("a");
    anchorElement.setAttribute("href", "#");
    if (i === 1) {
      anchorElement.innerHTML = "&laquo; First";
    } else if (i === 6) {
      anchorElement.innerHTML = "Last &raquo;";
    } else {
      anchorElement.innerText = "" + i;
    }
    anchorElement.addEventListener("click", clickHandler);
    paginationDiv.appendChild(anchorElement);
  });
  let rootContainerDiv = document.getElementById("root-div");
  rootContainerDiv.append(paginationDiv);
}

let clickHandler = function loadTableData(event) {
  let pageSize = ITEMS_PER_PAGE;
//   console.log(event.target);
//   console.log(event.target.innerText);
  let pageNumber = 0;
  if (event.target.innerText.includes("First")) {
    pageNumber = 1;
  } else if (event.target.innerText.includes("Last")) {
    pageNumber = MOCK_DATA_LENGTH / ITEMS_PER_PAGE;
  } else {
    pageNumber = parseInt(event.target.innerText);
  }
  var mockDataSlice = JSON_DATA.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );
  const tableBody = document.getElementById("tableContent");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.lastChild);
  }
  let txt = "";
  for (let i = 0; i < mockDataSlice.length; i++) {
    txt =
      txt +
      `<tr><td><a href=${mockDataSlice[i].product_link}  target="_blank"><image src=${mockDataSlice[i].api_featured_image} alt=${mockDataSlice[i].name}/></a><br/><a href=${mockDataSlice[i].product_link}  target="_blank">More product details</a></td><td><span class="name">${mockDataSlice[i].name}</span></td>
                       <td>` +
      resolveBrandname(mockDataSlice[i]) +
      `</td>` +
      `<td>${mockDataSlice[i].description}</td><td>` +
      resolvePrice(mockDataSlice[i]) +
      `</td></tr>`;
  }
  tableBody.innerHTML = txt;
  pageNumbersGenerator(pageNumber);
};

let pageNumbersGenerator = function dynamicPagesCalc(pageNumber) {
//   console.log("Total Pages :: ", TOTAL_PAGES);
//   console.log(" pageNumber ", pageNumber);
//   console.log(" ITEMS_PER_PAGE", ITEMS_PER_PAGE);

  let paginationElement = document.getElementById("buttons");
  while (paginationElement.firstChild) {
    paginationElement.removeChild(paginationElement.lastChild);
  }

  if (pageNumber <= 3) {
    let index = 0;
    while (++index < ITEMS_PER_PAGE) {
    //   console.log(index);
      let anchorElement = document.createElement("a");
      anchorElement.setAttribute("href", "#");
      anchorElement.innerText = "" + index;
      anchorElement.addEventListener("click", clickHandler);
      paginationElement.appendChild(anchorElement);
    }
    let anchorElement2 = document.createElement("a");
    anchorElement2.setAttribute("href", "#");
    anchorElement2.innerHTML = "Last &raquo;";
    anchorElement2.addEventListener("click", clickHandler);
    paginationElement.appendChild(anchorElement2);
  }

  if (pageNumber > 3 && pageNumber < TOTAL_PAGES - 2) {
    let anchorElement = document.createElement("a");
    anchorElement.setAttribute("href", "#");
    anchorElement.innerHTML = "&laquo; First";
    anchorElement.addEventListener("click", clickHandler);
    paginationElement.appendChild(anchorElement);
    [
      pageNumber - 2,
      pageNumber - 1,
      pageNumber,
      pageNumber + 1,
      pageNumber + 2,
    ].forEach((i) => {
    //   console.log(i);
      let anchorElement = document.createElement("a");
      anchorElement.setAttribute("href", "#");
      anchorElement.innerText = "" + i;
      anchorElement.addEventListener("click", clickHandler);
      paginationElement.appendChild(anchorElement);
    });
    let anchorElement2 = document.createElement("a");
    anchorElement2.setAttribute("href", "#");
    anchorElement2.innerHTML = "Last &raquo;";
    anchorElement2.addEventListener("click", clickHandler);
    paginationElement.appendChild(anchorElement2);
  }
  if (pageNumber >= TOTAL_PAGES - 2) {
    let anchorElement = document.createElement("a");
    anchorElement.setAttribute("href", "#");
    anchorElement.innerHTML = "&laquo; First";
    anchorElement.addEventListener("click", clickHandler);
    paginationElement.appendChild(anchorElement);
    let index = TOTAL_PAGES - ITEMS_PER_PAGE;
    while (index <= TOTAL_PAGES) {
    //   console.log(index);
      let anchorElement = document.createElement("a");
      anchorElement.setAttribute("href", "#");
      anchorElement.innerText = "" + index;
      anchorElement.addEventListener("click", clickHandler);
      paginationElement.appendChild(anchorElement);
      index++;
    }
  }
};

async function fetchMakeupItems() {
  const responseObj = await fetch(MAKEUP_API_URL);
  if (!responseObj.ok) {
    const message = `An error occured: ${responseObj.status}`;
    throw new Error(message);
  }
  let makeupItems = await responseObj.json();
  return makeupItems;
}

(function () {
  initialization();
  fetchMakeupItems()
    .then((makeupItems) => {
    //   console.log(" ******** JSON response received ********* ");
    //   console.log(makeupItems);
    //   console.log("JSON Data length ", makeupItems.length);

      JSON_DATA = makeupItems;
      TOTAL_PAGES = Math.round(makeupItems.length / ITEMS_PER_PAGE);
      MOCK_DATA_LENGTH = makeupItems.length;

      renderLayoutWithItems(makeupItems);

      createPagination(makeupItems);
    })
    .catch((error) => {
    //   console.log("Something went wrong... Please find details below.");
    //   console.log(error);
    });
})();
