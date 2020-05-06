function create_svg(w, h, color){
    let canvas = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "main_svg")
        .style("background-color", color)

}

var sound_on = true;

function add_sound_icon(){

    let pic = d3.select("#main_svg")
        .append("image")
        .attr("xlink:href", "src/images/sound.png")
        .attr("x", 140)
        .attr("y", 15)
        .attr("width", 20)
        .attr("height", 20)

    if(sound_on===false){ draw_cross(140, 15, 20, 20)}

    let rect = d3.select("#main_svg")
        .append("rect")
        .attr("x",140)
        .attr("y", 15)
        .attr("width", 20)
        .attr("height", 20)
        .attr("opacity", 0)
        .on("click", function(){
            sound_on = !sound_on
            if(sound_on===false){ draw_cross(140, 15, 20, 20)}
            else{d3.selectAll(".sound_cross").remove()}
        })


}
function draw_cross(x, y, width, height){
    let line_1 = d3.select("#main_svg")
        .append("line")
        .attr("x1",x)
        .attr("y1",y)
        .attr("x2",x+width)
        .attr("y2",y+width)
        .style("stroke", "red")
        .style("stroke-width", 2)
        .attr("class", "sound_cross")

    let line_2 = d3.select("#main_svg")
        .append("line")
        .attr("x1",x+width)
        .attr("y1",y)
        .attr("x2",x)
        .attr("y2",y+width)
        .style("stroke", "red")
        .style("stroke-width", 2)
        .attr("class", "sound_cross")


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
        add_sound_icon()
        create_pokeball(diameter, posx, posy)
        add_select_gen(gen, feature)
        add_select_feature(gen, feature)
        add_legend(features)
        add_names_and_dots(names , nb_angles,diameter, posx, posy, pkm, feature)

    })

}

function add_legend(features){
    let svg = d3.select("#main_svg")
    let l = features.length
    let space = 0.5*window.innerWidth
    let interval = space/l
    let start = space/2
    for(let i=0; i<features.length; i++){
        let px = start+i*interval
        let legend = features[i]
        if(legend==0){
            legend="not legendary"
        }
        if(legend==1){
            legend="legendary"
        }
        let px_txt=px+10
        let leg=svg.append("text")
            .text(legend)
            .attr("transform", "translate("+px_txt+", 25) rotate(35)")
            .attr("font-size", window.innerWidth/100)
            .style("fill", "black")
            .attr("font-family", "arial, sans-serif")
            .attr("alignment-baseline", "central")
            .attr("id", "legend_"+i)
        let l = document.getElementById("legend_"+i).getBoundingClientRect().width*1.3


        let color = d3.csv("data/dot_colors.csv").then(function(d){
            let feat=features[i]
            let index = d.findIndex((k)=>{ return k.feature === feat})
            svg.append("circle")
                .attr("cx", px)
                .attr("cy", 20)
                .attr("r", 10)
                .style("fill", d[index].color)
            svg.append("rect")
                .attr("transform", "translate("+px+", 10) rotate(35)")
                .attr("width", l)
                .attr("height", 18)
                .attr("opacity", 0.2)
                .style("fill", d[index].color)
                .attr("class", "legend_rect")


        });

    }

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
            .attr("font-family", "arial, sans-serif")
            .attr("alignment-baseline", "middle")
            .attr("font-size", "100%")

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
                    let url_id = id.toString()

                    if(id<100){
                        url_id="0"+url_id
                    }
                    if(id<10){
                        url_id="0"+url_id
                    }
                    d3.selectAll(".info_sheet").remove()
                    move_color_circle_and_names( id, pkm, size, radius, posx, posy)
                    create_info_sheet(pokemon, gen, feature, pkm)
                    let name = pokemon["name"]
                    let name_url = name.charAt(0).toLowerCase()+name.slice(1)
                    if(sound_on){playSound("https://play.pokemonshowdown.com/audio/cries/"+name_url+".mp3")}
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
    let winners=[]
    let loosers=[]

    d3.csv("data/pvpoke_1v1_cp1500_2019.csv").then(function(d){

        d3.selection.prototype.moveToFront = function() {
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };

        let chosen = d[id-1]
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
        win=winners.length
        loss=loosers.length
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
                .style("fill", "maroon")
                .attr("font-size", window.innerWidth/130)
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
                .style("fill", "maroon")
                .attr("font-size", window.innerWidth/130)
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
        let width = window.innerWidth/4
        let height = window.innerHeight/1.5
        let posx_txt= (window.innerWidth-width)/2+width/20
        let posy_txt= (window.innerHeight-height)/2+width/20
        nom.transition()
            .attr("text-anchor", "start")
            .attr("transform", "translate("+posx_txt+","+posy_txt+") rotate(0)")
            .attr("font-size", window.innerHeight/25)
            .style("fill", "black")
            .duration(duration)

    });


}

function get_color(pkm, feature){
    let color = d3.csv("data/dot_colors.csv").then(function(d){
        let feat=pkm[feature]
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

function add_select_gen(gen, feature){
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
        .attr("font-family", "arial, sans-serif")
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
        .attr("font-family", "arial, sans-serif")
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
    px=(window.innerWidth*0.95)-l
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
        .attr("font-family", "arial, sans-serif")
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
        .attr("font-family", "arial, sans-serif")
        .text(function(d){ return d});


}

function update_chart(index, feature){
    d3.select("#main_svg").remove()
    let w = window.innerWidth
    let h = window.innerHeight
    create_svg(w, h, "beige")
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
        .attr("font-family", "arial, sans-serif")
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
        .attr("font-family", "arial, sans-serif")
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
            .attr("font-family", "arial, sans-serif")
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

function create_info_sheet(pkm, index, feature, pkm_list){

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
    let white_rect=info_sheet.append("rect")
        .attr("x", (window.innerWidth-width)/2)
        .attr("y", (window.innerHeight-height)/2+height/15)
        .attr("width", width/2)
        .attr("height", width/2+width/20)
        .attr("fill", "white")
        .attr("stroke", "black")
        .style("stroke-width", 3)
        .attr("class", "info_sheet")
        .moveToBack()
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

        let color_band_description= info_sheet.append("rect")
            .attr("x", (window.innerWidth-width)/2)
            .attr("y", (window.innerHeight)/2 )
            .attr("width", width)
            .attr("height", height/5)
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
        .attr("x", (window.innerWidth-width)/1.99)
        .attr("y", (window.innerHeight-height)/2 +width/10)
        .attr("width", width/2.1)
        .attr("height", width/2.1)
        .attr("class", "info_sheet")


    let x_txt = window.innerWidth/1.98
    let y_txt_st = (window.innerHeight-height)/2 +width/6
    let stats = ["HP", "Attack", "Defense", "Sp.Atk", "Sp.Def", "Speed"]
    let labels = ["hp", "atk", "def", "sp_atk", "sp_def", "spd"]
    let stat_val=[]
    for(let i = 0 ; i< labels.length; i++){
        let d = pkm[labels[i]]
        stat_val[i] = d
    }
    for(let i =0; i<6; i++){
        info_sheet.append("text")
            .text(stats[i])
            .attr("x", x_txt)
            .attr("y", y_txt_st+ 1.4*i*window.innerHeight/40)
            .attr("font-size", window.innerHeight/40)
            .attr("font-family", "arial, sans-serif")
            .style("fill", "black")
            .attr("class", "info_sheet")

        info_sheet.append("text")
            .text(stat_val[i].toString())
            .attr("x", x_txt+0.4*width)
            .attr("y", y_txt_st+ 1.4*i*window.innerHeight/40)
            .attr("font-size", window.innerHeight/40)
            .attr("font-family", "arial, sans-serif")
            .style("fill", "black")
            .attr("class", "info_sheet")
    }
    info_sheet.append("text")
        .text("description")
        .attr("x", window.innerWidth/2-0.49*width)
        .attr("y", window.innerHeight/1.9)
        .attr("font-size", "120%")
        .attr("font-family", "arial, sans-serif")
        .style("fill", "black")
        .attr("class", "info_sheet")
        .attr("text-decoration", "underline")

    let id_ = pkm["pokedex_number"]-1
    d3.csv("data/descriptions.csv").then(function(d){

        let text = d[id_].description
        let text_l = text.length
        let char_per_line = parseInt(window.innerWidth/30)
        let start_line=0
        let end_line=char_per_line
        line_nbr=0
        while(end_line<=text_l){
            if(text[end_line]==" " || end_line==text_l) {
                info_sheet.append("text")
                    .text(text.slice(start_line, end_line))
                    .attr("x", (window.innerWidth-width)/2+window.innerWidth/100)
                    .attr("y", (window.innerHeight)/1.8+line_nbr*window.innerHeight/60)
                    .attr("class", "info_sheet")
                    .attr("font-size", "85%")
                    .attr("font-family", "arial, sans-serif")
                    .style("fill", "black")
                line_nbr+=1
                start_line=end_line+1
                end_line += char_per_line

                if(end_line>text_l){
                    end_line=text_l
                    info_sheet.append("text")
                        .text(text.slice(start_line, end_line))
                        .attr("x", (window.innerWidth-width)/2+window.innerWidth/100)
                        .attr("y", (window.innerHeight)/1.8+line_nbr*window.innerHeight/60)
                        .attr("font-size", "85%")
                        .attr("font-family", "arial, sans-serif")
                        .attr("class", "info_sheet")
                        .style("fill", "black")
                }
            }
            end_line++
        }


    })
    let loosers=[]
    let winners=[]
    d3.csv("data/pvpoke_1v1_cp1500_2019.csv").then(function(d) {
        let chosen = d[id_]
        let len = pkm_list.length
        for (let i = 0; i < len; i++) {
            poke_list_id = pkm_list[i].pokedex_number
            if (chosen[poke_list_id] == 1) {
                loosers.push(poke_list_id)
            } else if (chosen[poke_list_id] == -1) {
                winners.push(poke_list_id)
            }

        }
        info_sheet.append("text")
            .text(winners.length)
            .attr("x", (window.innerWidth)/2+window.innerWidth/100)
            .attr("y", (window.innerHeight)/1.25)
            .attr("font-size", "500%")
            .attr("font-family", "arial, sans-serif")
            .attr("class", "info_sheet")
            .style("fill", "black")
        info_sheet.append("text")
            .text(loosers.length)
            .attr("x", (window.innerWidth-width)/2+window.innerWidth/100)
            .attr("y", (window.innerHeight)/1.25)
            .attr("font-size", "500%")
            .attr("font-family", "arial, sans-serif")
            .attr("class", "info_sheet")
            .style("fill", "black")
        info_sheet.append("text")
            .text("defeats")
            .attr("x", (window.innerWidth)/2+window.innerWidth/100)
            .attr("y", (window.innerHeight)/1.45)
            .attr("font-size", "250%")
            .attr("font-family", "arial, sans-serif")
            .attr("class", "info_sheet")
            .style("fill", "black")
        info_sheet.append("text")
            .text("victories")
            .attr("x", (window.innerWidth-width)/2+window.innerWidth/200)
            .attr("y", (window.innerHeight)/1.45)
            .attr("font-size", "250%")
            .attr("font-family", "arial, sans-serif")
            .attr("class", "info_sheet")
            .style("fill", "black")
        info_sheet.append("rect")
            .attr("x", (window.innerWidth-width)/2)
            .attr("y", (window.innerHeight)/2+height/5 )
            .attr("width", width/2)
            .attr("height", window.innerHeight/5)
            .style("fill", "none")
            .attr("stroke-opacity", 1)
            .attr("stroke", "black")
            .attr("class", "info_sheet")
        info_sheet.append("rect")
            .attr("x", (window.innerWidth)/2)
            .attr("y", (window.innerHeight)/2+height/5 )
            .attr("width", width/2)
            .attr("height", window.innerHeight/5)
            .style("fill", "none")
            .attr("stroke-opacity", 1)
            .attr("stroke", "black")
            .attr("class", "info_sheet")

    })






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

function playSound(soundfile) {
    let sound =new Audio(soundfile)
    sound.play();
}