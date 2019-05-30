function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

    d3.json(`/metadata/${sample}`).then(function(response) {
          
    // Use d3 to select the panel with id of `#sample-metadata`  
    // Use `.html("") to clear any existing metadata
      const metadata = d3.select('#sample-metadata').html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(response).forEach(function(key, value) {
        var string = key
        string = string.split(',')
        metadata.append('p')
        .html(`<strong>${string[0]}: </strong> ${string[1]}`);
      });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
      
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(response) {
        // @TODO: Build a Bubble Chart using the sample data
    data = [{
      x: response.otu_ids,
      y: response.sample_values,
      'type': 'scatter',
      'mode' : 'markers',
      'marker' : {
        'colorscale' : 'Picnic',
        'size'  : response.sample_values,
        'color' : response.otu_ids
      }
    }]
    var layout = {
      title: 'Belly Button Biodiversity',
      xaxis : {
        title : 'otu_id'
      },
      yaxis : {
        title : 'sample value'
      }      
    };

  //OTU values by sample_values 
    Plotly.newPlot('bubble', data, layout)
  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var topTenIDs = response.otu_ids.sort(d3.descending).slice(0,10);
    var topTenSamples = response.sample_values.sort(d3.descending).slice(0,10);
    
    var data2 = [{
        labels: topTenIDs,
        values: topTenSamples,
        'type': 'pie' 
    }];
    
    var layout2 = {
      title: 'Belly Button Biodiversity: Top 10 Samples',
          }
    Plotly.newPlot('pie', data2, layout)
})
}

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
