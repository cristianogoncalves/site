function gera_grafico(arquivo, localid, tipo, height_defined) {


			function type(d) {
			  d.Erro_Medio = +d.Erro_Medio;
		  	  return d;
			};
		

			var margin = {top: 20, right: 20, bottom: 30, left:20},
			    width = 700 - margin.left - margin.right,
			    height = height_defined - margin.top - margin.bottom;

			var x = d3.scale.linear()
			    .range([0, width]);

			var y = d3.scale.ordinal()
			    .rangeRoundBands([0, height], 0.1);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .tickSize(0)
			    .tickPadding(6);

			//d3.select("body").append("h2").text("Avaliação do Modelo - Por " + tipo);

			var div = d3.select("body").append("div").attr("class","grafico");
			var div2 =	div.append("div").attr("id", localid);
    			div2.append("h2").text("Avaliação do Modelo - Por " + tipo);


			var svg = d3.select("div#"+localid).append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			  d3.tsv(arquivo, type, function(error, data) {
			  x.domain(d3.extent(data, function(d) { return d.Erro_Medio; })).nice();
			  y.domain(data.map(function(d) { return d.Time; }));

			  svg.selectAll(".bar")
			      .data(data)
			    .enter().append("rect")
			      .attr("class", function(d) { return "bar bar--" + (d.Erro_Medio < 0 ? "negative" : "positive"); })
			      .attr("x", function(d) { return x(Math.min(0, d.Erro_Medio)); })
			      .attr("y", function(d) { return y(d.Time); })
			      .attr("width", function(d) { return Math.abs(x(d.Erro_Medio) - x(0)); })
			      .attr("height", y.rangeBand());

			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis);

			  svg.append("g")
			      .attr("class", "y axis")
			      .attr("transform", "translate(" + x(0) + ",0)")
			      .call(yAxis);
			});

		};
