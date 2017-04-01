
/* ******************** Fonctions de base */
/* ******************** ~~~~~~~~~~~~~~~~~ */

/**
 * Obtenir la position de la souris :
 * @param {type} canvas 
 * @param {type} evt = la position de la souris
 * @returns les coordonnées de la souris
 */
function getMousePos( canvas, evt ) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


/* ******************** Objet de type Boule */
/* ******************** ~~~~~~~~~~~~~~~~~~~ */

/**
 * Constructeur du type Boule :
 * @param {type} canvas dans lequel la boule est dessinée
 * @returns {Boule}
 */
function Boule( canvas ) {
    this.canvas = canvas;
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.r = 10;
    this.v = 0;
    this.a = 0;
}

// Boule : placer( x, y ) :
Boule.prototype.placer = function( x, y ) {
    // place la boule en (x,y) :
    this.x = x;
    this.y = y;
};

// Boule : setV( vitesse ) :
Boule.prototype.setV = function( v ) {
    // la vitesse de la boule prend pour valeur v :
    this.v = v;
};

// Boule : getV() :
Boule.prototype.getV = function() {
    // renvoie la vitesse de la boule :
    return this.v;
};

// Boule : setA( angle ) :
Boule.prototype.setA = function( a ) {
    // oriente la boule dans la direction a :
    this.a = a;
};

// Boule : getA() :
Boule.prototype.getA = function() {
    // renvoie l'orientation de la boule :
    return this.a;
};

/**
 * Déplace la boule :
 */
Boule.prototype.deplacer = function() {
    
    if( this.v<0.5 ) {
        this.v = 0;
    }
    
    // calcul la nouvelle position de la boule :
    var newX = this.x + this.v*Math.cos(this.a);  // nouvelle position en x
    var newY = this.y - this.v*Math.sin(this.a);  // nouvelle position en y
    
    // variables utiles pour les calculs :
    var R = this.r;  // rayon
    var W = this.canvas.width;  // largeur du canvas
    var H = this.canvas.height;  // hauteur du canvas
    
    // si la boule va taper à gauche ou à droite :
    if( newX-R<0 || newX+R>W ) {
        // pour ne pas sortir du cadre :
        if( newX-R<0 ) { // si on tape à gauche :
            newX = this.x + (this.x-R)*(Math.cos(this.a));
        }
        if( newX+R>W ) { // si on tape à droite :
            newX = this.x + (W-(this.x+R))*(Math.cos(this.a));
        }
        this.a = Math.PI - this.a;  // on change l'orientation
    }
    
    // si la boule va taper en haut ou en bas :
    if( newY-R<0 || newY+R>H ) {
        // pour ne pas sortir du cadre :
        if( newY-R<0 ) { // si on tape en haut :
            newY = this.y + (this.y-R)*(Math.sin(this.a));
        }
        if( newY+R>H ) { // si on tape en bas :
            newY = this.y + (H-(this.y+R))*(Math.sin(this.a));
        }
        this.a = -this.a;  // on change l'orientation
    }
    
    // on effectue le changement de position de la boule :
    this.x = newX;
    this.y = newY;
    this.v = 0.95*this.v
};

/**
 * Dessine la boule :
 * @returns {undefined} dessine la fonction
 */
Boule.prototype.dessiner = function( ctx ) {
    ctx.beginPath();
    ctx.arc( this.x, this.y, this.r, 0, Math.PI*2, true );
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
};


/* ******************** Objet de type Queue */
/* ******************** ~~~~~~~~~~~~~~~~~~~ */

/**
 * Constructeur du type Queue :
 * @param {canvas} canvas où est dessiné la queue 
 * @param {objet} Boule = la boule à jouer servant à récupérer les coordonnées
 * @returns {Queue}
 */
function Queue( canvas, Boule ) {
    this.canvas = canvas;
    this.currentBall = Boule;
    this.x = Boule.x;
    this.y = Boule.y;
    this.taille = 200;
    //this.xtop = 0;
    //this.ytop = 0;
    //this.alpha = 0;
}

/**
 * Déplace la queue de billard :
 */
Queue.prototype.deplacer = function() {
    this.x = this.currentBall.x;
    this.y = this.currentBall.y;
    this.xtop = this.x + this.taille * Math.cos(this.alpha);
    this.ytop = this.y + this.taille * Math.sin(this.alpha);
};

/**
 * Oriente la queue :
 */
Queue.prototype.incliner = function( evt ) {
    var mouse = getMousePos( this.canvas, evt );
    var x = mouse.x - this.x;
    var y = mouse.y - this.y;
    if (x < 0) {
       this.alpha = Math.PI + Math.atan(y/x);   
    }
    else {
       this.alpha = Math.atan(y/x);
    }
};

/**
 * Dessine la queue :
 */
Queue.prototype.dessiner = function( ctx ) {
    ctx.beginPath();
    ctx.strokeStyle = "brown";
    ctx.lineWidth = 2;
    ctx.moveTo( this.x, this.y );
    ctx.lineTo( this.xtop, this.ytop );
    ctx.stroke();
};

/**
 * Taper dans la boule pour la faire se déplacer :
 */
Queue.prototype.taperBoule = function() {
    this.currentBall.setA( -this.alpha + Math.PI );
    this.currentBall.setV( 20 );
};


/* ******************** Fonction init() */
/* ******************** ~~~~~~~~~~~~~~~ */

function init() {
    
    var canvas = document.getElementById("billard");
    var ctxt = canvas.getContext("2d");
    
    var blanche = new Boule( canvas );
    blanche.dessiner( ctxt );
    
    var queue = new Queue( canvas, blanche );
    
    // Action lorsqu'on déplace la souris dans le canvas :
    canvas.addEventListener( "mousemove", function( evt ) {
                                              //ctxt.clearRect( 0, 0, canvas.width, canvas.height );
                                              //blanche.deplacer();
                                              //blanche.dessiner( ctxt );
                                              queue.incliner( evt );
                                              //queue.deplacer();
                                              //queue.dessiner( ctxt );
                                          }, false );
    
    // Action lorsqu'on clique sur le canvas :
    canvas.addEventListener( "click", function() {
                                          queue.taperBoule();
                                      }, false );
    
    // Action du bouton 'Play' :
    document.getElementById("play").onclick = function() {
        document.getElementById("play").disabled = true;
        document.getElementById("stop").disabled = false;
        
        // démarrage du timer :
        timerId = setInterval( function() {
                                   ctxt.clearRect( 0, 0, canvas.width, canvas.height );
                                   blanche.deplacer();
                                   blanche.dessiner( ctxt );
                                   if( blanche.getV()===0 ) {
                                       queue.deplacer();
                                       queue.dessiner( ctxt );
                                   }
                               }, 50 );
    };
    
    // Action du bouton 'Stop' :
    document.getElementById("stop").onclick = function() {
        document.getElementById("play").disabled = false;
        document.getElementById("stop").disabled = true;
        
        // arrêt du timer :
        clearInterval(timerId);
    };
    
}



