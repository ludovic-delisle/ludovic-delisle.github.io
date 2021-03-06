function create_svg_txt(w, h, color){
    let text_area = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h/3.8)
        .attr("id", "text_area_circle")
        .style("background-color", color)

}

function add_text_desc(col1, col2){
    let svg = d3.select("#text_area_circle")

    svg.append("text")
        .style("font-size", window.innerWidth/40)
        .attr("font-family", "font-family: \"Montserrat\", -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;")
        .text("Welcome to the battle arena!")
        .attr("x", window.innerWidth/100)
        .attr("y", window.innerWidth/40)
        .style("fill", col1)

    svg.append("text")
        .style("font-size", window.innerWidth/60)
        .attr("font-family", "font-family: \"Montserrat\", -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;")
        .text("With this visualization, explore the whole Pokémon population generation-wise. Choose the generation")
        .attr("x", window.innerWidth/100)
        .attr("y", 2*window.innerWidth/40)
        .style("fill", col2)

    svg.append("text")
        .style("font-size", window.innerWidth/60)
        .attr("font-family", "font-family: \"Montserrat\", -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;")
        .text("you're interested in with the left drop down menu and then sort out the Pokémons of that generation")
        .attr("x", window.innerWidth/100)
        .attr("y", 2*window.innerWidth/40+window.innerWidth/50)
        .style("fill", col2)

    svg.append("text")
        .style("font-size", window.innerWidth/60)
        .attr("font-family", "font-family: \"Montserrat\", -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;")
        .text("according to a certain feature chosen with the right drop down menu. Then you can put your mouse over")
        .attr("x", window.innerWidth/100)
        .attr("y", 2*window.innerWidth/40+2*window.innerWidth/50)
        .style("fill", col2)

    svg.append("text")
        .style("font-size", window.innerWidth/60)
        .attr("font-family", "font-family: \"Montserrat\", -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;")
        .text("the dots around the Pokéball to display an ID card of the corresponding Pokémon which contains a")
        .attr("x", window.innerWidth/100)
        .attr("y", 2*window.innerWidth/40+3*window.innerWidth/50)
        .style("fill", col2)

    svg.append("text")
        .style("font-size", window.innerWidth/60)
        .attr("font-family", "font-family: \"Montserrat\", -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;")
        .text("picture and a spider chart with its stats. When you find a Pokémon to your liking and want more informations")
        .attr("x", window.innerWidth/100)
        .attr("y", 2*window.innerWidth/40+4*window.innerWidth/50)
        .style("fill", col2)

    svg.append("text")
        .style("font-size", window.innerWidth/60)
        .attr("font-family", "font-family: \"Montserrat\", -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;")
        .text("on it or if you are curious about how strong a certain Pokémon is, you can click on the dot: a more")
        .attr("x", window.innerWidth/100)
        .attr("y", 2*window.innerWidth/40+5*window.innerWidth/50)
        .style("fill", col2)

    svg.append("text")
        .style("font-size", window.innerWidth/60)
        .attr("font-family", "font-family: \"Montserrat\", -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;")
        .text("complete information sheet will appear and the outcome of every battles will be displayed. Upon clicking,")
        .attr("x", window.innerWidth/100)
        .attr("y", 2*window.innerWidth/40+6*window.innerWidth/50)
        .style("fill", col2)

    svg.append("text")
        .style("font-size", window.innerWidth/60)
        .attr("font-family", "font-family: \"Montserrat\", -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;")
        .text("the in-game cry of the Pokémon will be played. To turn that sound on and off, click on the sound icon.")
        .attr("x", window.innerWidth/100)
        .attr("y", 2*window.innerWidth/40+7*window.innerWidth/50)
        .style("fill", col2)
}