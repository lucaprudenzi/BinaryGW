 ## Gravitational Waves from binary system with Three.js
 This project uses Three.js library to create a real-time simulation of the merger of a binary system that shrinks its orbit emitting gravitational waves. 
 ![Demo](/images/screenshot.png)
 The simulation is far from a realistic representation of the event, but gives an idea of what is happaning. A demo of the project is available [here](https://lucaprudenzi.github.io/BinaryGW/ "Demo"). I noticed that the simulation runs smoothly in Google Chrome and very laggy in Firefox. I don't know the real reason.
 To run localy the projct, it is necessary to start a http server. For example, using Python 3 
```
python -m http 
```
and then open from the localhost address in the browser the folder that contains the project. If you try to open directly the index.html, there are problems with the equirectangular image used for the background.
 The gui panel uses dat.gui. You can change the parameter with the mouse or using this following keyboard configuartion
 
 Key | Change
 --- | ----- 
 1   | M_1 10 solar masses
 2   | M_1 20 solar masses
 3   | M_1 30 solar masses
 5   | M_1 and M_2 50 solar masses
 6   | M_1 and M_2 60 solar masses
 7   | M_1 and M_2 70 solar masses
 8   | M_1 and M_2 80 solar masses
 9   | initial frequency of 9 Hz
 
 0   | reset the initial setup
 a   | rotation anticlockwise
 s   | rotation clockwise
 q   | zoom out
 w   | zoom in
 
 You can also change the point of view using mouse.
 
 
 
