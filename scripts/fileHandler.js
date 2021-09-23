const fileUploadElement = document.getElementById("fileUploadElement");

// This code runs when the user selects a new file

fileUploadElement.addEventListener("change", (e) => {
    const file = e.target.files[0];

    //Return if no file selected
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        console.log(`The content of ${file.name} is ${content}`);
        handleData(content);
    }

    reader.onerror = (e) => {
        const error = e.target.error;
        console.error(`Failed to read file ${file.name}`, error);
    }

    reader.readAsText(file);
});

function parseData(content) {
    const obj = JSON.parse(content);
    console.log("Handling content... ", obj);
}