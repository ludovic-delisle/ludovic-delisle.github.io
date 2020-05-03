function create_svg(w, h, color){
    let canvas = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "main_svg")
        .style("background-color", color)

}

function add_chart(svg_name, color, csv_file, gen, feature){
    let size= window.innerWidth/3
    let posx=  window.innerWidth/2
    let posy=  window.innerHeight/2
    let diameter = size/2
    d3.csv(csv_file).then(function(d){
        let gen_pkm = get_gen(d, gen)
        let feat_and_pkm = get_feat(gen_pkm, feature)
        features = feat_and_pkm[0]
        pkm=feat_and_pkm[1]
        let names = pkm.map(function(k){
            return{
                name: k.name
            }
        });
        color=get_color(d[0], feature)
        let nb_angles = names.length
        create_pokeball(diameter, posx, posy)
        add_select_gen(posx, posy, gen, feature)
        add_select_feature(posx, posy, gen, feature)
        add_names_and_dots(names , nb_angles,diameter, posx, posy, pkm, feature)

    })

}
function arcTween(newAngle, arc) {
    return function(d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);
        return function(t) {
            d.endAngle = interpolate(t);
            return arc(d);
        }
    }
}

function create_pokeball(size, posx, posy){


    let base_circle = d3.select("#main_svg")
    const opa=0.5

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(size-8)
        .startAngle(-Math.PI/2);

    let bottom = base_circle.append("path")
        .attr("transform", "translate("+[posx, posy]+") rotate(180)")
        .attr("fill", "white")
        .attr("id", "base_circle2")
        .attr("class", "pokeball")
        .attr('opacity', opa)
        .datum({endAngle: -Math.PI/2})
        .attr("d", arc)

    bottom.transition()
        .duration(900)
        .attrTween("d", arcTween(Math.PI/2, arc));

    let arc2 = d3.arc()
        .innerRadius(0)
        .outerRadius(size-8)
        .startAngle(Math.PI/2);

    let top = base_circle.append("path")
        .attr("transform", "translate("+[posx, posy]+") rotate(180)")
        .attr("fill", "red")
        .attr("id", "base_circle2")
        .attr("class", "pokeball")
        .attr('opacity', opa)
        .datum({endAngle: Math.PI/2})
        .attr("d", arc2)

    top.transition()
        .duration(900)
        .attrTween("d", arcTween(3*Math.PI/2, arc2))


    let black_center=base_circle.append("circle")
        .attr("cx", posx)
        .attr("cy", posy)
        .attr("class", "pokeball")
        .attr("r", 0)
        .attr("fill", "black")

    black_center.transition()
        .attr("r", size/5)
        .duration(500)
        .delay(700)

    let black_line=base_circle.append("rect")
        .attr("x", posx)
        .attr("y", posy-size/20)
        .attr("width", 0)
        .attr("height", size/10)
        .attr("class", "pokeball")
        .attr("fill", "black")

    black_line.transition()
        .attr("x", posx-size+8)
        .attr("width", 2*size-16)
        .duration(500)
        .delay(700)


    let white_center=base_circle.append("circle")
        .attr("cx", posx)
        .attr("cy", posy)
        .attr("class", "pokeball")
        .attr("r", 0)
        .attr("fill", "white")

    white_center.transition()
        .attr("r", size/10)
        .duration(500)
        .delay(700)

}

function add_names_and_dots(names, nb_angles, size, posx, posy, pkm, feature){
    let base_circle = d3.select("#main_svg")
    for(let i = 0; i<nb_angles; i++){
        let nom = names[i].name
        let pokemon= pkm[i]
        let txt = base_circle.append("text")
            .text(nom)
            .attr("id", "labels_radar_"+pkm[i].pokedex_number)
            .attr("class", "labels_radar")
            .style("fill", "maroon")
        txt.attr("alignment-baseline", "middle")
        let width = txt.node().getComputedTextLength()
        let a = i*2*Math.PI/nb_angles
        let transx = posx+(size+5)*Math.cos(a)
        let transy = posy+(size+5)*Math.sin(a)
        let radius= 3*size/nb_angles
        let color ="white"

        get_color(pokemon, feature).then(function(color){
            let id = pokemon.pokedex_number
            let gen = pokemon.generation
            let dot = base_circle.append("circle")
                .attr("r", radius)
                .attr("cx", transx-(5+radius)*Math.cos(a))
                .attr("cy", transy-(5+radius)*Math.sin(a))
                .attr("fill", color)
                .attr("class", "color_circle")
                .attr("id", "circle_"+id)
                .attr("olol_x", posx)
                .attr("olol_y", posy)
                .on("mouseover", function(){
                    create_ID_card(posx, posy, size, a, pokemon)
                    })
                .on("click", function(){
                    d3.selectAll(".info_sheet").remove()
                    create_info_sheet(pokemon, gen, feature)
                    move_color_circle_and_names( id, pkm, size, radius, posx, posy)
                    })
                .on("mouseout", function(){
                    d3.selectAll(".id_card").remove()
                })
        })


        let rot= 180*a/Math.PI
        if((rot>=90) && (rot < 270)){
            txt.transition()
                .attr("text-anchor", "end")
                .duration(300)

            rot = rot+180
        }
        else{
            txt.transition()
                .attr("text-anchor", "start")
                .duration(300)

        }
        txt.attr("transform", "translate("+transx+", "+transy+") rotate("+rot+")")
    }

}

function move_color_circle_and_names(id, pkm_list, radius, rad, posx, posy){
    duration = 3000
    looser_x= posx - window.innerWidth/3.25
    looser_y=posy
    winner_x=posx + window.innerWidth/3.25
    winner_y=posy
    let ease = d3.easeExp


    d3.csv("data/pvpoke_1v1_cp1500_2019.csv").then(function(d){

        d3.selection.prototype.moveToFront = function() {
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };

        let chosen = d[id-1]
        let loosers= []
        let winners= []
        let len = pkm_list.length

        for(let i =0; i<len; i++){
            poke_list_id = pkm_list[i].pokedex_number
            if(chosen[poke_list_id]==1) {
                loosers.push(poke_list_id)
            }
            else if(chosen[poke_list_id]==-1){
                winners.push(poke_list_id)
            }

        }
        let rad_win = radius*winners.length/len
        let rad_loose = radius*loosers.length/len
        d3.selectAll(".pokeball").remove()
        create_pokeball(rad_win+rad ,winner_x, winner_y)
        create_pokeball(rad_loose+rad ,looser_x, looser_y)

        for(let j =0; j<winners.length; j++) {
            let i = winners[j]
            let angle = 2*Math.PI*j/winners.length
            let dot = d3.select("#circle_"+i).moveToFront()
                .attr("olol_x", winner_x)
                .attr("olol_y", winner_y)

            let dot_x = winner_x+rad_win*Math.cos(angle)
            let dot_y = winner_y+rad_win*Math.sin(angle)
            dot.transition()
                .attr('cy', function() {
                    return dot_y

                })
                .attr('cx', function() {
                    return dot_x
                })
                .attr('r', function() {
                    return rad
                })

                .duration(function(d, j) { return duration*(j+1); })
                .ease(ease)

            let name_x = winner_x+(rad_win+rad*1.3)*Math.cos(angle)
            let name_y = winner_y+(rad_win+rad*1.3)*Math.sin(angle)
            let nom = d3.select("#labels_radar_"+i)
            let rot= 180*angle/Math.PI
            if((rot>=90) && (rot < 270)){
                nom.transition()
                    .attr("text-anchor", "end")
                    .duration(duration)
                rot = rot+180
            }
            else{
                nom.transition()
                    .attr("text-anchor", "start")
                    .duration(duration)
            }

            nom.transition()
                .attr("transform", "translate("+name_x+","+name_y+") rotate("+rot+")")
                .duration(duration)


        }


        for(let j =0; j<loosers.length; j++) {
            let i = loosers[j]
            let angle = 2*Math.PI*j/loosers.length
            let dot = d3.select("#circle_"+i).moveToFront()
                .attr("olol_x", looser_x)
                .attr("olol_y", looser_y)

            dot.transition()
                .attr('cy', function() {
                    return looser_y+rad_loose*Math.sin(angle)

                })
                .attr('cx', function() {
                    return looser_x+rad_loose*Math.cos(angle)
                })
                .attr('r', function() {
                    return rad
                })

                .duration(function(d, j) { return duration*(j+1); })
                .ease(ease)

            let name_x = looser_x+(rad_loose+rad*1.3)*Math.cos(angle)
            let name_y = looser_y+(rad_loose+rad*1.3)*Math.sin(angle)
            let nom = d3.select("#labels_radar_"+i)
            let rot= 180*angle/Math.PI
            if((rot>=90) && (rot < 270)){
                nom.transition()
                    .attr("text-anchor", "end")
                    .duration(duration)
                rot = rot+180
            }
            else{
                nom.transition()
                    .attr("text-anchor", "start")
                    .duration(duration)
            }
            nom.transition()
                .attr("transform", "translate("+name_x+","+name_y+") rotate("+rot+")")
                .duration(duration)



        }
        let dot = d3.select("#circle_"+id)
            .attr("olol_x", posx)
            .attr("olol_y", posy)
        dot.transition()
            .attr('cy', function() {
                return posy

            })
            .attr('cx', function() {
                return posx
            })
            .attr('r', function() {
                return 0
            })
            .duration(function(d, j) { return duration*(j+1); })
            .ease(ease)

        let nom = d3.select("#labels_radar_"+id)
        posy_txt = posy/2

        nom.transition()
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+posx+","+posy_txt+") rotate(0)")
            .duration(duration)

    });



}

function get_color(pkm, feature){
    let color = d3.csv("data/dot_colors.csv").then(function(d){
        let feat=pkm[feature]
        console.log(feat)
        let index = d.findIndex((k)=>{ return k.feature === feat})
        return d[index].color
    });
    return color
}

function get_gen(data, gen){
    data_gen=[]
    for(let i=0; i<data.length; i++){
        if(data[i].generation==gen+1){
            data_gen.push(data[i])
        }
    }
    return data_gen
}

function get_feat(data, feature){
    let features = []
    for(let i=0; i<data.length; i++){
        let new_ft=true;
        for(let j=0; j<features.length; j++){
            if(data[i][feature]==features[j]){
                new_ft=false;
            }
        }
        if(new_ft){
            features.push(data[i][feature])
        }
    }
    let ordered_pkm = []
    for(let j=0; j<features.length; j++) {
        for (let i = 0; i < data.length; i++) {
            if(data[i][feature]==features[j]){
                ordered_pkm.push(data[i])
            }
        }
    }
    return [features, ordered_pkm]
}

function add_select_gen(posx, posy, gen, feature){
    let selection=["generation 1", "generation 2", "generation 3", "generation 4", "generation 5", "generation 6", "generation 7"]
    var l=4;
    for(i=0;i<selection.length;i++){if(l<selection[i].length)l=selection[i].length};
    var width = 400, height = 600;
    l=l*10;
    let main_svg = d3.select("#main_svg")
    svg=main_svg.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("class","dropdown");

    let select = svg.append("g")
        .attr("class", "select")

    select.append("rect")
        .attr("x", 10)
        .attr("y",  10 )
        .attr("width", l)
        .attr("height", 30)
        .attr("class","dropdown");

    select.append("text")
        .attr("x", 15)
        .attr("y",30 )
        .attr("id","mydropdown")
        .text( selection[gen]);
    var options = svg.selectAll(".myBars")
        .data(selection)
        .enter()
        .append("g");
    options.attr("class", "option").on("click", function() {
        document.getElementById("mydropdown").innerHTML=this.getElementsByTagName("text")[0].innerHTML;
        d3.event.stopPropagation();
        let index=0
        for(let i=0; i<selection.length;i++){
            if(this.getElementsByTagName("text")[0].innerHTML=== selection[i]){
                index = i
                break;
            }
        }
        update_chart(index, feature)

    });
    options.append("rect")
        .attr("x", 10)
        .attr("y", function(d,i){ return 40 + i*30})
        .attr("width", l)
        .attr("height", 30)
        .attr("class","dropdown");

    options.append("text")
        .attr("x", function(d){ return 15})
        .attr("y", function(d,i){ return 60 + i*30})
        .text(function(d){ return d});


}

function add_select_feature(gen, feature){
    let selection=["Type", "Legendary", "Body-Style", "Color"]
    if(gen==6){
        selection =["Type", "Legendary"]
    }
    let features=selection
    let l = "legendary".length
    var width = 4000, height = 3000;
    l=l*10;
    px=window.innerWidth-l-15
    let main_svg = d3.select("#main_svg")
    svg=main_svg.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("class","dropdown");

    let select = svg.append("g")
        .attr("class", "select")

    select.append("rect")
        .attr("x", px)
        .attr("y",  10 )
        .attr("width", l)
        .attr("height", 30)
        .attr("class","dropdown");
    select.append("text")
        .attr("x", px + 0.1*l)
        .attr("y",30 )
        .attr("id","mydropdown")
        .text( feature);
    var options = svg.selectAll(".myBars")
        .data(selection)
        .enter()
        .append("g");
    options.attr("class", "option").on("click", function() {
        document.getElementById("mydropdown").innerHTML=this.getElementsByTagName("text")[0].innerHTML;
        d3.event.stopPropagation();
        let ft="bla"
        for(let i=0; i<selection.length;i++){
            if(this.getElementsByTagName("text")[0].innerHTML=== selection[i]) {
                ft = features[i]
                break;
            }
        }
        update_chart(gen, ft)

    });
    options.append("rect")
        .attr("x", px)
        .attr("y", function(d,i){ return 40 + i*30})
        .attr("width", l)
        .attr("height", 30)
        .attr("class","dropdown");

    options.append("text")
        .attr("x", function(d){ return px+0.1*l})
        .attr("y", function(d,i){ return 60 + i*30})
        .text(function(d){ return d});


}

function update_chart(index, feature){
    d3.selectAll(".pokeball").remove()
    d3.select("#data_radar").remove()
    d3.selectAll(".labels_radar").remove()
    d3.select("#radar_base").remove()
    d3.selectAll(".color_circle").remove()
    d3.selectAll(".info_sheet").remove()
    d3.selectAll(".select").remove()
    d3.selectAll(".dropdown").remove()
    let csv_file="data/data_for_circle_chart.csv"
    add_chart("main_svg", "beige", csv_file, index, feature)
}

function get_angle(x, y, cx, cy){
    let dx = x-cx
    let dy = y-cy
    let a =0
    if(dx==0){
        a = Math.PI/2
        if(Math.sign(dy)<0){
            a=3*Math.PI/2
        }
    }
    else if (Math.sign(dx)==1){
        a=Math.atan(dy/dx)
        if(Math.sign(dy)<0){
            a=2*Math.PI+Math.atan(dy/dx)
        }
    }
    else {
        a=Math.atan(dy/dx)+Math.PI
    }
    return a
}

function create_ID_card(posx, posy, size, angle, pkm){

    let pkm_nbr=pkm["pokedex_number"]
    poke_circle = d3.select("#circle_"+pkm_nbr)


    let cx=parseInt(poke_circle.attr("cx"))
    let cy=parseInt(poke_circle.attr("cy"))
    let center_x=parseInt(poke_circle.attr("olol_x"))
    let center_y=parseInt(poke_circle.attr("olol_y"))

    let radius = Math.sqrt((cx-center_x)*(cx-center_x) + ((cy-center_y)*(cy-center_y)))
    let a=get_angle(cx, cy, center_x, center_y)
    let rect_size = radius*1.5
    let px =center_x
    let py =center_y
    if(radius<180){
        rect_size = 300
        px =center_x
        py =center_y-190-radius
    }



    let labels = ["hp", "def", "atk", "sp_def", "sp_atk", "spd"]
    let stat=[]
    for(let i = 0 ; i< labels.length; i++){
        let d = pkm[labels[i]]
        stat[i] = d
    }
    let max_stat= Math.max(...stat)
    let nb_sep = 1
    let col = "#ffa600"
    if (max_stat > 50 && max_stat <=100){
        nb_sep = 2
        col= "#ff6361"
    }
    else if (max_stat >100 && max_stat <=150){
        nb_sep = 3
        col= "#bc5090"
    }
    else if (max_stat >150 && max_stat <=200){
        nb_sep = 4
        col= "#58508d"
    }
    else if (max_stat >200 ){
        nb_sep = 5
        col= "#003f5c"
    }

    let id_card = d3.select("#main_svg")
    id_card.append("line")
        .attr("x1", cx)
        .attr("x2", px)
        .attr("y1", cy)
        .attr("y2", py)
        .attr("class", "id_card")
        .attr("opacity", 0.6)
        .style("stroke", "red")
        .style("stroke-width", 2)

    id_card.append("rect")
        .attr("width", 1.05*rect_size)
        .attr("height", rect_size*0.5)
        .attr("x", px-rect_size*0.525)
        .attr("y", py-rect_size/4.2)
        .attr("fill", "white")
        .attr("class", "id_card")
        .attr("stroke-width", 2)
        .attr("stroke", "black")

    let name = pkm["name"]
    let name_url = name.charAt(0).toLowerCase()+name.slice(1)
    id_card.append("rect")
        .attr("width", 1.05*rect_size)
        .attr("height", rect_size/8)
        .attr("x", px-rect_size*0.525)
        .attr("y", py-rect_size*0.363)
        .attr("fill", col)
        .attr("opacity", 0.5)
        .attr("class", "id_card")
        .attr("stroke-width", 2)
        .attr("stroke", "black")

    id_card.append("text")
        .attr("x", px-rect_size/2+5)
        .attr("y", py-rect_size*0.3)
        .style("fill", "black")
        .attr("class", "id_card")
        .text(name)

    id_card.append("image")
        .attr("xlink:href", "https://img.pokemondb.net/artwork/large/"+name_url+".jpg")
        .attr("x", px-rect_size/1.95)
        .attr("y", py-rect_size*0.2)
        .attr("width", rect_size/2.2)
        .attr("height", rect_size/2.2)
        .attr("class", "id_card")



    create_radar(pkm, 6, rect_size*0.2, px+0.25*rect_size, py, nb_sep, col)
    add_data_radar(pkm, 6, rect_size*0.2, px+0.25*rect_size, py, nb_sep, col)

}

function create_radar(data, nb_angles, size, posx, posy, nb_sep, col){
    let labels = ["hp", "def", "atk", "sp_def", "sp_atk", "spd"]
    let stat=[]
    for(let i = 0 ; i< labels.length; i++){
        let d = data[labels[i]]
        stat[i] = d
    }

    let max_stat= Math.max(...stat)
    let outer_circle = 50*nb_sep

    let base_circle = d3.select("svg")
    let angles=[]
    let position = []
    for(let k =nb_sep; k>0; k--){
        for(let i = 0; i<=nb_angles; i++){
            let a = i*2*Math.PI/nb_angles + 3*(Math.PI)/2
            angles[i]=a
            let px=posx + size/nb_sep*k*Math.cos(a)
            let py=posy + size/nb_sep*k*Math.sin(a)
            position[i]={"x": px, "y": py}
        }
        let linefct = d3.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })

        base_circle.append("path")
            .attr("d", linefct(position))
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("fill", "gainsboro")
            .attr("id", "radar_base")
            .attr("class", "id_card")
    }
    let transx = posx+0.95*size
    base_circle.append("text")
        .text(outer_circle)
        .attr("transform", "translate("+transx+", "+posy+") rotate(90)")
        .attr("text-anchor", "middle")
        .attr("class", "id_card")
        .style("fill", col)


}

function add_data_radar(data, nb_angles, size, posx, posy, nb_sep, col){
    let labels = ["hp", "def", "atk", "sp_def", "sp_atk", "spd"]
    let stat=[]
    for(let i = 0 ; i< labels.length; i++){
        let d = data[labels[i]]
        stat[i] = d
    }

    let max_stat= Math.max(...stat)
    let outer_circle = 50*nb_sep
    let base_circle = d3.select("svg")
    let angles=[]
    let position = []

    for(let i = 0; i<nb_angles; i++){
        let a = i*2*Math.PI/nb_angles + 3*(Math.PI)/2
        angles[i]=a
        px=posx + stat[i]/outer_circle*size*Math.cos(a)
        py=posy + stat[i]/outer_circle*size*Math.sin(a)
        position[i]={"x": px, "y": py}
        transx=posx +(size+(labels[i].length)*6)*Math.cos(a) - ((labels[i].length)*3)
        transy = posy+(size+5)*Math.sin(a)+4
        rot= 90*Math.cos(a)
        base_circle.append("text")
            .attr("x", transx)
            .attr("y", transy)
            .text(labels[i])
            .attr("class", "id_card")
            .style("fill", "maroon")

    }
    let linefct = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })

    base_circle.append("path")
        .attr("d", linefct(position))
        .attr("stroke", "none")
        .attr("stroke-width", 2)
        .attr("fill", col)
        .attr("opacity", 0.9)
        .attr("class", "id_card")



}

function create_info_sheet(pkm, index, feature){

    let width = window.innerWidth/4
    let height = window.innerHeight/1.5

    let info_sheet = d3.select("#main_svg")


    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };

    get_color(pkm, feature).then(function(color){

        let rect=info_sheet.append("rect")
            .attr("x", (window.innerWidth-width)/2)
            .attr("y", (window.innerHeight-height)/2 )
            .attr("width", width)
            .attr("height", height)
            .attr("fill", color)
            .attr("opacity", 0.5)
            .attr("class", "info_sheet")
            .moveToBack()


        let color_band= info_sheet.append("rect")
            .attr("x", (window.innerWidth-width)/2)
            .attr("y", (window.innerHeight-height)/2 )
            .attr("width", width)
            .attr("height", height/15)
            .attr("fill", color)
            .attr("opacity", 0.5)
            .attr("class", "info_sheet")
            .moveToBack()

    })

    let cross_box=info_sheet.append("rect")
        .attr("x", (window.innerWidth-width)/2+width-width/20)
        .attr("y", (window.innerHeight-height)/2 )
        .attr("width", width/20)
        .attr("height", width/20)
        .attr("fill", "black")
        .attr("class", "info_sheet")

    let line_1=info_sheet.append("line")
        .attr("x1", (window.innerWidth-width)/2+width-width/20)
        .attr("y1", (window.innerHeight-height)/2 )
        .attr("x2", (window.innerWidth-width)/2+width)
        .attr("y2", (window.innerHeight-height)/2+width/20 )
        .style("stroke", "white")
        .style("stroke-width", 2)
        .attr("class", "info_sheet")

    let line_2=info_sheet.append("line")
        .attr("x1", (window.innerWidth-width)/2+width-width/20)
        .attr("y1", (window.innerHeight-height)/2+width/20 )
        .attr("x2", (window.innerWidth-width)/2+width)
        .attr("y2", (window.innerHeight-height)/2 )
        .style("stroke", "white")
        .style("stroke-width", 2)
        .attr("class", "info_sheet")


    let name = pkm["name"]
    let name_url = name.charAt(0).toLowerCase()+name.slice(1)
    info_sheet.append("image")
        .attr("xlink:href", "https://img.pokemondb.net/artwork/large/"+name_url+".jpg")
        .attr("x", (window.innerWidth-width)/2)
        .attr("y", (window.innerHeight-height)/2 +width/10)
        .attr("width", width/2)
        .attr("height", width/2)
        .attr("class", "info_sheet")

    info_sheet.append("text")
        .text(name)
        .attr("x", (window.innerWidth-width)/2+width/20)
        .attr("y", (window.innerHeight-height)/2+width/20)
        .style("fill", "black")
        .attr("class", "info_sheet")


    let invisible_rect = info_sheet.append("rect")
        .attr("x", (window.innerWidth-width)/2+width-width/20)
        .attr("y", (window.innerHeight-height)/2 )
        .attr("width", width/20)
        .attr("height", width/20)
        .attr("opacity", 0)
        .attr("class", "info_sheet")
        .on("click", function(){
            update_chart(index-1, feature)
        })
}
