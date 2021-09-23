const fileUploadElement = document.getElementById("fileUploadElement");
const feedbackElement = document.getElementById("feedback");
const tableHolder = document.getElementById("tableHolder");

var colors = [
    '#28AFB0',
    '#9191E9',
    '#30343F',
    '#E5446D',
    '#F8F4E3'
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
    showTable(getLabels(entries), getDatasets(entries));
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
            borderColor: colors[counter],
            backgroundColor: colors[counter] + "33"
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

function showTable(labels, datasets) {
    var table = document.createElement('table');
    table.classList.add("table");

    var thead = document.createElement('thead');

    var topRow = document.createElement('tr');

    var thKey = document.createElement('th');
    thKey.innerText = "Field";
    var thAvg = document.createElement('th');
    thAvg.innerText = "Average";
    var thMax = document.createElement('th');
    thMax.innerText = "Max";
    var thAm = document.createElement('th');
    thAm.innerText = "Amount of Entries"

    thead.appendChild(topRow);
    topRow.appendChild(thKey);
    topRow.appendChild(thAvg);
    topRow.appendChild(thMax);
    topRow.appendChild(thAm);

    table.appendChild(thead);

    //Iterate through all data entries
    console.log(datasets);

    var tbody = document.createElement('tbody');

    datasets.forEach(entry => {
        var tempRow = document.createElement('tr');
        var tempKey = document.createElement('th');
        var tempAverage = document.createElement('td');
        var tempMax = document.createElement('td');
        var tempAmount = document.createElement('td');

        tempKey.innerText = entry.label;

        var max = Number.MIN_SAFE_INTEGER;
        var avg = 0;
        var amount = 0;


        for (let index = 0; index < entry.data.length; index++) {
            const dataEntry = entry.data[index];
            if(typeof(dataEntry) != 'undefined') {
                avg += dataEntry;
                if (max < dataEntry) {
                    max = dataEntry;
                }
                amount++;
            }

        }

        avg /= amount;
        tempAmount.innerText = amount;


        tempMax.innerText = max;
        tempAverage.innerText = avg.toFixed(2);

        tempRow.appendChild(tempKey);
        tempRow.appendChild(tempAverage);
        tempRow.appendChild(tempMax);
        tempRow.appendChild(tempAmount);
        tbody.appendChild(tempRow);
    });

    table.appendChild(tbody);



    //Delete all children
    for (let index = 0; index < tableHolder.children.length; index++) {
        const element = tableHolder.children[index];
        tableHolder.remove(element);

    }

    tableHolder.appendChild(table);
}

