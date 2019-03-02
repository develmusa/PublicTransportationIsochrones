let mapimg;
let data = [];
let destinations = [];


let zoom = 11

const classificationStep = 300;


const width = 1000;
const height = 1000;

let destinationsMap = [];

let clat = 47.22969701540366;
let clon = 8.842356772926856;

let lat = 47.22969701540366;
let lon = 8.842356772926856;
 
let cx;
let cy;

let ox;
let oy;


function preload(){
    mapimg = loadImage("https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/"+clon+","+clat+","+zoom+",0,0/"+width+"x"+height+"?access_token=pk.eyJ1Ijoic2lrY2QiLCJhIjoiY2poOWhudTliMGZhdzNkbWtidGc0Mm9mbSJ9.skDz9jIPLBAlrnv1bqxgXQ")
    data = loadJSON('assets/jona_0-600_1500.json');
    cx = mercX(clon);
    cy = mercY(clat);

    ox = mercX(lon) - cx;   
    oy = mercY(lat) - cy;

    initMatirx();
}

function initMatirx(){
    for(let x=0; x<width; x++) {
        let yComponent = [];
        for (let y = 0; y < height; y++) {
            yComponent[y] = undefined;   
        }
        destinationsMap[x] = yComponent;
    }
}

function mercX(lon){
    lon = radians(lon)
    let a = (256/ PI) * pow(2, zoom);
    let b = lon + PI;
    return a * b;
}

function mercY(lat){
    lat = radians(lat)
    let a = (256/ PI) * pow(2, zoom);
    let b = tan(PI / 4 + lat / 2);
    let c = PI - log(b);
    return a * c;
}

function setup() {
    createCanvas(width, height);
    translate(width / 2, height / 2);
    imageMode(CENTER);
    image(mapimg,0,0);



    fill(255,0,255,200)
    ellipse(ox, oy, 5, 5)

    loadData();

    for (let i = 0; i < destinations.length; i++) {
        destinations[i].display();
        destinations[i].rollover(mouseX,mouseY)        
    };
    nearestNeighbor(3);
}

function draw() {
    translate(width / 2, height / 2);
    for (let i = 0; i < destinations.length; i++) {
        destinations[i].display();
        destinations[i].rollover(mouseX - width/2,mouseY - height/2)        
    };
    //console.log(mouseX + "/" + width)


    
}



function loadData() {
    for (const [key, destination] of Object.entries(data)) {
      
        
        let position = destination['RecordsTo']['fields']['geopos']
        let cx = mercX(clon);
        let cy = mercY(clat);
        let x = mercX(position[1]) - cx;
        let y = mercY(position[0]) - cy;

        let name = destination['RecordsTo']['fields']['name']
        let minDuration = destination['min_duration']
        let tempDestination = new Destination(x,y,minDuration, name)
        destinations.push(tempDestination);
        //destinationsMap[parseInt(x)] = 3;
        console.log(x);
        console.log(y);
        //destinationsMap[Math.round(x)][Math.round(y)] = 2;
    };
}

function nearestNeighbor(k){
    destinations.sort()
    for (let positionX = 0; positionX < width; positionX++) {
        for (let positionY = 0; positionY < height; positionY++) {
            // let points =[];
            // for (let index = 0; index < destinations.length; index++) {
            //     let point = {};
            //     point.distance = distanceCalculation(positionX,positionY,destinations[index].x, destinations[index].y)
            //     point.class = destinations[index].classification;
            //     points.push(point);
            // } 
            // points.sort((a,b) => a.distance - b.distance);
            // console.log(points[0]);      
        }        
    }
}

function distanceCalculation(originX,originY, destinationX, destinationY){
    return Math.sqrt(Math.pow(destinationX-originX,2)+Math.pow(destinationY-originY,2));
}

class Destination {
    constructor(x, y, minDuration, name) {
      this.x = x;
      this.y = y;
      this.minDuration = minDuration;
      this.name = name;

      this.classification = Math.floor(minDuration / classificationStep);
      //this.classification = minDuration / classificationStep;
  
      this.over = false;
    }
  
    rollover(px, py) {
      let d = dist(px, py, this.x, this.y);
      this.over = d < 20;
    }
  
    display() {
        fill(0,255,255,200)
        ellipse(this.x, this.y, 5, 5);
        textAlign(CENTER);
        fill(255,255,255,200)
        //text(this.minDuration, this.x, this.y);
    //    if (this.over) {
    //        print("over")
    //      fill(255);
    //      textAlign(CENTER);
    //      text(this.name, this.x, this.y);
    //    }
    }
  
}