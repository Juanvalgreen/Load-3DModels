/*
Author: Juan Valverde
Date of creation: 11 August/2022
last Modification: 22 sep/2022 11:18am*/

//All elements that i can create of Three js
console.log(THREE);

//Var: puede declarar sin necesidad de inicializar GLOBAL
//let: Pueden declarar sin necesidad de inicializar LUGAR NO GLOBAL
//const: Declarar con valor

// my principal elements: scene, camera, render, controls


var scene=null, camera=null, renderer=null, controls=null, pointLight=null, modPlayer=null,stats=null;

 

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function start(){
    
    initScene();
    createUI();
    animate();


}
 
function initScene(){
    // scene, camera, render
    //create scene
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0x0b7a85);
    //create camera
    camera= new THREE.PerspectiveCamera(75, //FOV field of view
                                        window.innerWidth / window.innerHeight, //aspect
                                        0.1, //near
                                        100); //far 
    //To render 
    const canvas= document.querySelector('.webgl'); //call canvas of html
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    //add elements
    scene.add(camera);

    //Controls
    controls= new THREE.OrbitControls( camera, renderer.domElement );
    camera.position.set(6,7,2);
    controls.update();
    //grid  
    const size = 10;
    const divisions = 100;

    const gridHelper = new THREE.GridHelper( size, divisions,0x000,0xffffff);
    scene.add( gridHelper );

    window.addEventListener( 'resize', onWindowResize, false );

    //statics
    const container=document.querySelector('#container')
    stats=new Stats();
    container.appendChild(stats.domElement);

    //ligths

    const light= new THREE.AmbientLight(0x404040,1); //Soft white ligth
    scene.add(light);

    pointLight = new THREE.PointLight( 0xedbe24, 3, 100 ); pointLight.position.set( 0, 5, 0 );
    scene.add( pointLight );

    const sphereSize = 0.5;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    scene.add( pointLightHelper );

    //to load island
    var generalPathI="../src/models/obj/isla/";
    var fileObjI="island v.2.obj";
    var fileMtlI="island v.2.mtl";


    //load scenery
    
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPathI);
    mtlLoader.setPath(generalPathI);
    mtlLoader.load(fileMtlI, function(materials) {
        materials.preload();
        
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPathI);
        objLoader.load(fileObjI,function(object){
            object.position.set(-5,-2,5);
            object.scale.set(1,1,1)
            scene.add(object);
        }); 
    });

    // to load Cerdito
    //var generalPathC="../src/models/obj/cerdito/";
    //var fileObjC="personaje.vox.obj";
    //var fileMtlC="personaje.vox.mtl";

    // to load character and mtl of OBJ fiile extension
    
    
    // var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setTexturePath(generalPathC);
    // mtlLoader.setPath(generalPathC);
    // mtlLoader.load(fileMtlC, function(materials) {
    //     materials.preload();
        
    //     var objLoader = new THREE.OBJLoader();
    //     objLoader.setMaterials(materials);
    //     objLoader.setPath(generalPathC);
    //     objLoader.load(fileObjC,function(object){
    //         object.position.set(-2.5,1.9,3);
    //         object.scale.set(0.2,0.2,0.2)
    //         scene.add(object);
    //     }); 
    // });

    loadModel_objAndMtl("./src/models/obj/personaje/Robot/","Robot",true);


    


    
}

function loadModel_objAndMtl(PathGeneralFolder, pahtFile, show) {


    if (show == true) {
        var mtlLoader2 = new THREE.MTLLoader();
        mtlLoader2.setTexturePath(PathGeneralFolder);
        mtlLoader2.setPath(PathGeneralFolder);
        mtlLoader2.load(pahtFile+".mtl", function (materials) {
            materials.preload();

            var objLoader2 = new THREE.OBJLoader();
            objLoader2.setMaterials(materials);
            objLoader2.setPath(PathGeneralFolder);
            objLoader2.load(pahtFile+".obj", function (object) {
                //
                object.position.set(-2.5,1.9,3);
                object.scale.set(0.2,0.2,0.2);
                //

                if (pahtFile == "Luigi"){
                    object.scale.set(0.01,0.01,0.01);

                }
                if (pahtFile == "Mario"){
                    object.scale.set(0.01,0.01,0.01);
                    

                }
                if (pahtFile == "Robot"){
                    object.scale.set(0.3,0.3,0.3);
                    

                }
                modPlayer = object; //
                scene.add(object);
            });
        });
        

    }

}

function loadGLTF(){
    const loader = new THREE.GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( './src/models/gltf' );
    loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    loader.load(
        // resource URL
        './src/models/gltf/Duck.gltf',
        // called when the resource is loaded
        function ( gltf ) {

            scene.add( gltf.scene );
            gltf.scene.position.set(0,1.8,0);
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}



function createUI(){

    var gui = new dat.GUI();
    var param= {
        a: "OBJ/MTL",
        b: "#ff00ff",
        c: "Idle",
        d: true,
        e: "voxel Player",
        f: 1,
        g: "ninguno"
    };

    //var typeGeometry = g.add(param,'a',["OBJ/MTL","FBX","GLTF"]).name("3D Type File");

    //folder obj/mtl
    var g=gui.addFolder('Geometry Selector OBJ/MTL');
    var myPlayer=g.add(param,'e',["Robot","cerdito","Luigi","Mario"]).name("Player");
    var ShowPlayer = g.add(param,'d',"Show_Model");

    //folder fbx

    var f=gui.addFolder('Geometry Selector FBX');
    var animationMOdel=f.add(param,'c',["Idle","Run","Jump"]).name("Animation Player");


    //folder gltf
    var h=gui.addFolder('Geometry Selector GLTX');
    var typeGLTF=h.add(param,'g',["niguno","Pato","Tiburon"]).name("Player");



    typeGLTF.onChange(function (object) {
        loadGLTF();
        
    });





    gui.addFolder('Animation').add(param,'c',["Idle","Run","Jump"]).name("Animation Player");

    var c=gui.addFolder('Ligth');
    var ColorGuiLight=c.addColor(param,'b').name("Color Selector");
    var colorIntensity=c.add(param,'f').min(0).max(10).step(0.1).name("Intesity Ligth");

    //change intensity Color
    ColorGuiLight.onChange(function (colorGet) {
        console.log('change color:'+colorGet);
        pointLight.color.setHex(Number(colorGet.toString().replace('#','0x')));
    });

    //Change intensity light
    colorIntensity.onChange(function(intensityGet){
        pointLight.intensity = intensityGet;

    });

    ShowPlayer.onChange(function (params) {
        if(params == false) {
            scene.remove(modPlayer);

        }else{
            scene.add(modPlayer);
        }

    });


    myPlayer.onChange(function (params) {
        //saca los valores de cerdito,luigi, mario
        scene.remove(modPlayer);
        
        loadModel_objAndMtl("./src/models/obj/personaje/"+params+"/" , params , true);
    });

    

    
}





function animate(){
    requestAnimationFrame( animate );
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // cube1.rotation.x -= 0.01;
    // cube1.rotation.y -= 0.01;
    // cube.position.x =3;
    // cube1.position.x=-3;
    // cube.position.y=2;
    // cube1.position.y=2;
    
    controls.update();
    renderer.render(scene,camera);
    stats.update();
}

