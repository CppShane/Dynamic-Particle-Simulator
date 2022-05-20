# Dynamic Particle Simulator
Easily create WebGL based N-body simulations in the browser. Built with <a href="https://www.npmjs.com/package/particle-render">Particle Render</a>.

## How Does It Work?
You just need to call `ParticleRender.SetTimestepFunction(function(dt) { ... });`, where the function you pass in should return an array of positions (in 3d space) given some timestep. Everything else (running time loop, rendering via WebGL, etc.) is handled by the platform!

A sample of all functionality including setting the initial camera angle/zoom and passing a timestep function can be seen in the <a href="https://cppshane.github.io/Dynamic-Particle-Simulator">default configuration</a>.
