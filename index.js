let canvas = document.querySelector("canvas");
let c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let score = document.querySelector("#score");
let startgame = document.querySelector("button");
let box = document.querySelector(".box");
class Player{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    update(){
        this.draw();

    }
    draw(){
        c.beginPath();
        c.arc(this.x , this.y ,this.radius, 0 , Math.PI * 2 , false);
        c.fillStyle = this.color;
        c.fill();

    }
}


class particles{
    constructor(x,y, radius, color , velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color ;
        this.velocity = velocity;
    }
    update(){
        this.x += this.velocity.x * 8;
        this.y += this.velocity.y * 8;
        this.draw();

    }
    draw(){
        c.beginPath();
        c.arc(this.x , this.y ,this.radius, 0 , Math.PI * 2 , false);
        c.fillStyle = this.color;
        c.fill();

    }
}

class enemies{
    constructor(x,y, radius, color , velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color ;
        this.velocity = velocity;
    }
    update(){
        this.x += this.velocity.x ;
        this.y += this.velocity.y ;
        this.draw();

    }
    draw(){
        c.beginPath();
        c.arc(this.x , this.y ,this.radius, 0 , Math.PI * 2 , false);
        c.fillStyle = this.color;
        c.fill();

    }
}
let friction = 0.98;

class burst{
    constructor(x,y, radius, color , velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color ;
        this.velocity = velocity;
        this.alpha = 1;
    }
    update(){
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x ;
        this.y += this.velocity.y ;
        this.draw();
        this.alpha -= 0.03;
    }
    draw(){
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x , this.y ,this.radius, 0 , Math.PI * 2 , false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
}
let Enemies = [];
let bursts = [];

function init(){
     Enemies = [];
 bursts = [];
sco  = 0;
}
function spawnenemies(){


    setInterval(function(){
        let radius = Math.random()*(30-4)+4;
        if(Math.random() < 0.5){
           x = (Math.random() < 0.5) ? (0-radius) : (radius+canvas.width);
           y = Math.random() * canvas.height;
        }
        else {
            y = (Math.random() < 0.5) ? (0-radius) : (radius+canvas.height);
            x = Math.random() * canvas.width;
        }
        let color = `hsl(${Math.random()*360},50%,50%,50%)`;
        let angle = Math.atan2(canvas.height/2 - y , canvas.width/2 - x);
    Enemies.push(new enemies(x,y,radius, color , {
        x : Math.cos(angle),
        y : Math.sin(angle)
    }))
    }, 1000)
}
let sco  = 0;
let  a = new Player(canvas.width/2, canvas.height/2 , 10, "white");
let Particles = [];
let animateid; 
function animate(){
   animateid =  requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0,0,0,0.09)';
    c.fillRect(0,0,window.innerWidth, window.innerHeight);
    a.update();
    
    for(let i = 0; i<Particles.length; i++){
        Particles[i].update();
        if(Particles[i].x + Particles[i].radius < 0 || Particles[i].x - Particles[i].radius > canvas.width || Particles[i].y  + Particles[i].radius < 0 || Particles[i].y - Particles[i].radius > canvas.height){
            Particles.splice(i,1);
        }
    }
    for(let i  = 0; i<Enemies.length; i++){
        Enemies[i].update();
        let dis = Math.hypot(Enemies[i].x - a.x , Enemies[i].y - a.y);
        if(dis < Enemies[i].radius + a.radius){
            cancelAnimationFrame(animateid);
            let sc = box.querySelectorAll("div");
            sc[0].innerHTML = sco;
           
            box.style.display = "flex";

        }

        for(let j = 0; j<Particles.length; j++){
            let dis = Math.hypot(Enemies[i].x - Particles[j].x , Enemies[i].y - Particles[j].y);
            

            if(dis < Enemies[i].radius + Particles[j].radius){
                for(let k = 0; k<Enemies[i].radius * 2; k ++){
                    bursts.push(new burst(Particles[j].x , Particles[j].y , Math.random()*2, Enemies[i].color, {
                        x : (Math.random()-0.5)*8,
                        y : (Math.random()-0.5)*8
                    }))
                }
                if(Enemies[i].radius - 10 > 5){
                    sco += 100;
                    gsap.to(Enemies[i] , {
                        radius : Enemies[i].radius-10
                    })
                  
                    setTimeout( function(){
                        
                        Particles.splice(j,1);
                    } , 0)
                }
                else{
                    sco += 200;
                setTimeout( function(){
                    Enemies.splice(i, 1);
                    Particles.splice(j,1);
                } , 0)
            }
            score.innerHTML = sco;
            }
    }
    }

    for(let i = 0; i<bursts.length; i++){
        bursts[i].update();
        if(bursts[i].alpha < 0){
            bursts.splice(i,1);
        }
    }
}

window.addEventListener("click", function(e){
    let x = e.x - canvas.width / 2;
    let y = e.y - canvas.height/2;
    let angle = Math.atan2(y, x);
    let particle = new particles(canvas.width/2, canvas.height/2,4, "white", {x : Math.cos(angle), y : Math.sin(angle)});
    Particles.push(particle);
})

startgame.addEventListener("click",function(){
    init();
    score.innerHTML = 0;
    box.style.display = "none";
    animate();
    spawnenemies();
    
})



















