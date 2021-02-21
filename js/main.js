//---------------------------//
// Predefined Script Strings //
//---------------------------//

var galaxyExpansion = `
/*-------------------------------------------------------------------------------------------

Built with
                   _   _      _                                   _                _     
  _ __   __ _ _ __| |_(_) ___| | ___           _ __ ___ _ __   __| | ___ _ __     (_)___ 
 | '_ \\ / _\` | '__| __| |/ __| |/ _ \\  _____  | '__/ _ \\ '_ \\ / _\` |/ _ \\ '__|    | / __|
 | |_) | (_| | |  | |_| | (__| |  __/ |_____| | | |  __/ | | | (_| |  __/ |     _ | \\__ \\
 | .__/ \\__,_|_|   \\__|_|\\___|_|\\___|         |_|  \\___|_| |_|\\__,_|\\___|_|    (_)/ |___/
 |_|                                                                            |__/   

by Shane Duffy


This platform makes it easy to generate particle simulations. Just give a timestep function to 
ParticleRender, this timestep function should return the new positions as an array of (x, y, z) values, 
one for each particle:

ParticleRender.SetTimestepFunction(function(dt) {
	// Some physics handling
});

This timestep function can reference any global variables you define outside of it, so you can
define your positions/velocities/accelerations/masses/etc. however you want outside of the
timestep function, and access them however you want inside of the timestep function.

-------------------------------------------------------------------------------------------*/

//-------------------//
// General Variables //
//-------------------//

var numParticles = 100000;
var G = 6.674 * Math.pow(10, -11);

var i;
var j;

var props = {
    r: 0,
    v: 1,
    a: 2,
    m: 3
};

var dim = {
    x: 0,
    y: 1,
    z: 2
};

// Stores particle position/velocity/acceleration/mass
var particleData = [];

// Stores particle sizes
var particleSizes = [];

// Stores particle colors
var particleColors = [];

// Initialize particleData dimensions
particleData[props.r] = [];
particleData[props.v] = [];
particleData[props.a] = [];
particleData[props.m] = [];

//------------------//
// Helper Functions //
//------------------//

function randomExponential(rate) {
    var random = Math.random();
    return -Math.log(random) / rate;
}

//-----------------------------//
// Particle Initial Conditions //
//-----------------------------//

//----- Initialize large, fixed center "star" -----//

particleData[props.r][0] = [];
particleData[props.r][0][dim.x] = 0;
particleData[props.r][0][dim.y] = 0;
particleData[props.r][0][dim.z] = 0;

particleData[props.v][0] = [];
particleData[props.v][0][dim.x] = 0;
particleData[props.v][0][dim.y] = 0;
particleData[props.v][0][dim.z] = 0;

particleData[props.a][0] = [];
particleData[props.a][0][dim.x] = 0;
particleData[props.a][0][dim.y] = 0;
particleData[props.a][0][dim.z] = 0;

particleData[props.m][0] = Math.pow(10, 200);

particleSizes[0] = 400;

particleColors[0] = 0xFFFFFF;

//----- Initialize the rest of the particles using distribution function -----//

for (i = 1; i < numParticles; i++) {
    particleData[props.r][i] = [];
    particleData[props.r][i][dim.x] = ((Math.random() > 0.5 ? -1 : 1) * randomExponential(15)) * 800;
    particleData[props.r][i][dim.y] = ((Math.random() > 0.5 ? -1 : 1) * randomExponential(30)) * 500;
    particleData[props.r][i][dim.z] = ((Math.random() > 0.5 ? -1 : 1) * randomExponential(15)) * 800;

    particleData[props.v][i] = [];
    particleData[props.v][i][dim.x] = particleData[props.r][i][dim.z] / 3;
    particleData[props.v][i][dim.y] = particleData[props.r][i][dim.z];
    particleData[props.v][i][dim.z] = -particleData[props.r][i][dim.x] / 3;

    particleData[props.a][i] = [];
    particleData[props.a][i][dim.x] = 0;
    particleData[props.a][i][dim.y] = 0;
    particleData[props.a][i][dim.z] = 0;

    particleData[props.m][i] = Math.random() * 2 * Math.pow(10, 16);

    particleSizes[i] = 3;

    particleColors[i] = 0x1919FF;
}

//-----------------------------//
// Implement Timestep Function //
//-----------------------------//

ParticleRender.SetTimestepFunction(function(dt) {
    for (i = 1; i < particleData[props.r].length; i++) {

        //----- Determine new accelerations -----//
		
        var newA = [];
        newA[dim.x] = 0;
        newA[dim.y] = 0;
        newA[dim.z] = 0;

		var dx = particleData[props.r][i][dim.x] - particleData[props.r][0][dim.x];
		var dy = particleData[props.r][i][dim.y] - particleData[props.r][0][dim.y];
		var dz = particleData[props.r][i][dim.z] - particleData[props.r][0][dim.z];

		var r = Math.sqrt(dx * dx + dy * dy + dz * dz);
		
		// Low and high distance limiting so particles aren't lost to the abyss of floating point arithmetic
        if (r < 100)
            r = 100;
            
        if (r > 200)
            r = 200;

		var factor = -(particleData[props.m][i] / (r * r * r));

		newA[dim.x] += factor * dx;
		newA[dim.y] += factor * dy;
		newA[dim.z] += factor * dz;

        newA[dim.x] = newA[dim.x] * G;
        newA[dim.y] = newA[dim.y] * G;
        newA[dim.z] = newA[dim.z] * G;

        //----- Apply leapfrog timestep -----//

        particleData[props.r][i][dim.x] = particleData[props.r][i][dim.x] + particleData[props.v][i][dim.x] * dt + 0.5 * particleData[props.a][i][dim.x] * dt * dt;
        particleData[props.r][i][dim.y] = particleData[props.r][i][dim.y] + particleData[props.v][i][dim.y] * dt + 0.5 * particleData[props.a][i][dim.y] * dt * dt;
        particleData[props.r][i][dim.z] = particleData[props.r][i][dim.z] + particleData[props.v][i][dim.z] * dt + 0.5 * particleData[props.a][i][dim.z] * dt * dt;

        particleData[props.v][i][dim.x] = particleData[props.v][i][dim.x] + 0.5 * (particleData[props.a][i][dim.x] + newA[dim.x]) * dt;
        particleData[props.v][i][dim.y] = particleData[props.v][i][dim.y] + 0.5 * (particleData[props.a][i][dim.y] + newA[dim.y]) * dt;
        particleData[props.v][i][dim.z] = particleData[props.v][i][dim.z] + 0.5 * (particleData[props.a][i][dim.z] + newA[dim.z]) * dt;
    }

    return particleData[props.r];
});

//------------------------//
// Apply General Settings //
//------------------------//

ParticleRender.SetBackgroundColor(0x000000);
ParticleRender.SetParticleSizes(particleSizes);
ParticleRender.SetParticleColors(particleColors);

ParticleRender.SetFieldOfView(75);
ParticleRender.SetNearPlane(1);
ParticleRender.SetFarPlane(100000);
ParticleRender.SetPixelRatio(1);
ParticleRender.SetCameraInitialX(0);
ParticleRender.SetCameraInitialY(500);
ParticleRender.SetCameraInitialZ(2000);`


//-------------------//
// General Variables //
//-------------------//

var canvas = document.getElementById("simulationCanvas");

var numParticles = 100000;
var G = 6.674 * Math.pow(10, -11);

var i;
var j;

var props = {
    r: 0,
    v: 1,
    a: 2,
    m: 3
};

var dim = {
    x: 0,
    y: 1,
    z: 2
};

// Stores particle position/velocity/acceleration/mass
var particleData = [];

// Stores particle sizes
var particleSizes = [];

// Stores particle colors
var particleColors = [];

// Initialize particleData dimensions
particleData[props.r] = [];
particleData[props.v] = [];
particleData[props.a] = [];
particleData[props.m] = [];

//------------------//
// Helper Functions //
//------------------//

function randomExponential(rate) {
    var random = Math.random();
    return -Math.log(random) / rate;
}

//-----------------//
// Window Handling //
//-----------------//

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ParticleRender.SetHeight(window.innerHeight);
    ParticleRender.SetWidth(window.innerWidth);
};

document.body.style.overflow = 'hidden';

window.onresize = resizeCanvas;

resizeCanvas();

//----------------------------//
// Load initial vector states //
//----------------------------//

particleData[props.r] = [];
particleData[props.v] = [];
particleData[props.a] = [];
particleData[props.m] = [];

particleData[props.r][0] = [];
particleData[props.r][0][dim.x] = 0;
particleData[props.r][0][dim.y] = 0;
particleData[props.r][0][dim.z] = 0;

particleData[props.v][0] = [];
particleData[props.v][0][dim.x] = 0;
particleData[props.v][0][dim.y] = 0;
particleData[props.v][0][dim.z] = 0;

particleData[props.a][0] = [];
particleData[props.a][0][dim.x] = 0;
particleData[props.a][0][dim.y] = 0;
particleData[props.a][0][dim.z] = 0;

particleData[props.m][0] = Math.pow(10, 200);

particleSizes[0] = 400;

particleColors[0] = 0xFFFFFF;

for (i = 1; i < numParticles; i++) {
    particleData[props.r][i] = [];
    particleData[props.r][i][dim.x] = ((Math.random() > 0.5 ? -1 : 1) * randomExponential(15)) * 800;
    particleData[props.r][i][dim.y] = ((Math.random() > 0.5 ? -1 : 1) * randomExponential(30)) * 500;
    particleData[props.r][i][dim.z] = ((Math.random() > 0.5 ? -1 : 1) * randomExponential(15)) * 800;

    particleData[props.v][i] = [];
    particleData[props.v][i][dim.x] = particleData[props.r][i][dim.z] / 3;
    particleData[props.v][i][dim.y] = particleData[props.r][i][dim.z];
    particleData[props.v][i][dim.z] = -particleData[props.r][i][dim.x] / 3;

    particleData[props.a][i] = [];
    particleData[props.a][i][dim.x] = 0;
    particleData[props.a][i][dim.y] = 0;
    particleData[props.a][i][dim.z] = 0;

    particleData[props.m][i] = Math.random() * 2 * Math.pow(10, 16);

    particleSizes[i] = 3;

    particleColors[i] = 0x1919FF;
}


//-------------------------//
// Load particle simulator //
//-------------------------//

ParticleRender.SetCanvas(canvas);

ParticleRender.SetBackgroundColor(0x000000);
ParticleRender.SetParticleSizes(particleSizes);
ParticleRender.SetParticleColors(particleColors);

ParticleRender.SetFieldOfView(75);
ParticleRender.SetNearPlane(1);
ParticleRender.SetFarPlane(100000);
ParticleRender.SetPixelRatio(1);
ParticleRender.SetCameraInitialX(0);
ParticleRender.SetCameraInitialY(100);
ParticleRender.SetCameraInitialZ(2000);

ParticleRender.SetTimestepFunction(function(dt) {
    for (i = 1; i < particleData[props.r].length; i++) {

        //----- Determine new accelerations -----//

        var newA = [];
        newA[dim.x] = 0;
        newA[dim.y] = 0;
        newA[dim.z] = 0;

        var dx = particleData[props.r][i][dim.x] - particleData[props.r][0][dim.x];
        var dy = particleData[props.r][i][dim.y] - particleData[props.r][0][dim.y];
        var dz = particleData[props.r][i][dim.z] - particleData[props.r][0][dim.z];

        var r = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Low and high distance limiting so particles aren't lost to the abyss of floating point arithmetic
        if (r < 100)
            r = 100;
            
        if (r > 200)
            r = 200;

        var factor = -(particleData[props.m][i] / (r * r * r));

        newA[dim.x] += factor * dx;
        newA[dim.y] += factor * dy;
        newA[dim.z] += factor * dz;

        newA[dim.x] = newA[dim.x] * G;
        newA[dim.y] = newA[dim.y] * G;
        newA[dim.z] = newA[dim.z] * G;

        //----- Apply leapfrog timestep -----//

        particleData[props.r][i][dim.x] = particleData[props.r][i][dim.x] + particleData[props.v][i][dim.x] * dt + 0.5 * particleData[props.a][i][dim.x] * dt * dt;
        particleData[props.r][i][dim.y] = particleData[props.r][i][dim.y] + particleData[props.v][i][dim.y] * dt + 0.5 * particleData[props.a][i][dim.y] * dt * dt;
        particleData[props.r][i][dim.z] = particleData[props.r][i][dim.z] + particleData[props.v][i][dim.z] * dt + 0.5 * particleData[props.a][i][dim.z] * dt * dt;

        particleData[props.v][i][dim.x] = particleData[props.v][i][dim.x] + 0.5 * (particleData[props.a][i][dim.x] + newA[dim.x]) * dt;
        particleData[props.v][i][dim.y] = particleData[props.v][i][dim.y] + 0.5 * (particleData[props.a][i][dim.y] + newA[dim.y]) * dt;
        particleData[props.v][i][dim.z] = particleData[props.v][i][dim.z] + 0.5 * (particleData[props.a][i][dim.z] + newA[dim.z]) * dt;
    }

    return particleData[props.r];
});

//------------------//
// Start simulation //
//------------------//

ParticleRender.Start();

//------------------//
// Overlay Controls //
//------------------//

var collapsed = true;

var scriptArea = ace.edit("script-area");
scriptArea.session.setMode("ace/mode/javascript");
scriptArea.setOptions({
    printMarginColumn: false,
    cursorStyle: "slim",
    animatedScroll: true
});

scriptArea.setValue(galaxyExpansion, -1);
scriptArea.clearSelection();

$(document).ready(function() {
    $(".menu-button").click(function(){
        if (collapsed) {
            $("#title-header").fadeOut(100, function() {
                $("#title-header").text("Dynamic Particle Simulator").fadeIn(100);
            });

            $("#script-area").css("display", "block");
            $("#script-area").animate({opacity:1}, 200);

            $(".examples-area").css('display','block')
            $(".examples-area").animate({opacity: 1}, 200);
            
            collapsed = false;
        }
        else {
            $("#title-header").fadeOut(100, function() {
                $("#title-header").text("DPS").fadeIn(100);
            });

            $("#script-area").animate({'opacity':'0'}, 200, function() {
                $("#script-area").css("display", "none");
            });

            $(".examples-area").animate({opacity: 0}, 200, function() {
                $(".examples-area").css('display', 'none');
            });

            collapsed = true;
        }
    }); 

    $("#pause-button").click(function(){
        ParticleRender.StopPhysics();
    });

    $("#start-button").click(function(){
        ParticleRender.StartPhysics();  
    });

    $("#run-button").click(function(){
        jQuery.globalEval(scriptArea.getValue());

        ParticleRender.Reinitialize();
    });

    $('#github-button').click(function() {
        window.open('https://github.com/cppshane/Dynamic-Particle-Simulator','_blank');
    });
});

