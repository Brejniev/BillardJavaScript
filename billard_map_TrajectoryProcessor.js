
/* Scripts du Billard */
/* ================== */



/* ******************** Objet de type Boule */
/* ******************** ~~~~~~~~~~~~~~~~~~~ */

function Boule( x, y, r, v, a ) {
    this.x = x;  // position en x (horizontale)
    this.y = y;  // position en y (verticale)
    this.r = r;  // rayon de la boule
    this.v = v;  // vitesse de la boule
    this.a = a;  /* direction de déplacement de la boule
                  * RMQ: a est un angle exprimé en radian, a=0 correspond à
                  *      une direction horizontale vers la droite.
                  */
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
        // en dessous d'une vitesse seuil la boule s'arrête
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
            // rebond sur le bord gauche
            newX = this.x + (this.x-R)*(Math.cos(this.a));
        }
        if( newX+R>W ) {
            // rebond sur le bord droit
            //newX = this.x + (W-(this.x+R))*(Math.cos(this.a));
            newX = this.x + ((this.x+R)-W)*(Math.cos(this.a));
        }
        this.a = Math.PI - this.a; // changement d'orientation dû au rebond
        this.v = 0.75*this.v; // perte de vitesse due au rebond
    }
    if( newY-R<0 || newY+R>H ) {
        if( newY-R<0 ) {
            // rebond su le bord du haut
            newY = this.y + (this.y-R)*(Math.sin(this.a));
        }
        if( newY+R>H ) {
            // rebond sur le bord du bas
            //newY = this.y + (H-(this.y+R))*(Math.sin(this.a));
            newY = this.y + ((this.y+R)-H)*(Math.sin(this.a));
        }
        this.a = -this.a; // changement d'orientation dû au rebond
        this.v = 0.75*this.v; // perte de vitesse due au rebond
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

/* ======================================== */



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
        this.M[i] = new Boule( X, Y, 10, 20, A );
    }
}

Map.prototype.getAll = function() {
    var list = new Array(this.n);
    for( var i=0 ; i<this.n ; i++ ) {
        list[i] = this.M[i].getAll();
    }
    return list;
};

Map.prototype.placer = function( X, Y ) {
    for( var i=0 ; i<this.n ; i++ ) {
        this.M[i].placer( X[i] , Y[i] );
    }
};

Map.prototype.dessiner = function() {
    var ctxt = this.canvas.getContext("2d");
    for( var i=0 ; i<this.n ; i++ ) {
        this.M[i].dessiner(ctxt);
    }
};

/* ====================================== */



/* ******************** Fonction init() */
/* ******************** ~~~~~~~~~~~~~~~ */

function init() {
    
    var timerId = 0;
    var canvas = document.getElementById("billard");
    var ctxt = canvas.getContext("2d");
    
    var vi = 20;  // vitesse initiale de la boule (en pixels/s)
    var ai = 30;  // orientation initiale (en degrés)
    var nb = 1;  // nombre de boules sur la table
    
    var BM = new Map( canvas, nb );
    BM.dessiner();
    
    var B = new Boule( canvas.width/2, canvas.height/2, 10, 30, Math.PI/5 );
    B.dessiner( ctxt );
    
    var X, Y, V, A, dt = 1;
    var result, Xt, Yt;
    
    document.getElementById("apply").onclick = function() {
	ctxt.clearRect( 0, 0, canvas.width, canvas.height );
	BM = new Map( canvas, nb );
    	BM.dessiner();
        result = BM.getAll();
        X = [];
        Y = [];
        V = [];
        A = [];
        for( var i=0 ; i<BM.n ; i++ ) {
            X.push( result[i][0] );
            Y.push( result[i][1] );
            V.push( result[i][3] );
            A.push( result[i][4] );
        }
        result = TrajectoryProcessor( canvas, X, Y, BM.M[0].r, V, A, dt );
        Xt = [];
        Yt = [];
        for( var i=0 ; i<result.Np ; i++ ) {
            Xt[i] = [];
            Yt[i] = [];
            for( var j=0 ; j<BM.n ; j++ ) {
                Xt[i].push( result.Xt[j][i] );
                Yt[i].push( result.Yt[j][i] );
            }
        }
    };
    
    var count;
    
    document.getElementById("play").onclick = function() {
        document.getElementById("play").disabled = true;
        document.getElementById("stop").disabled = false;
        count = 0;
        timerId = setInterval(  function() {
                                    ctxt.clearRect( 0, 0, canvas.width, canvas.height );
                                    if( count<result.Np ) {
                                        BM.placer( Xt[count], Yt[count] );
                                    }
                                    BM.dessiner();
                                    B.deplacer( canvas, 0.5 );
                                    B.dessiner( ctxt );
                                    count++;
                                }, 50 );
    };
    
    document.getElementById("stop").onclick = function() {
        document.getElementById("play").disabled = false;
        document.getElementById("stop").disabled = true;
        clearInterval(timerId);
    };
    
}

/* ==================================== */



/* ******************** Trajectory Processor */
/* ******************** ~~~~~~~~~~~~~~~~~~~~ */

function TrajectoryProcessor( C, X, Y, r, V, A, dt ) {
    
    var R = r, W = C.width, H = C.height;
    
    // Step 0 :
    var N = X.length;
    var newX = new Array(N), newY = new Array(N);
    for( var i=0 ; i<N ; i++ ) {
        
        newX[i] = new Array(1);
        newX[i][0] = X[i];
        
        newY[i] = new Array(1);
        newY[i][0] = Y[i];
        
    }
    
    var XX = new Array(2), YY = new Array(2);
    var VV = new Array(2), AA = new Array(2);
    var nbI = 1;
    
    while( !isOver(V) ) {
        
        // Step 1 :
        for( var i=0 ; i<N ; i++ ) {
            [ X[i], Y[i] ] = processStep1( X[i], Y[i], V[i], A[i], dt );
        }
        
        // Step 2 :
        for( var i=0 ; i<N ; i++ ) {
            [ X[i], Y[i], V[i], A[i] ] = processStep2( X[i], Y[i], R, V[i], A[i], W, H, dt );
        }
        
        // Step 3 :
        for( var i=0 ; i<N ; i++ ) {
            for( var j=i+1 ; j<N ; j++ ) {
                XX[0] = X[i]; XX[1] = X[j];
                YY[0] = Y[i]; YY[1] = Y[j];
                VV[0] = V[i]; VV[1] = V[j];
                AA[0] = A[i]; AA[1] = A[j];
                [ XX, YY, VV, AA ] = processStep3( XX, YY, R, VV, AA, dt );
                X[i] = XX[0]; X[j] = XX[1];
                Y[i] = YY[0]; Y[j] = YY[1];
                V[i] = VV[0]; V[j] = VV[1];
                A[i] = AA[0]; A[j] = AA[1];
            }
        }
        
        // Step 4 :
        for( var i=0 ; i<N ; i++ ) {
            V[i] = processStep4( V[i] );
        }
        
        // Step 5 :
        for( var i=0 ; i<N ; i++ ) {
            newX[i].push( X[i] );
            newY[i].push( Y[i] );
        }
        
        nbI++;
        
    }
    
    return { Np: nbI, Xt: newX, Yt: newY };
    
}

/**
 * isOver( V ) : indique si les calculs sont finis
 *               Cette fonction renvoie 'vrai' si toutes
 *               les vitesses sont à 0, elle renvoie 
 *               'faux' sinon.
 */
function isOver( V ) {
    var b = true;
    for( var i=0 ; i<V.length ; i++ ) {
        if( V[i]!==0 ) {
            b = false;
        }
    }
    return b;
}

/**
 * Calcul de la position suivante
 */
function processStep1( x, y, v, a, dt ) {
    
    x += v*dt*( Math.cos(a) );
    y -= v*dt*( Math.sin(a) );
    return [ x, y ];
    
}

/**
 * Calcul des collisions contre les bords
 */
function processStep2( x, y, r, v, a, w, h, dt ) {
    
    if( (x-r)<0 || (x+r)>w ) {
        x -= v*dt*( Math.cos(a) );
        if( (x-r)<0 ) {
            x += (x-r)*( Math.cos(a) );
        }
        else {
            x += ( w - (x+r) )*( Math.cos(a) );
        }
        a = Math.PI - a;
        v *= 0.75;
    }
    
    if( (y-r)<0 || (y+r)>h ) {
        y += v*dt*( Math.sin(a) );
        if( (y-r)<0 ) {
            y += (y-r)*( Math.sin(a) );
        }
        else {
            y += ( h - (y+r) )*( Math.sin(a) );
        }
        a = -a;
        v *= 0.75;
    }
    
    return [ x, y, v, a ];
    
}

/**
 * Calcul des collisions entre boules
 */
function processStep3( x, y, r, v, a, dt ) {
    
    var dX = x[1]-x[0];
    var dY = y[1]-y[0];
    var dXsqr = Math.pow( dX, 2 );
    var dYsqr = Math.pow( dY, 2 );
    var d = Math.sqrt( dXsqr + dYsqr );
    var theta;
    
    if( d<2*r ) {
        
        x[0] -= v*dt*( Math.cos(a[0]) );
        y[0] -= v*dt*( Math.sin(a[0]) );
        x[1] -= v*dt*( Math.cos(a[1]) );
        y[1] -= v*dt*( Math.sin(a[1]) );
        
        x[0] += (r/2)*( Math.cos(a[0]) );
        y[0] += (r/2)*( Math.sin(a[0]) );
        x[1] += (r/2)*( Math.cos(a[1]) );
        y[1] += (r/2)*( Math.sin(a[1]) );
        
        theta = Math.atan( dY/dX );
        a[0] = theta - Math.PI/2 - a[0];
        v[0] *= 0.95;
        a[1] += theta;
        v[1] *= 0.95;
    }
    
    return [ x, y, v, a ];
    
}

/**
 * Calcul des frottements
 */
function processStep4( v ) {
    
    var kf = 0.99;  // coefficient de frottement
    var vs = 0.5;  // vitesse seuil
    
    v *= kf;
    if( v < vs ) {
        v = 0;
    }
    
    return v;
    
}

/* ========================================= */



