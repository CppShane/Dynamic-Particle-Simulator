# Dynamic Particle Simulator
Easily create WebGL based N-body simulations in the browser.

![dps-demo](https://user-images.githubusercontent.com/6633831/169607605-40e1c4d3-82df-4975-bbb8-fd2eec910191.gif)
## How Does It Work?
You just need to call `ParticleRender.SetTimestepFunction(function(dt) { ... });`, where the function you pass in should return an array of positions (in 3d space) given some timestep. Everything else (running time loop, rendering via WebGL, etc.) is handled by the platform!

A sample of all functionality including setting the initial camera angle/zoom and passing a timestep function can be seen in the <a href="https://cppshane.github.io/Dynamic-Particle-Simulator">default configuration</a>.
