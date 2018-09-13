var renderer, scene, camera;
var controls, camera_control, axes;
var sphere1, sphere2;
var plane;

var t=0; // time
var angle;
var f_i=10;
var time_speed=1;
var old_major_ax;
var radius_camera;

//Constants
m_sun=2*Math.pow(10,33);
c=3*Math.pow(10,10);
G=6.67*Math.pow(10,-8);
// 5 degrees
theta = 0.0872222222;

// Mass variables
var M1_new;
var M2_new;

// Time variables
var time_new;
var clock = new THREE.Clock();
var time_subtract;

init();
 
animate();

function init() {
        
	// info
	info=document.getElementById('space2');
    
	//info.style.width = '1920px';
	//info.style.height = '10800px';

	// WebGL renderer
	renderer = new THREE.WebGLRenderer();
	// Attach the rendering to html
	renderer.setSize(window.innerWidth, window.innerHeight);
	info.appendChild(renderer.domElement);

	// SCENE
	scene = new THREE.Scene();

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 10000 );
	camera.position.set( 30, 30, 80 );
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

	// CAMERA CONTROLS
	camera_control = new THREE.OrbitControls(camera);
	camera_control.minDistance = 5;
	camera_control.maxDistance = 800;

	// GUI
	controls = new function(){
		this.Mass1=40;
		this.Mass2=40;
		this.time_speed=0.1;
		this.initialFreq=10;
		this.observedDistance=440;
        //this.externalControl=20;
	};
    
    
	var gui = new dat.GUI();
	gui.add(controls, 'Mass1',1,100).listen();
	gui.add(controls, 'Mass2',1,100).listen();
	gui.add(controls, 'time_speed',0.01,1);
	//howSlow_control=gui.add(controls, 'howSlow',1,10);
	gui.add(controls, 'initialFreq', 5,50).listen();
	gui.add(controls, 'observedDistance',100,500).listen();
    //gui.add(controls, 'externalControl',0,100).listen();

	// AXES
	axes = buildAxes(100);
	scene.add(axes);

	// SPHERE
	var geometry = new THREE.SphereGeometry(1, 20, 20, 1, Math.PI * 2, 0, Math.PI * 2);
	var material = new THREE.MeshNormalMaterial();
	sphere1 = new THREE.Mesh( geometry, material);
	sphere2 = new THREE.Mesh( geometry, material);
    sphere3 = new THREE.Mesh( geometry, material);
	scene.add(sphere1);
	scene.add(sphere2);

	// PLANE
	var planeGeometry = new THREE.PlaneGeometry(800, 800, 300, 300);
	var planeMaterial = new THREE.MeshNormalMaterial({color: 0x45BEBF, wireframe: true});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = 0.5*Math.PI;
	plane.position.set(0, 0, 0);
	scene.add(plane);

    // BACKGROUND
    var pano;
    var loader = new THREE.TextureLoader();
	loader.load('images/equi-gal3.jpg', onTextureLoaded);
	function onTextureLoaded(texture) {
	  var geometry = new THREE.SphereGeometry(1000, 32, 32);
	  var material = new THREE.MeshBasicMaterial({
	    map: texture,
	    side: THREE.BackSide
	  });
	  pano = new THREE.Mesh(geometry, material);
	  pano.position.y = 0;
	  scene.add(pano);
	}
	

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        if (keyCode == 49) { // 1
            controls.Mass1 = 40;
	    controls.Mass2 = 40;
        } else if (keyCode == 50) { // 2
            controls.Mass1 = 70;
	    controls.Mass2 = 70
        } else if (keyCode == 51) { // 3
            controls.Mass1 = 90;
	    controls.Mass2 = 90;
        } else if (keyCode == 53) { // 5
            controls.Mass1 = 20;
            controls.Mass2 = 30;
        } else if (keyCode == 54) { // 6
            controls.Mass1 = 20;
            controls.Mass2 = 60;
        } else if (keyCode == 55) { // 7
            controls.Mass1 = 20;
            controls.Mass2 = 100;
        } else if (keyCode == 56) { // 8
            controls.Mass1 = 90;
            controls.Mass2 = 50;
        } else if (keyCode == 57) { // 9
            controls.initialFreq = 20;
        } else if (keyCode == 48) { // 0
            controls.Mass1 = 40;
            controls.Mass2 = 40;
            controls.initialFreq = 10;
            camera.position.x = 30;
            camera.position.y = 30;
            camera.position.z = 80;
            camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
        } else if (keyCode == 65) { // a
            // Use rotation matrix, thanks Uly
            camera_position_x_old = camera.position.x;
            camera_position_z_old = camera.position.z;
            camera.position.x = camera_position_x_old*Math.cos( theta )+camera_position_z_old*Math.sin( theta );
            camera.position.z = -camera_position_x_old*Math.sin( theta )+camera_position_z_old*Math.cos( theta );
        } else if (keyCode == 83) { // s
            camera_position_x_old = camera.position.x;
            camera_position_z_old = camera.position.z;
            camera.position.x = camera_position_x_old*Math.cos( theta )-camera_position_z_old*Math.sin( theta );
            camera.position.z = camera_position_x_old*Math.sin( theta )+camera_position_z_old*Math.cos( theta );
        } else if (keyCode == 90) { // z up and down the plane
            // Use rotation matrix, thanks Uly
            camera_position_y_old = camera.position.y;
            camera_position_z_old = camera.position.z;
            camera.position.y = camera_position_y_old*Math.cos( theta )+camera_position_z_old*Math.sin( theta );
            camera.position.z = -camera_position_y_old*Math.sin( theta )+camera_position_z_old*Math.cos( theta );
        } else if (keyCode == 88) { // x
            camera_position_y_old = camera.position.y;
            camera_position_z_old = camera.position.z;
            camera.position.y = camera_position_y_old*Math.cos( theta )-camera_position_z_old*Math.sin( theta );
            camera.position.z = camera_position_y_old*Math.sin( theta )+camera_position_z_old*Math.cos( theta );
        } else if (keyCode == 81) { // q zoom out
            camera.position.x = camera.position.x*1.1;
            camera.position.y = camera.position.y*1.1;
            camera.position.z = camera.position.z*1.1;
        }
        else if (keyCode == 87) { // w zoom in
            camera.position.x = camera.position.x/1.1;
            camera.position.y = camera.position.y/1.1;
            camera.position.z = camera.position.z/1.1;
        }
    };
	
	function buildAxes(length) {
		var axes = new THREE.Object3D();

		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

		return axes;
	}

	function buildAxis( src, dst, colorHex, dashed ) {
		var geom = new THREE.Geometry(),
			mat;

		if(dashed) {
			mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
		} else {
			mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
		}

		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );
		geom.computeLineDistances(); // important

		var axis = new THREE.Line( geom, mat, THREE.LineSegments );

		return axis;
	}
}

function animate(time) {
	requestAnimationFrame(animate);

    //ensure that the clock is started
    if (isNaN(time)){
  		time=0;
	}
	
	//Mass update with new data from slider
	nu=controls.Mass1*controls.Mass2/(Math.pow(controls.Mass1+controls.Mass2,2));
	M_c=Math.pow(nu,3/5)*m_sun*(controls.Mass1+controls.Mass2);

	//Data from slider
	M_c_pass=M_c;
	M1_pass=controls.Mass1;
	M2_pass=controls.Mass2;
	nu_pass=nu;
	freq_pass=controls.initialFreq;
	obsDist=controls.observedDistance;
    
    if (M1_new != M1_pass || M2_new != M2_pass){
        time_subtract = clock.getElapsedTime();
        time_new = 0.01;
    }
    
    
	//Time update
	time_new = clock.getElapsedTime() - time_subtract;

	t_coal=5/(256*Math.pow(Math.PI,8/3))*Math.pow(Math.pow(c,3)/(G*m_sun*(controls.Mass1+controls.Mass2)),5/3)/(nu*Math.pow(controls.initialFreq,8/3));
	//t=(time/1000*controls.time_speed)%t_coal;
    t=(time_new*controls.time_speed);

    
    //Parameters of the orbits
    semi_major_axis=Math.pow(c,2)/(2*G*25*m_sun)*Math.pow(G*m_sun*(controls.Mass1+controls.Mass2)/Math.pow(controls.initialFreq*2*Math.PI,2),1/3);
	major_axis=2*semi_major_axis;
    
	//Initial positions of the two mass
    start1=major_axis*controls.Mass2/(controls.Mass1+controls.Mass2);
	start2=major_axis*controls.Mass1/(controls.Mass1+controls.Mass2);
    
    // variable needed in if and else
    var f; // frequency
    var magnitude; // amplitude without 1/r dependence
    var center0 = new THREE.Vector2(0,0); // center of the system
    var size = 5; 
    var vLength = plane.geometry.vertices.length; // number of vertices
    var max_magnitude; // magnitude for final wave after merger
    var max_f; // frequency for final wave after merger
    var time_limit=0.04; // switch to else in time_limit before coalescence 

	
    //Update the radius of inspiral
    if (t_coal-t>time_limit){
        scene.add(sphere1);
        scene.add(sphere2);
        scene.remove(sphere3);
		new_radius1=start1*Math.pow(1-t/t_coal,1/4);
		new_radius2=start2*Math.pow(1-t/t_coal,1/4);
        
        // 2*pi*freuquency*tau = new angle
		new_angle=Math.pow(5*G*M_c/Math.pow(c,3),-5/8)*Math.pow(t_coal-t,5/8);
        f=Math.pow(G*M_c/Math.pow(c,3),-5/8)/Math.PI*Math.pow(5/256/(t_coal-t),3/8);

		sphere2.position.set(-new_radius2*Math.cos(new_angle),0,new_radius2*Math.sin(new_angle));
		sphere1.position.set(+new_radius1*Math.cos(new_angle),0,-new_radius1*Math.sin(new_angle));
        
        //Spin of the mass
        //sphere1.rotation.y+=0.1;
        //sphere2.rotation.y+=0.1;
        
        //Sphere radius update
        sphere1.scale.x=controls.Mass1/25;
        sphere1.scale.y=controls.Mass1/25;
        sphere1.scale.z=controls.Mass1/25;
        sphere2.scale.x=controls.Mass2/25;
        sphere2.scale.y=controls.Mass2/25;
        sphere2.scale.z=controls.Mass2/25;

        //Distance update
        old_major_ax=controls.major_ax;
        //wave freq
        // H plus MAGNITUDE (X2000)
        magnitude=2000*Math.pow(G*M_c/Math.pow(c,2),5/4)*Math.pow(5/(t_coal-t)/c,1/4)/(2*G*25*m_sun/c/c);

        // WAVE UPDATE     
        for (var i = 0; i < vLength; i++) {
            var v = plane.geometry.vertices[i];
            //var dist1 = new THREE.Vector2(v.x, v.y).sub(center1).add(new THREE.Vector2(0.001,0.001));
            //var dist2 = new THREE.Vector2(v.x, v.y).sub(center2).add(new THREE.Vector2(0.001,0.001));
            var dist0 = new THREE.Vector2(v.x, v.y).sub(center0).add(new THREE.Vector2(0.001,0.001));

            if (dist0.length()<(1.1*start1+1.1*start2)){
                v.z=0;
                if ((Math.pow(-new_radius2*Math.cos(new_angle)-v.x,2)+Math.pow(new_radius2*Math.sin(new_angle)-v.y,2))<500){
                    v.z=500/Math.pow(Math.pow(-new_radius2*Math.cos(new_angle)-v.x,2)+Math.pow(new_radius2*Math.sin(new_angle)-v.y,2),2);
                    //console.log(v.z)
                    if (v.z>2*M2_pass){
                        v.z=2*M2_pass;
                    }
                }
                if ((Math.pow(+new_radius1*Math.cos(new_angle)-v.x,2)+Math.pow(-new_radius1*Math.sin(new_angle)-v.y,2))<500){
                    v.z=500/Math.pow(Math.pow(new_radius1*Math.cos(new_angle)-v.x,2)+Math.pow(-new_radius1*Math.sin(new_angle)-v.y,2),2);
                    //console.log(v.z)
                    if (v.z>2*M1_pass){
                        v.z=2*M1_pass;
                    }
                }
            }
            else{
                //v.z=magnitude/dist0.length()*Math.cos(dist0.length()/size+new_angle);
                v.z=magnitude/dist0.length()*Math.cos(2*Math.PI*f*(t_coal-t)+dist0.length()/size);
            }
            
        }
        
    }
	else{
        // quantities for final gw wave after merger
        max_magnitude=2000*Math.pow(G*M_c/Math.pow(c,2),5/4)*Math.pow(5/(time_limit)/c,1/4)/(2*G*25*m_sun/c/c);
        max_f=Math.pow(G*M_c/Math.pow(c,3),-5/8)/Math.PI*Math.pow(5/256/(time_limit),3/8);
        // remove sphere1 and sphere2 and show final object
        scene.remove(sphere1);
        scene.remove(sphere2);
        scene.add(sphere3);
        sphere3.scale.x=(controls.Mass1+controls.Mass2)/25;
        sphere3.scale.y=(controls.Mass1+controls.Mass2)/25;
        sphere3.scale.z=(controls.Mass1+controls.Mass2)/25;
        sphere3.position.set(0,0,0);
        
        // expansion of flat surface and propagation of final gw wave with final properties
        for (var i = 0; i < vLength; i++) {
            var v = plane.geometry.vertices[i];
            var dist0 = new THREE.Vector2(v.x, v.y).sub(center0).add(new THREE.Vector2(0.001,0.001));
            
            if (dist0.length()<30){
            //        v.z=100/dist0.length();
                v.z=0;
                v.z=2/dist0.length();
                
            }
                    //console.log(v.z)
                    
            //}
            if (dist0.length()<(0.9*start1+0.9*start2+(t-t_coal)*max_f*30)){
                v.z=500/dist0.length();
                if (v.z>2*(M1_pass+M2_pass)){
                    v.z=2*(M1_pass+M2_pass);
                }

                
            }
            if (dist0.length()>(1.1*start1+1.1*start2+(t-t_coal)*max_f*30)){
                v.z=max_magnitude/dist0.length()*Math.cos(2*Math.PI*max_f*(t_coal-t)+dist0.length()/size);
            }
            
            
            
            
        }
	
    }
    
    M1_new=controls.Mass1;
	M2_new=controls.Mass2;
    
	//Update everything
	camera_control.update();
	plane.geometry.verticesNeedUpdate = true;
	renderer.render(scene, camera );
    
    
}
