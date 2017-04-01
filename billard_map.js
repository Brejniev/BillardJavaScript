
/* Scripts du Billard */
/* ================== */


/* ******************** Objet de type Boule */
/* ******************** ~~~~~~~~~~~~~~~~~~~ */

function Boule( x, y, r, v, a ) {
    this.x = x;  // position en x (horizontale)
    this.y = y;  // position en y (verticale)
    this.r = r;  // rayon de la boule
    this.a = a;  /* direction de déplacement de la boule
                  * RMQ: a est un angle exprimé en radian, a=0 correspond à
                  *      une direction horizontale vers la droite.
                  */
    this.v = v;  // vitesse de la boule
}

Boule.prototype.getAll = function() {
    var tab = new Array(5);
    tab[0] = this.x;
    tab[1] = this.y;
    tab[2] = this.r;
    tab[3] = this.v;
    tab[4] = this.a;
    return tab;
};

Boule.prototype.placer = function( x, y ) {
    // place la boule en (x,y)
    this.x = x;
    this.y = y;
};

Boule.prototype.setV = function( v ) {
    // la vitesse de la boule prend pour valeur v
    this.v = v;
};

Boule.prototype.setA = function( a ) {
    // oriente la boule dans la direction a
    this.a = a;
};

Boule.prototype.deplacer = function( C, vs ) {
    if( this.v<vs ) {
        this.v = 0;
    }
    // calcul la nouvelle position de la boule
    var newX = this.x + this.v*Math.cos(this.a);  // nouvelle position en x
    var newY = this.y - this.v*Math.sin(this.a);  // nouvelle position en y
    var R = this.r;  // rayon
    var W = C.width;  // largeur du canvas
    var H = C.height;  // hauteur du canvas
    if( newX-R<0 || newX+R>W ) {
        if( newX-R<0 ) {
            newX = this.x + (this.x-R)*(Math.cos(this.a));
        }
        if( newX+R>W ) {
            newX = this.x + (W-(this.x+R))*(Math.cos(this.a));
        }
        this.a = Math.PI - this.a;
        this.v = 0.7*this.v;
    }
    if( newY-R<0 || newY+R>H ) {
        if( newY-R<0 ) {
            newY = this.y + (this.y-R)*(Math.sin(this.a));
        }
        if( newY+R>H ) {
            newY = this.y + (H-(this.y+R))*(Math.sin(this.a));
        }
        this.a = -this.a;
        this.v = 0.7*this.v;
    }
    this.x = newX;
    this.y = newY;
};

Boule.prototype.dessiner = function( ctxt ) {
    // dessine la boule à l'écran
    ctxt.beginPath();
    ctxt.strokeStyle = "black";
    ctxt.fillStyle = "red";
    ctxt.arc( this.x, this.y, this.r, 0, 2*Math.PI, true );
    ctxt.fill();
    ctxt.stroke();
};


/* ******************** Objet de type Queue */
/* ******************** ~~~~~~~~~~~~~~~~~~~ */
/*
function Queue( v, a ) {
    this.ball = new Boule( 0, 0, 0, 0, 0 );  // la boule que l'on tire
    this.v = v;  // vitesse
    this.a = a;  // angle
}

Queue.prototype.orienter = function( a ) {
    // regle l'angle de tir
    this.a = a;
};

Queue.prototype.vitesse = function( v ) {
    // regle la vitesse de tir
    this.v = v;
};

Queue.prototype.jouerSur = function( b ) {
    // définit la boule sur laquelle on va jouer
    this.ball = b;
};

Queue.prototype.dessiner = function( ctxt ) {
    // dessine la queue
    ctxt.beginPath();
    ctxt.strokeStyle = "bisque";
    ctxt.fillStyle = "bisque";
    
    ctxt.fill();
    ctxt.stroke();
};
*/

/* ******************** Objet de type Map */
/* ******************** ~~~~~~~~~~~~~~~~~ */

function Map( canvas, n ) {
    this.canvas = canvas;
    this.n = n;
    this.M = new Array(n);
    var X, Y, A, W = canvas.width, H = canvas.height;
    for( var i=0 ; i<n ; i++ ) {
        X = Math.floor( Math.random()*(W-24) ) + 12;
        Y = Math.floor( Math.random()*(H-24) ) + 12;
        A = Math.random()*Math.PI*2;
        this.M[i] = new Boule( X, Y, 10, 5, A );
    }
    
    /*this.Col = new Array(n);
    //for( var i=0 ; i<n ; i++ ) {
    //    Col[i] = new Array(n);
    //    for( var j=0 ; j<n ; j++ ) {
    //        Col[i][j] = false;
    //    }
    //}*/
    
}

Map.prototype.dessiner = function() {
    var ctxt = this.canvas.getContext("2d");
    for( var i=0 ; i<this.n ; i++ ) {
        this.M[i].dessiner(ctxt);
    }
};

Map.prototype.collisions = function() {
    var X1, Y1, X2, Y2;
    var dXsqr, dYsqr;
    var theta;
    for( var j=0 ; j<this.n-1 ; j++ ) {
        X1 = this.M[j].x;
        Y1 = this.M[j].y;
        for( var k=j+1 ; k<this.n ; k++ ) {
            X2 = this.M[k].x;
            Y2 = this.M[k].y;
            dXsqr = Math.pow( (X1-X2), 2 );
            dYsqr = Math.pow( (Y1-Y2), 2 );
            theta = Math.atan( (Y1-Y2)/(X1-X2) );
            if( Math.sqrt( dXsqr + dYsqr ) < 2*this.M[0].r ) {
                this.M[j].a = (theta-Math.PI/2)-this.M[j].a;
                this.M[j].v *= 1;
                this.M[k].a = theta+this.M[k].a;
                this.M[k].v *= 1;
            }
        }
    }
};

Map.prototype.deplacer = function() {
    for( var i=0 ; i<n; i++ ) {
        this.M[i].deplacer();
    }
    
};


/* ******************** Fonction init() */
/* ******************** ~~~~~~~~~~~~~~~ */

function init() {
    
    var timerId = 0;
    var canvas = document.getElementById("billard");
    var ctxt = canvas.getContext("2d");
    
    var B = new Boule( canvas.width/2, canvas.height/2, 10, 15, 0 /*Math.PI/6*/ );
    B.dessiner(ctxt);
    
    var A;
    
    var vi;  // vitesse initiale de la boule
    var kf;  // coefficient de frottement (en %)
    var vs;  // vitesse seuil
    var ai;  // orientation initiale
    var nb;  // nombre de boules sur la table
    
    document.getElementById("apply").onclick = function() {
        vi = parseFloat( document.getElementById("vinit").value );
        kf = parseFloat( document.getElementById("coef").value );
        kf = (100-kf)/100;
        vs = parseFloat( document.getElementById("vseuil").value );
        ai = (parseFloat( document.getElementById("ainit").value ))*Math.PI/180;
        ctxt.clearRect( 0, 0, canvas.width, canvas.height );
        B = new Boule( canvas.width/2, canvas.height/2, 10, vi, ai );
        B.dessiner(ctxt);
        
        //nb = parseInt( document.getElementById("nbBoules").value );
        nb = 5;
        A = new Map( canvas, nb );
        A.dessiner();
    };
    
    document.getElementById("play").onclick = function() {
        document.getElementById("play").disabled = true;
        document.getElementById("stop").disabled = false;
        timerId = setInterval(  function() {
                                    ctxt.clearRect( 0, 0, canvas.width, canvas.height );
                                    B.deplacer(canvas,vs);
                                    B.dessiner(ctxt);
                                    B.setV( (B.getAll()[3])*kf );
                                    for( var i=0 ; i<nb ; i++ ) {
                                        A.M[i].deplacer(canvas,vs);
                                        A.M[i].dessiner(ctxt);
                                        A.M[i].setV( (A.M[i].getAll()[3])*kf );
                                    }
                                    kf = kf*0.999;
                                    A.collisions();
                                }, 50 );
    };
    
    document.getElementById("stop").onclick = function() {
        document.getElementById("play").disabled = false;
        document.getElementById("stop").disabled = true;
        clearInterval(timerId);
    };
    
}



