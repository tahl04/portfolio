(function() {
    
    var App,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
    
    window.App = (function() {
    App.prototype.canvasGL = null;
    
    App.prototype.container = null;
    
    App.prototype.scene = null;
    
    App.prototype.camera = null;
    
    App.prototype.renderer = null;
    
    App.prototype.geometry = null;
    
    App.prototype.material = null;
    
    App.prototype.mesh = null;
    
    App.prototype.gui = null;
    
    App.prototype.terrain = null;
    
    App.prototype.composer = null;
    
    App.prototype.render_pass = null;
    
    App.prototype.fxaa_pass = null;
    
    App.prototype.posteffect = false;
    
    App.prototype.meteo = null;
    
    App.prototype.skybox = null;
    
    function App() {
    this.resize = bind(this.resize, this);
    this.renderScene = bind(this.renderScene, this);
    this.update = bind(this.update, this);
    this.init = bind(this.init, this);
    var fb, lin, plus, twt;
    fb = document.getElementById('facebook');
    twt = document.getElementById('twitter');
    lin = document.getElementById('linkedin');
    plus = document.getElementById('plus');
    }
    
    WindowResize	= function(renderer, camera){
    var callback	= function(){
        // notify the renderer of the size change
    var width = $('#experience').innerWidth();
    var height = $('#experience').innerHeight();
    console.log(width,height);
        renderer.setSize( width, height );
        // update the camera
        camera.aspect	= width/ height;
        camera.updateProjectionMatrix();
    }
    // bind the resize event
    window.addEventListener('resize', callback, false);
    // return .stop() the function to stop watching window resize
    return {
        /**
         * Stop watching window resize
        */
        stop	: function(){
            window.removeEventListener('resize', callback);
        }
    };
    }
    App.prototype.init = function() {
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);
    console.log(this.camera);
    this.camera.position.z = 7;
    this.camera.position.y = 1;
    this.renderer = new THREE.WebGLRenderer({
        width: window.innerWidth,
        height: window.innerHeight,
        scale: 1,
        antialias: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container = document.createElement('div');
    this.container.id = 'canvasGL';
    this.container.appendChild(this.renderer.domElement);
    this.camera.lookAt(new THREE.Vector3());
    document.getElementById('experience').appendChild(this.container);
    this.terrain = new Terrain(this.scene);
    this.scene.add(this.terrain.plane_mesh);
    WindowResize(this.renderer,this.camera);
    return this.update();
    };
    
    App.prototype.update = function() {
    requestAnimationFrame(this.update);
    this.terrain.update();
    return this.renderScene();
    };
    
    App.prototype.renderScene = function() {
    return this.renderer.render(this.scene, this.camera);
    };
    
    App.prototype.resize = function(stageWidth, stageHeight) {
    this.camera.aspect = stageWidth / stageHeight;
    this.camera.updateProjectionMatrix();
    return this.renderer.setSize(stageWidth, stageHeight);
    };
    
    return App;
    
    })();
    
    window.Terrain = (function() {
        Terrain.prototype.uniforms = null;
        
        Terrain.prototype.plane_mesh = null;
        
        Terrain.prototype.plane_geometry = null;
        
        Terrain.prototype.groundMaterial = null;
        
        Terrain.prototype.clock = new THREE.Clock(true);
        
        Terrain.prototype.options = {
        elevation: 1,
        noise_range: 2.14,
        sombrero_amplitude: 0.6,
        sombrero_frequency: 10.0,
        speed: 0.4,
        segments: 324,
        wireframe_color: '#5E85EB',
        perlin_passes: 1,
        wireframe: true,
        floor_visible: true
    };
    
        Terrain.prototype.scene = null;
        
        function Terrain(scene) {
            this.update = bind(this.update, this);
            this.buildPlanes = bind(this.buildPlanes, this);
            this.init = bind(this.init, this);
            this.scene = scene;
            this.init();
        }
    
    Terrain.prototype.init = function() {
        this.uniforms = {
            time: {
            type: "f",
            value: 0.0
            },
            speed: {
            type: "f",
            value: this.options.speed
            },
            elevation: {
            type: "f",
            value: this.options.elevation
            },
            noise_range: {
            type: "f",
            value: this.options.noise_range
            },
            offset: {
            type: "f",
            value: this.options.elevation
            },
            perlin_passes: {
            type: "f",
            value: this.options.perlin_passes
            },
            sombrero_amplitude: {
            type: "f",
            value: this.options.sombrero_amplitude
            },
            sombrero_frequency: {
            type: "f",
            value: this.options.sombrero_frequency
            },
            line_color: {
            type: "c",
            value: new THREE.Color(this.options.wireframe_color)
            }
        };
        return this.buildPlanes(this.options.segments);
    };
    
    Terrain.prototype.buildPlanes = function(segments) {
        this.plane_geometry = new THREE.PlaneBufferGeometry(20, 20, segments, segments);
        this.plane_material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('shader-vertex-terrain-perlinsombrero').textContent,
        fragmentShader: document.getElementById('shader-fragment-terrain').textContent,
        wireframe: this.options.wireframe,
        wireframeLinewidth: 1,
        transparent: true,
        uniforms: this.uniforms
        
    
        
    });
    this.groundMaterial = new THREE.MeshPhongMaterial({
        
        ambient: 0xffffff,
        color: 0xffffff,
        specular: 0x121313
    });
    this.materials = [this.groundMaterial, this.plane_material];
    this.plane_mesh = THREE.SceneUtils.createMultiMaterialObject(this.plane_geometry, this.materials);
    this.plane_mesh.rotation.x = -Math.PI / 2;
    return this.plane_mesh.position.y = -0.5;
    };
    
    Terrain.prototype.update = function() {
        return this.plane_material.uniforms['time'].value = this.clock.getElapsedTime();
    };
    
        return Terrain;
    
    })();
    App = new window.App();
    App.init();
    
}).call(this);