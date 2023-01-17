
window.addEventListener("load", function () {
const searchTermInput = document.getElementById("search-term");
const replacementTermInput = document.getElementById("replacement-term");
const filesInput = document.getElementById("files");
const modifiedSentencesContainer = document.getElementById("modified-sentences");

const escapeHtml = unsafe =>
  unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const searchAndReplace = (searchTerm, replacementTerm, files) => {
  modifiedSentencesContainer.innerHTML = "";
  const escapedSearchTerm = escapeHtml(searchTerm.toLowerCase());
  const escapedReplacementTerm = escapeHtml(replacementTerm);
  const searchRegex = new RegExp(escapedSearchTerm, "g");
  const fragment = document.createDocumentFragment();
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = event => {
      const contents = event.target.result;
      const sentences = contents.split("\n");
      let line = 0;
      for (let sentence of sentences) {
        line++;
        sentence = escapeHtml(sentence).toLowerCase();
        if (searchRegex.test(sentence) && escapedSearchTerm !== "") {
          const modifiedSentence = sentence.replace(
            searchRegex,
            `<span class='delete'>${escapedSearchTerm}</span><span class='replacement'>${escapedReplacementTerm}</span>`
          );
          const div = document.createElement("div");
          div.innerHTML = `[${file.name}:${line}] ${modifiedSentence}`;
          fragment.appendChild(div);
        }
      }
      modifiedSentencesContainer.appendChild(fragment);
    };
    reader.readAsText(file);
  }
};

const updateModifiedSentences = () => {
  const searchTerm = searchTermInput.value;
  const replacementTerm = replacementTermInput.value;
  const files = Array.from(filesInput.files);
  searchAndReplace(searchTerm, replacementTerm, files);
};

searchTermInput.addEventListener("input", updateModifiedSentences);
replacementTermInput.addEventListener("input", updateModifiedSentences);
filesInput.addEventListener("change", updateModifiedSentences);
});
