function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `.html("") to clear any existing metadata
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(data) {

    console.log(data);
    var samplem=d3.select("#sample-metadata");
    samplem.html("")

    Object.entries(data).forEach(([key,value])=>{
      samplem.append("h6").text(`${key}: ${value}`)
    })
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data
    var surl = `/samples/${sample}`;
    d3.json(surl).then(function(data) {
      var otu_ids=data.otu_ids
      var sample_values=data.sample_values
      var otu_labels=data.otu_labels
  
  
      var trace1={
        type: "bubble",
        mode:"markers",
        x: otu_ids,
        y:sample_values,
        marker:{
          size:sample_values,
          color:  otu_ids,
        },
        text: otu_labels,  
      }
      var tr1=[trace1]
      Plotly.newPlot("bubble", tr1);

      var trace2={
        type:"pie",
        labels:otu_ids.slice(0,10),
        values:sample_values.slice(0,10),
        hovertext: otu_labels.slice(0,10),
      }
      var tr2=[trace2]
      Plotly.newPlot("pie", tr2);
  })
}
  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
