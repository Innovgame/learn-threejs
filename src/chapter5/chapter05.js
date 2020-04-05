/// <reference path="../@types/three.d.ts" />

var Test = (function () {
  function Test() {};

  // 场景
  const scene = new THREE.Scene();
  // 相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  // 渲染使用webgl renderer
  const renderer = new THREE.WebGLRenderer();

  // stats
  const stats = initStats();

  function initStats(type) {
    const panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
    const stats = new Stats();
    stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    return stats;
  };

  window.addEventListener('resize', onResize, false);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  Test.prototype.init = function () {
    // 光源
    const spotLight = new THREE.SpotLight(0xFFFFFF);
    // 位置
    spotLight.position.set(-40, 40, -15);
    // 启动阴影效果
    spotLight.castShadow = true;
    // 控制阴影精细程度
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);

    // renderer
    // 设置场景背景颜色
    renderer.setClearColor(new THREE.Color(0x000000));
    // 设置场景背景尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 渲染阴影效果
    renderer.shadowMap.enabled = true;

    // 向场景中添加 轴
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // 添加平面
    // geometry 几何平面
    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    // material 材质 MeshBasicMaterial基础材质类
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF
    });
    // add mesh
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // 设置plane位置信息 并添加到场景中
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    // 设置接收阴影效果
    plane.receiveShadow = true;
    scene.add(plane);

    // create cube
    // geometry
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    // material
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0x00FF00
    });
    // add mesh
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    // 设置投影阴影效果
    cube.castShadow = true;
    scene.add(cube);

    // create sphere
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777FF
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    // 设置投影阴影效果
    sphere.castShadow = true;
    scene.add(sphere);

    // 设置相机位置 默认是 (0, 0, 0)
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    document.getElementById('webgl-output').appendChild(renderer.domElement);

    // init track controls
    const trackControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    // 产生cube
    const cubeGen = new CubeGenerater(scene);

    // var and func
    var controls = new function () {
      this.rotationSpeed = 0.02;
      this.bouncingSpeed = 0.03;
      this.addCube = function () {
        cubeGen.addCube();
      };

      this.removeCube = function () {
        cubeGen.removeCube();
      };

      this.outputObjects = function () {
        cubeGen.outputObjects();
      }
    };

    function renderScene() {
      rotateCube();
      moveSphere();
      stats.update();
      rotationAllCube();

      trackControls.update(clock.getDelta());
      requestAnimationFrame(renderScene);
      renderer.render(scene, camera);
    };

    function rotationAllCube() {
      scene.traverse(function(obj) {
        if (obj instanceof THREE.Mesh && obj != plane && obj != sphere) {
          obj.rotation.x += controls.rotationSpeed;
          obj.rotation.y += controls.rotationSpeed;
          obj.rotation.z += controls.rotationSpeed;
        }
      });
    };

    function rotateCube() {
      cube.rotation.x += controls.bouncingSpeed;
      cube.rotation.y += controls.bouncingSpeed;
      cube.rotation.z += controls.bouncingSpeed;
    };

    var step = 0;

    function moveSphere() {
      step += controls.rotationSpeed;
      sphere.position.x = 20 + 10 * (Math.cos(step));
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
    };

    function initGUI() {
      var gui = new dat.GUI();
      gui.add(controls, 'rotationSpeed', 0, 0.5);
      gui.add(controls, 'bouncingSpeed', 0, 0.5);
      gui.add(controls, 'addCube');
      gui.add(controls, 'removeCube');
      gui.add(controls, 'outputObjects');
    };

    // start scenes
    initGUI();
    renderScene();
  };

  return Test;
})();

var CubeGenerater = (function () {
  function Generater(scene) {
    this.scene = scene
  };

  Generater.prototype.addCube = function () {
    const cubeSize = Math.ceil(Math.random() * 3);
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.name = 'cube-' + this.scene.children.length;
    cube.position.x = -30 + Math.round(Math.random() * 60);
    cube.position.y = Math.round(Math.random() * 5);
    cube.position.z = -20 + Math.round(Math.random() * 20);

    this.scene.add(cube);
    this.numberOfObjects = this.scene.children.length;
    return cube;
  };

  Generater.prototype.removeCube = function () {
    const allChildren = this.scene.children;
    const lastObj = allChildren[allChildren.length - 1];
    if (lastObj instanceof THREE.Mesh) {
      this.scene.remove(lastObj);
      this.numberOfObjects = this.scene.children.length;
    }
    return lastObj;
  };

  Generater.prototype.outputObjects = function () {
    console.log(this.scene.children);
  };

  return Generater;
})();

const test = new Test();
test.init();