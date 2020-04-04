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
    renderScene();

    function renderScene() {
      rotateCube();
      moveSphere();
      stats.update();

      requestAnimationFrame(renderScene);
      renderer.render(scene, camera);
    };

    function rotateCube() {
      cube.rotation.x += 0.02;
      cube.rotation.y += 0.02;
      cube.rotation.z += 0.02;
    };

    var step = 0;
    function moveSphere() {
      step += 0.04;
      sphere.position.x = 20 + 10 * (Math.cos(step));
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
    };
  };

  return Test;
})();

const test = new Test();
test.init();