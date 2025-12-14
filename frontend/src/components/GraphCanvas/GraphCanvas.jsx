import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "./GraphCanvas.css";

function GraphCanvas({ r, points = [], onPointClick }) {
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2());
    const modelRef = useRef(null);
    const planeYZRef = useRef(null);
    const planeXZRef = useRef(null);
    const planeXYRef = useRef(null);
    const animationFrameIdRef = useRef(null);

    const onPointClickRef = useRef(onPointClick);
    useEffect(() => {
        onPointClickRef.current = onPointClick;
    }, [onPointClick]);

    const getCanvasData = (event) => {
        const canvas = canvasRef.current;
        const camera = cameraRef.current;
        if (!canvas || !camera) return null;

        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        const mouse = mouseRef.current;
        mouse.x = (clickX / width) * 2 - 1;
        mouse.y = -(clickY / height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const model = modelRef.current;
        const planeYZ = planeYZRef.current;
        const planeXZ = planeXZRef.current;
        const planeXY = planeXYRef.current;

        const meshes = [];
        if (model) meshes.push(model);
        if (planeYZ) meshes.push(planeYZ);
        if (planeXZ) meshes.push(planeXZ);
        if (planeXY) meshes.push(planeXY);

        const intersects = raycaster.intersectObjects(meshes, true);
        if (!intersects.length) return null;

        const p = intersects[0].point;
        return {
            x: Number(p.x.toFixed(4)),
            y: Number(p.y.toFixed(4)),
            z: Number(p.z.toFixed(4)),
        };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // scene/camera/renderer
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            80,
            canvas.offsetWidth / canvas.offsetHeight,
            0.1,
            1000
        );
        camera.position.set(1.5, 2, 8);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setClearColor(0xffffff, 0);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controlsRef.current = controls;

        // invisible planes for raycasting
        const planeSize = 20;
        const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });

        const planeYZ = new THREE.Mesh(planeGeometry, planeMaterial);
        planeYZ.rotation.y = Math.PI / 2;
        scene.add(planeYZ);
        planeYZRef.current = planeYZ;

        const planeXZ = new THREE.Mesh(planeGeometry, planeMaterial);
        planeXZ.rotation.x = Math.PI / 2;
        scene.add(planeXZ);
        planeXZRef.current = planeXZ;

        const planeXY = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(planeXY);
        planeXYRef.current = planeXY;


        const drawAxesAndLabels = () => {
            const material = new THREE.LineBasicMaterial({ color: 0x2d4057 });

            // x axis
            let pts = [new THREE.Vector3(-6, 0, 0), new THREE.Vector3(6, 0, 0)];
            let geometry = new THREE.BufferGeometry().setFromPoints(pts);
            scene.add(new THREE.Line(geometry, material));

            geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(5.8, 0, -0.2),
                new THREE.Vector3(6, 0, 0),
                new THREE.Vector3(5.8, 0, 0.2),
            ]);
            scene.add(new THREE.Line(geometry, material));

            // y axis
            pts = [new THREE.Vector3(0, -6, 0), new THREE.Vector3(0, 6, 0)];
            geometry = new THREE.BufferGeometry().setFromPoints(pts);
            scene.add(new THREE.Line(geometry, material));

            geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 5.8, -0.2),
                new THREE.Vector3(0, 6, 0),
                new THREE.Vector3(0, 5.8, 0.2),
            ]);
            scene.add(new THREE.Line(geometry, material));

            // z axis
            pts = [new THREE.Vector3(0, 0, -6), new THREE.Vector3(0, 0, 6)];
            geometry = new THREE.BufferGeometry().setFromPoints(pts);
            scene.add(new THREE.Line(geometry, material));

            geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-0.2, 0, 5.8),
                new THREE.Vector3(0, 0, 6),
                new THREE.Vector3(0.2, 0, 5.8),
            ]);
            scene.add(new THREE.Line(geometry, material));

            // ticks
            [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach((val) => {
                geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(val, -0.1, 0),
                    new THREE.Vector3(val, 0.1, 0),
                ]);
                scene.add(new THREE.Line(geometry, material));

                geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-0.1, val, 0),
                    new THREE.Vector3(0.1, val, 0),
                ]);
                scene.add(new THREE.Line(geometry, material));

                geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, -0.1, val),
                    new THREE.Vector3(0, 0.1, val),
                ]);
                scene.add(new THREE.Line(geometry, material));
            });

            // zero sphere
            const zeroSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 32, 32),
                new THREE.MeshBasicMaterial({ color: 0x2d4057 })
            );
            zeroSphere.position.set(0, 0, 0);
            scene.add(zeroSphere);

            // label sprites
            const createTextSprite = (text) => {
                const c = document.createElement("canvas");
                const ctx = c.getContext("2d");
                c.width = 256;
                c.height = 256;

                ctx.clearRect(0, 0, c.width, c.height);
                ctx.font = "96px Helvetica";
                ctx.fillStyle = "#2d4057";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, c.width / 2, c.height / 2);

                const texture = new THREE.CanvasTexture(c);
                const sprite = new THREE.Sprite(
                    new THREE.SpriteMaterial({
                        map: texture,
                        transparent: true,
                        alphaTest: 0.5,
                        depthTest: false,
                        depthWrite: false,
                    })
                );
                sprite.scale.set(1, 1, 1);
                return sprite;
            };

            [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach((x) => {
                const s = createTextSprite(String(x));
                s.position.set(x, -0.3, 0);
                scene.add(s);
            });

            [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach((y) => {
                const s = createTextSprite(String(y));
                s.position.set(0.3, y, 0);
                scene.add(s);
            });

            [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach((zv) => {
                const s = createTextSprite(String(zv));
                s.position.set(0, -0.3, zv);
                scene.add(s);
            });

            const zero = createTextSprite("0");
            zero.position.set(0.3, -0.3, 0);
            scene.add(zero);
        };

        drawAxesAndLabels();

        const loader = new GLTFLoader();
        loader.load(
            "/buttman2.glb",
            (gltf) => {
                const model = gltf.scene;
                modelRef.current = model;

                const shapeMaterial = new THREE.MeshBasicMaterial({
                    color: 0xa341a1,
                    opacity: 0.5,
                    transparent: true,
                    side: THREE.DoubleSide,
                });

                model.traverse((child) => {
                    if (child.isMesh) child.material = shapeMaterial;
                });

                model.rotation.x = -Math.PI / 2;

                const scaleFactor = (1 / 2) * Number(r);
                model.position.set(0, 0, Number(r) / 4);
                model.scale.set(scaleFactor, scaleFactor, scaleFactor);
                scene.add(model);
            },
            undefined,
            (error) => console.error("Ошибка загрузки GLB:", error)
        );

        const handleCanvasDblClick = (event) => {
            const data = getCanvasData(event);
            if (!data) return;
            onPointClickRef.current?.(data);
        };

        canvas.addEventListener("dblclick", handleCanvasDblClick);

        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            canvas.removeEventListener("dblclick", handleCanvasDblClick);

            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

            controls.dispose();
            renderer.dispose();

            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            });

            sceneRef.current = null;
            cameraRef.current = null;
            rendererRef.current = null;
            controlsRef.current = null;
            modelRef.current = null;
        };
    }, []);

    useEffect(() => {
        const model = modelRef.current;
        if (!model) return;

        const currentR = Number(r);
        if (!Number.isFinite(currentR) || currentR <= 0) return;

        const scaleFactor = (1 / 2) * currentR;
        model.position.set(0, 0, currentR / 4);
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }, [r]);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        const oldGroup = scene.getObjectByName("sessionPoints");
        if (oldGroup) scene.remove(oldGroup);

        if (!points || points.length === 0) return;

        const group = new THREE.Group();
        group.name = "sessionPoints";

        points.forEach((p, index) => {
            const geometry = new THREE.SphereGeometry(0.1, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: index === 0 ? (p.hit ? 0x00805a : 0xff0059) : 0x656570,
            });

            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(Number(p.x), Number(p.y), Number(p.z));
            group.add(sphere);
        });

        scene.add(group);
    }, [points]);

    return (
        <div className="graph-cell">
            <canvas ref={canvasRef} id="graphCanvas" width="600" height="600" />
        </div>
    );
}

export default GraphCanvas;
