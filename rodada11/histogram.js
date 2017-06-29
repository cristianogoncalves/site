
var histogram = function (arquivo, Jogador, cartoleta) {

    var def_width = 300;
    var def_height = 300;

    console.log(Jogador);
    var div = d3.select("body").append("div").attr("class","graf").attr("id", Jogador);
    div.insert("div").attr("class","titulo").text(Jogador + " -  C$ " + d3.format(".2f")(cartoleta));

    var svg = div.append("svg").attr("width",def_width).attr("height",def_height),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = def_width - margin.left - margin.right,
        height = def_height - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]),
        x2 = d3.scaleLinear().rangeRound([0, width]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   // old
   d3.tsv(arquivo, function(d) {
      d.frequencia = +d.frequencia;
      d.pontuacao = +d.pontuacao;
      d.media = +d.media;
      return d;
    }, function(error, data) {
      if (error) throw error;
    
  
      x.domain(data.map(function(d) { return d.pontuacao; }));
      x2.domain([d3.min(data,function(d) { return d.pontuacao; }), d3.max(data,function(d) { return d.pontuacao; })]);
      y.domain([0, d3.max(data, function(d) { return d.frequencia; })+0.01]);
      media = d3.mean(data,function(d) { return +d.media});
      pto_y = d3.max(data,function(d) { return +d.frequencia})+0.01;

      xmin = d3.min(data, function(d) {return +d.pontuacao});
      xmax = d3.max(data,function(d) { return +d.pontuacao});
    
   
      while (xmin%5) {xmin += 1};  // transform mininium multiple of 5
      var xAxis = d3.axisBottom(x).tickValues(d3.range(xmin,xmax,5));

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .attr("transform", "rotate(0)")
          .attr('dx', "0px")
          .attr('dy','0.65em')
          .attr("text-anchor", "middle");
          
       g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(10, "%"))
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0px")
          .attr("text-anchor", "end")
          .text("Frequency");

       
      g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.pontuacao); })
          .attr("y", function(d) { return y(d.frequencia); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d.frequencia); })
          .on("mouseover", function() { tooltip.style("display", null); })
          .on("mouseout", function() { tooltip.style("display", "none"); })
          .on("mousemove", function(d) { var xPosition = d3.mouse(this)[0] - 15;
           var yPosition = d3.mouse(this)[1] - 25;
              tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").html(d.pontuacao + " : " + d3.format(",.1%")(d.frequencia));
            });
        

        g.append("text")
          .attr('x',x2(media)+margin.left-35)
          .attr('y',y(pto_y)+margin.top-15)
          .attr("dy", ".35em")
          .text(d3.format(".2f")(media))
          .style("font-size", "12px")
          .attr("font-weight", "italic")
          .attr("font-weight", "bold")
          .attr("fill", "black")
          .style("opacity", 0.8);

        svg.append("line")
          .attr("x1", x2(media)+margin.left)  //<<== change your code here    x(media)+margin.left+3
          .attr("y1", y(pto_y)+margin.top)
          .attr("x2", x2(media)+margin.left)  //<<== and here
          .attr("y2", y(0)+margin.top)
          .style("stroke-width", 3)
          .style("stroke", "red")
          .style("fill", "none");
          //console.log(x(media));
      
        var tooltip = svg.append("g")
          .attr("class", "tooltip")
          .style("display", "none");
        
        tooltip.append("rect")
          .attr("width", 60)
          .attr("height", 20)
          .attr("fill", "white")
          .style("opacity", 0.9);

        tooltip.append("text")
          .attr("x", 15)
          .attr("dx", "1.2em")
          .attr("dy", "1.2em")
          .style("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold");
    
    });
 
};