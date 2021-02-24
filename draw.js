let data,xScale,yScale;
let size=[450,450];
let color=d3.scaleOrdinal(d3.schemeCategory10);

scatterplot();

function scatterplot(){
    loadData();
}

function loadData(){
    d3.csv("countries_of_world.csv").then(function(d){
        console.log(d);
        render(d);
    }).catch(function(error){
        console.log(error);
    });
}

function render(d){
    data=d;
    createSVG();
    let x_attr="Birth Rate";
    let y_attr="Death Rate";
    drawAxes(x_attr,y_attr);
    drawDataPoints(x_attr,y_attr);
    beautify();
    bindEvents();
}

function createSVG(){
    d3.select("#main_div")
    .append("svg")
    .attr("width","100%")
    .attr("height","100%")
    .attr("id","main_svg")
}

function drawAxes(x,y){
    /**specify scale**/
    xScale=d3.scaleLinear()
        .domain([0,0.5])
        .range([30,size[0]]);

    yScale=d3.scaleLinear()
        .domain([0,0.25])
        .range([480,80]);

    /**create axis object **/
    var xAxis=d3.axisBottom().scale(xScale).tickFormat(function(d) { return (100*d).toFixed(2) + "%"; }).ticks(5);
    var yAxis=d3.axisLeft().scale(yScale).tickFormat(function(d) { return (100*d).toFixed(2) + "%"; }).tickSize(0,0.25).ticks(6);


    /**create container for axis */
    let x_container=d3.select("#main_svg")
        .append("g")
        .attr("id","xaxis")
        .attr("class","axis")
        .attr("transform","translate(10,"+480+")");
    
    let y_container=d3.select("#main_svg")
        .append("g")
        .attr("id","yaxis")
        .attr("class","axis")
        .attr("transform","translate(40,0)");

    /**Apply axis object to container */
    x_container.call(xAxis)
    y_container.call(yAxis)

    /**Add axis label */
    x_container.append("text")
        .text(x)
        .attr("x",520)
        .attr("y",10)
        .attr("fill","black")
        .style("font-size","14px");

    y_container.append("text")
        .text(y)
        .attr("x",50)
        .attr("y",60)
        .attr("fill","black")
        .style("font-size","14px");
}

function drawDataPoints(x,y){
    /**create container for points */
    let plot = d3.select("#main_svg")
        .append("g")
        .attr("transform","translate(0,30)")
        .attr("id","plots");
    
    /**initiate data binding */
    let plotEnter = plot.selectAll("circle")
        .data(data,function(d){return d["Country"]})
        .enter();

    /**Append circle according to data */
    plotEnter.append("circle")
        .attr("cx",function(d){return xScale(d[x])})
        .attr("cy",function(d){return yScale(d[y])})
        .attr("r",5);
}

function beautify(){
    /**distinguish data points by color */
    d3.selectAll("circle")
        .style("fill",function(d){return color(d["Region"])});

    /**Add Legends */
    d3.select("#main_svg")
        .append("rect")
        .attr("x",500)
        .attr("y",50)
        .attr("width",15)
        .attr("height",15)
        .style("fill",function(d){return color("Asia")})
        .attr("id","Asia")
        .attr("class","legend");

    d3.select("#main_svg")
        .append("text")
        .attr("x",525)
        .attr("y",62)
        .text("Asia")

    d3.select("#main_svg")
        .append("rect")
        .attr("x",500)
        .attr("y",80)
        .attr("width",15)
        .attr("height",15)
        .style("fill",function(d){return color("Europe")})
        .attr("id","Europe")
        .attr("class","legend");

    d3.select("#main_svg")
        .append("text")
        .attr("x",525)
        .attr("y",92)
        .text("Europe");

    d3.select("#main_svg")
        .append("rect")
        .attr("x",500)
        .attr("y",110)
        .attr("width",15)
        .attr("height",15)
        .style("fill",function(d){return color("Africa")})
        .attr("id","Africa")
        .attr("class","legend");

    d3.select("#main_svg")
        .append("text")
        .attr("x",525)
        .attr("y",122)
        .text("Africa");

    d3.select("#main_svg")
        .append("rect")
        .attr("x",500)
        .attr("y",140)
        .attr("width",15)
        .attr("height",15)
        .style("fill",function(d){return color("SouthAmerica")})
        .attr("id","SouthAmerica")
        .attr("class","legend");

    d3.select("#main_svg")
        .append("text")
        .attr("x",525)
        .attr("y",152)
        .text("SouthAmerica");

    d3.select("#main_svg")
        .append("rect")
        .attr("x",500)
        .attr("y",170)
        .attr("width",15)
        .attr("height",15)
        .style("fill",function(d){return color("Oceania")})
        .attr("id","Oceania")
        .attr("class","legend");

    d3.select("#main_svg")
        .append("text")
        .attr("x",525)
        .attr("y",182)
        .text("Oceania");
    
    d3.select("#main_svg")
        .append("rect")
        .attr("x",500)
        .attr("y",200)
        .attr("width",15)
        .attr("height",15)
        .style("fill",function(d){return color("NorthAmerica")})
        .attr("id","NorthAmerica")
        .attr("class","legend");

    d3.select("#main_svg")
        .append("text")
        .attr("x",525)
        .attr("y",212)
        .text("NorthAmerica");
}

function bindEvents(){
/*Display Name on Hover*/
    /**create car name placeholders */
    d3.select("#plots")
        .append("text")
        .attr("id","country_name");

    d3.selectAll("circle")
        .on("mouseover",function(d){
            d3.select(this)
              .attr("r","7")
            
            /*move and set car name tag */
            d3.select("#country_name")
                .text(d['Country'])
                .attr("x",xScale(d['Birth Rate']))
                .attr("y",yScale(d['Death Rate']));
        })
        .on("mouseout",function(d){
            d3.select(this)
              .attr("r","5");
            /**clear car name tag */
            d3.select("#country_name").text("");
        })

/**filter data points when clicking the legends */
    d3.selectAll(".legend")
        .on("mouseover",function(d){
            let region=d3.select(this).attr("id");
            filterDataPoints(region);
            this.style.cursor="pointer";
        })
        .on("mouseout",function(d){
            let t=d3.transition().duration(500);
            d3.selectAll("circle").transition(t).style("opacity",1);
        })
}

function filterDataPoints(region){
    let t=d3.transition().duration(500);
    d3.selectAll("circle")
        .transition(t)
        .style("opacity",function(d){
            if(d["Region"]==region)
                {return 0;}
        })
}