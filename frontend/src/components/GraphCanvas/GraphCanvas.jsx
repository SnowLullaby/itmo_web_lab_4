import {useEffect, useState} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './GraphCanvas.css';

function GraphCanvas({ r, points = [] }) {
    useEffect(() => {
        let scene, camera, renderer, mouse, planeYZ, planeXZ, planeXY, controls;
        const canvas = document.getElementById('graphCanvas');
        let currentR = r;
        let model;
        let animationFrameId = null;

        function initThreeJS() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(90, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
            renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
            renderer.setClearColor(0xffffff, 0);

            mouse = new THREE.Vector2();

            camera.position.set(1.5, 2, 8);
            camera.lookAt(0, 0, 0);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.1;

            const planeSize = 20;
            const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
            const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });

            planeYZ = new THREE.Mesh(planeGeometry, planeMaterial);
            planeYZ.rotation.y = Math.PI / 2;
            scene.add(planeYZ);

            planeXZ = new THREE.Mesh(planeGeometry, planeMaterial);
            planeXZ.rotation.x = Math.PI / 2;
            scene.add(planeXZ);

            planeXY = new THREE.Mesh(planeGeometry, planeMaterial);
            scene.add(planeXY);

            drawAxesAndLabels();

            const loader = new GLTFLoader();
            loader.load('/buttman2.glb', (gltf) => {
                model = gltf.scene;

                const shapeMaterial = new THREE.MeshBasicMaterial({
                    color: 0xa341a1,
                    opacity: 0.5,
                    transparent: true,
                    side: THREE.DoubleSide
                });

                model.traverse((child) => {
                    if (child.isMesh) {
                        child.material = shapeMaterial;
                    }
                });

                model.rotation.x = -Math.PI / 2;

                const scaleFactor = 1 / 2 * currentR;
                model.position.set(0, 0, currentR / 4);
                model.scale.set(scaleFactor, scaleFactor, scaleFactor);

                scene.add(model);
            }, undefined, (error) => {
                console.error('Ошибка загрузки GLB:', error);
            });

            drawGraph(currentR);

            animate();
        }

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        function drawAxesAndLabels() {
            const material = new THREE.LineBasicMaterial({ color: 0x2d4057 });

            // ось x + стрелки
            let points = [new THREE.Vector3(-6,0, 0), new THREE.Vector3(6, 0, 0)];
            let geometry = new THREE.BufferGeometry().setFromPoints(points);
            const xAxis = new THREE.Line(geometry, material);
            xAxis.renderOrder = 5;
            scene.add(xAxis);

            geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(5.8, 0, -0.2),
                new THREE.Vector3(6, 0, 0),
                new THREE.Vector3(5.8, 0, 0.2)
            ]);
            const xArrowPos = new THREE.Line(geometry, material);
            xArrowPos.renderOrder = 5;
            scene.add(xArrowPos);

            // ось y + стрелки
            points = [new THREE.Vector3(0, -6, 0), new THREE.Vector3(0, 6, 0)];
            geometry = new THREE.BufferGeometry().setFromPoints(points);
            const yAxis = new THREE.Line(geometry, material);
            yAxis.renderOrder = 5;
            scene.add(yAxis);

            geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 5.8, -0.2),
                new THREE.Vector3(0, 6, 0),
                new THREE.Vector3(0, 5.8, 0.2)
            ]);
            const yArrowPos = new THREE.Line(geometry, material);
            yArrowPos.renderOrder = 5;
            scene.add(yArrowPos);

            // ось z + стрелки
            points = [new THREE.Vector3(0, 0, -6), new THREE.Vector3(0, 0, 6)];
            geometry = new THREE.BufferGeometry().setFromPoints(points);
            const zAxis = new THREE.Line(geometry, material);
            zAxis.renderOrder = 5;
            scene.add(zAxis);

            geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-0.2, 0, 5.8),
                new THREE.Vector3(0, 0, 6),
                new THREE.Vector3(0.2, 0, 5.8)
            ]);
            const zArrowPos = new THREE.Line(geometry, material);
            zArrowPos.renderOrder = 5;
            scene.add(zArrowPos);

            // ticks для меток
            [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach(val => {
                geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(val, -0.1, 0),
                    new THREE.Vector3(val, 0.1, 0)
                ]);
                const xTick = new THREE.Line(geometry, material);
                xTick.renderOrder = 5;
                scene.add(xTick);

                geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-0.1, val, 0),
                    new THREE.Vector3(0.1, val, 0)
                ]);
                const yTick = new THREE.Line(geometry, material);
                yTick.renderOrder = 5;
                scene.add(yTick);

                geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, -0.1, val),
                    new THREE.Vector3(0, 0.1, val)
                ]);
                const zTick = new THREE.Line(geometry, material);
                zTick.renderOrder = 5;
                scene.add(zTick);
            });

            // сфера для 0
            const zeroSphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
            const zeroSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x2d4057 });
            const zeroSphere = new THREE.Mesh(zeroSphereGeometry, zeroSphereMaterial);
            zeroSphere.position.set(0, 0, 0);
            zeroSphere.renderOrder = 5;
            scene.add(zeroSphere);

            // текстуры меток
            function createTextSprite(text) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 256;

                context.clearRect(0, 0, canvas.width, canvas.height);

                context.font = '96px Helvetica';
                context.fillStyle = '#2d4057';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(text, canvas.width / 2, canvas.height / 2);

                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    alphaTest: 0.5,
                    depthTest: false,
                    depthWrite: false
                });
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(1, 1, 1);
                sprite.renderOrder = 10;
                return sprite;
            }

            // метки
            [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach(x => {
                const sprite = createTextSprite(x.toString());
                sprite.position.set(x, -0.3, 0);
                scene.add(sprite);
            });

            [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach(y => {
                const sprite = createTextSprite(y.toString());
                sprite.position.set(0.3, y, 0);
                scene.add(sprite);
            });

            [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach(z => {
                const sprite = createTextSprite(z.toString());
                sprite.position.set(0, -0.3, z);
                scene.add(sprite);
            });

            const zeroSprite = createTextSprite('0');
            zeroSprite.position.set(0.3, -0.3, 0);
            scene.add(zeroSprite);
        }

        function drawGraph() {
            drawPointsFromSession();
        }

        function getCanvasData(event) {
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;

            mouse.x = (clickX / width) * 2 - 1;
            mouse.y = -(clickY / height) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const meshes = [model || planeYZ, planeXZ, planeXY];
            let intersects = raycaster.intersectObjects(meshes, true);

            if (intersects.length > 0) {
                const point = intersects[0].point;
                return {
                    x: point.x.toFixed(4),
                    y: point.y.toFixed(4),
                    z: point.z.toFixed(4)
                };
            }
            return null;
        }

        function handleCanvasClick(event) {
            const data = getCanvasData(event);
            if (!data) return;

            document.getElementById('graphForm:graphX').value = data.x;
            document.getElementById('graphForm:graphY').value = data.y;
            document.getElementById('graphForm:graphZ').value = data.z;
            document.getElementById('graphForm:graphR').value = currentR;
            document.getElementById('graphForm:graphSubmit').dispatchEvent(new Event('click'));
        }

        function drawPointsFromSession() {
            const oldGroup = scene.getObjectByName('sessionPoints');
            if (oldGroup) {
                scene.remove(oldGroup);
            }

            if (points.length === 0) return;

            const pointsGroup = new THREE.Group();
            pointsGroup.name = 'sessionPoints';

            points.forEach((point, index) => {
                const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                const material = new THREE.MeshBasicMaterial({
                    color: index === 0
                        ? (point.hit ? 0x00805a : 0xff0059)
                        : 0x656570
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(point.x, point.y, point.z);
                pointsGroup.add(sphere);
            });

            scene.add(pointsGroup);
        }

        initThreeJS();
        canvas.addEventListener('dblclick', handleCanvasClick);

        return () => {
            canvas.removeEventListener('click', handleCanvasClick);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            controls.dispose();
            renderer.dispose();
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            });
            if (model) scene.remove(model);
        };
    }, [r, points]);

    return (
        <div className="graph-cell">
            <canvas id="graphCanvas" width="500" height="500"></canvas>
        </div>
    );
}

export default GraphCanvas;
