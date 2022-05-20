# Dynamic Particle Simulator
Easily create WebGL based N-body simulations in the browser.

## How Does It Work?
You just need to call `ParticleRender.SetTimestepFunction(function(dt) { ... });`, where the function you pass in should return an array of positions (in 3d space) given some timestep. Everything else (running time loop, rendering via WebGL, etc.) is handled by the platform!
