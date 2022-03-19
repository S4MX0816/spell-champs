const inputs = document.querySelectorAll("input");
const grades = document.querySelectorAll(".grade");
const textareas = document.querySelectorAll("textarea");
const testPapers = document.querySelectorAll(".test-paper");
// const watermarks = document.querySelectorAll(".watermark");
const inputBay = document.querySelector(".input-bay");
const pdfDiv = document.querySelector(".pdf-main");
const headingTexts = document.querySelectorAll("#heading-text");

const init = function () {
  stickyBay();
};

const stickyBay = function () {
  const offset =
    document.documentElement.clientHeight -
    inputBay.getBoundingClientRect().height;
  inputBay.style.top = `${offset < 0 ? offset : 45}px`;
};

const clearInputs = function (handler) {
  textareas[handler ? 0 : 1].value = "";
};

const generate = function (handler) {
  grades[0].innerText = `Grade – ${inputs[0].value}`;
  grades[1].innerText = `कक्षा – ${inputs[0].value}`;
  let x = handler ? textareas[0].value : textareas[1].value;
  x = x.toUpperCase();
  if (!x) return;
  x = x.split(/,|\n/);
  const y = x
    .map((el) => {
      if (!el) return false;
      return el.trim();
    })
    .filter((el) => el);
  y.sort((a, b) => a.localeCompare(b));

  const element = document.querySelector(`.table-data${handler ? 0 : 1}`);
  element.innerHTML = "";

  const dataLength = Math.ceil(y.length / 2);
  let html = `<table>
              <tr>
                <th colspan="2">${handler ? "Week" : "सप्ताह"} #${
    inputs[1].value
  } (${inputs[2].value})</th>
              </tr>`;
  for (let i = 0; i < dataLength; i++) {
    html += `<tr${i % 2 === 0 ? ' class="highlight"' : ""}>
              <td>${y[i]}</td>
              <td>${y[i + dataLength] ? y[i + dataLength] : ""}</td>
            </tr$>`;
  }
  html += `</table>`;
  element.innerHTML = html;
};

const generatePDF = function () {
  // watermarks.forEach((el, idx) => {
  //   const check = getComputedStyle(el).visibility;
  //   if (check === "hidden")
  //     el.style.setProperty("visibility", "visible", "important");
  //   if (!check) testPapers[idx].insertAdjacentHTML("afterbegin", el.outerHTML);
  // });
  const filename = inputs[0].value
    ? `Grade – ${inputs[0].value}.pdf`
    : `myFile.pdf`;
  html2pdf()
    .set({
      margin: [0, 0],
      filename,
      image: { type: "jpeg", quality: 1 },
      pagebreak: { mode: "avoid-all", after: ".pdf" },
      html2canvas: { scale: 4, letterRendering: true },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    })
    .from(pdfDiv)
    .save();
};

init();
window.addEventListener("resize", stickyBay);

textareas.forEach((el) => {
  el.style.minHeight = `${el.getBoundingClientRect().height}px`;
  el.style.minWidth = `${el.getBoundingClientRect().width}px`;
  el.style.maxWidth = `${el.getBoundingClientRect().width}px`;
  let beforeHeight, beforeWidth, afterHeight, afterWidth;
  el.addEventListener("mousedown", (el) => {
    beforeHeight = el.target.getBoundingClientRect().height;
    beforeWidth = el.target.getBoundingClientRect().width;
  });

  el.addEventListener("mouseup", (el) => {
    afterHeight = el.target.getBoundingClientRect().height;
    afterWidth = el.target.getBoundingClientRect().width;

    if (beforeHeight !== afterHeight || beforeWidth !== afterWidth) stickyBay();
  });
});

const changeHeading = function (radioButton) {
  const [en, hi] = radioButton.value.split(" ");
  headingTexts[0].innerText = en;
  headingTexts[1].innerText = hi;
};
