const fileUploadElement = document.getElementById("fileUploadElement");
const feedbackElement = document.getElementById("feedback");

var colors = [
    '#28AFB0',
    '#9191E9',
    '#30343F'
]

// This code runs when the user selects a new file

fileUploadElement.addEventListener("change", (e) => {
    const file = e.target.files[0];

    //Return if no file selected
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        parseData(content);
    }

    reader.onerror = (e) => {
        const error = e.target.error;
        console.error(`Failed to read file ${file.name}`, error);
    }

    reader.readAsText(file);
});

function parseData(content) {
    const entries = JSON.parse(content)['entries'];

    if (!entries) {
        feedbackElement.innerText = "Could not read file";
        return;
    }

    feedbackElement.innerText = "Read file with " + entries.length + " entries";

    showGraph(getLabels(entries), getDatasets(entries));
}

function getLabels(entries) {
    var labels = [];
    for (let index = 0; index < entries.length; index++) {
        const entry = entries[index];
        var date = new Date(entry['date']);
        labels.push(date.toLocaleString());
    }
    return labels;
}

function getDatasets(entries) {
    var sets = [];
    var keys = getKeysOfNumericTrackers(entries);

    var counter = 0;

    keys.forEach(key => {
        var temp = {
            label: key,
            data: getData(key, entries),
            borderColor: colors[counter]
        }
        sets.push(temp);
        counter++;
    });

    return sets;
}

function getData(key, entries) {
    var result = [];
    for (let index = 0; index < entries.length; index++) {
        const element = entries[index];
        result.push(element['fields'][key]);
    }
    return result;
}

function getKeysOfNumericTrackers(entries) {
    console.log("Reading keys...")
    var set = new Set();

    for (let index = 0; index < entries.length; index++) {
        const entry = entries[index];

        for (const key in entry['fields']) {
            if (Object.hasOwnProperty.call(entry['fields'], key)) {
                const element = entry['fields'][key];
                if (typeof (element) == 'number') {
                    set.add(key);
                }
            }
        }
    }
    return set;
}

function showGraph(labels, datasets) {
    const data = {
        labels: labels,
        datasets: datasets
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Your Stat Track Data'
            }
        }
    };

    new Chart(
        document.getElementById("graph"),
        config
    )
}

