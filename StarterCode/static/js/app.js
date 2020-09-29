//plot bar and bubble chart
function plotData(id) {
    d3.json("./static/js/samples.json").then((data) => {

        //grab sample data
        var sample_data = data.samples.filter(s => s.id.toString() === id)[0];

        //grab top 10 labels
        var labels = sample_data.otu_labels.slice(0, 10);

        //grab top 10 values
        var sample_values = sample_data.sample_values.slice(0, 10).reverse();

        //grab top 10 ids (decsending)
        var top_OTU = (sample_data.otu_ids.slice(0, 10)).reverse();
        var OTU_id = top_OTU.map(x => "OTU " + x);

        //data for bar chart
        var bar_data = [{
            x: sample_values,
            y: OTU_id,
            text: labels,
            type: "bar",
            orientation: "h",
        }];

        //layout for bar chart
        var bar_layout = { yaxis: { tickmode: "linear" } };

        //plot bar chart
        Plotly.newPlot("bar", bar_data, bar_layout);

        //data for bubble chart
        var bub_data = [{
            x: sample_data.otu_ids,
            y: sample_data.sample_values,
            mode: "markers",
            marker: {
                size: sample_data.sample_values,
                color: sample_data.otu_ids
            },
            text: sample_data.otu_labels
        }];

        //layout for bubble chart
        var bub_layout = { xaxis: { title: "OTU ID" } };

        //plot bubble chart
        Plotly.newPlot("bubble", bub_data, bub_layout);
    });
}
//display meta data
function writeMetaData(id) {
    d3.json("./static/js/samples.json").then((data) => {

        //grab meta data
        var metadata = data.metadata.filter(meta => meta.id.toString() === id)[0];

        //find div to display data and clear it
        var demos = d3.select("#demo-display");
        demos.html("");

        //write key-value pairs
        Object.entries(metadata).forEach((key) => {
            //uppercase first letter of key
            demos.append("h6").text(key[0].charAt(0).toUpperCase() + key[0].slice(1) + ": " + key[1]);
        });
    });
}
//change event function
function selectionChanged(id) {
    plotData(id);
    writeMetaData(id);
}
//init function
function init() {

    //find dropdown
    var dropdown = d3.select("#subject-id");

    //grab sample data
    d3.json("./static/js/samples.json").then((data) => {
        
        //add subject ids to dropdown
        data.names.forEach((x) => {
            dropdown.append("option").text(x).property("value");
        });

        //plot data
        plotData(data.names[0]);

        //write meta data
        writeMetaData(data.names[0]);
    });
}
init();