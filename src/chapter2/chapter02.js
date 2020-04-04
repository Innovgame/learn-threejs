/// <reference path="../@types/three.d.ts" />

var Test = (function () {
  function Test() {};

  Test.prototype.init = function () {
    // 场景
    const scene = new THREE.Scene();

    // 相机
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 渲染使用webgl renderer
    const renderer = new THREE.WebGLRenderer();
    // 设置场景背景颜色
    renderer.setClearColor(new THREE.Color(0x000000));
    // 设置场景背景尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 向场景中添加 轴
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // 添加平面
    // geometry 几何平面
    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    // material 材质 MeshBasicMaterial基础材质类
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xAAAAAA
    });
    // add mesh
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // 设置plane位置信息 并添加到场景中
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    scene.add(plane);

    // create cube
    // geometry
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    // material
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00FF00,
      wireframe: true
    });
    // add mesh
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    scene.add(cube);

    // create sphere
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x7777FF,
      wireframe: true
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    scene.add(sphere);

    // 设置相机位置 默认是 (0, 0, 0)
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    document.getElementById('webgl-output').appendChild(renderer.domElement);
    renderer.render(scene, camera);
  };
  return Test;
})();

const test = new Test();
test.init();