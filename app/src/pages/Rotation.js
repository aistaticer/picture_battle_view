import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree , useFrame} from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { createBox } from "../hooks/setObject/setObject";
import bgImage from "../images/sky.jpg";
import skySide from "../images/skyImages/skySide.png";
import skyUp from "../images/skyImages/skyUp.jpg";
import check from "../images/skyImages/check.jpg";
import { Physics, usePlane, useBox, useSphere, Debug } from "@react-three/cannon";
import { KeyboardControls } from "../hooks/userController/userController";
import Model from "../hooks/models/model";



const SceneComponent = () => {

	const posRef = useRef(null);
	const [ballPos, setBallPos] = useState([0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Ball position updated in Scene:", posRef.current);
    }, 500); // 500ms ごとに位置をログ出力

    return () => clearInterval(interval);
  }, []);
	


  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>

			{/* カメラの設置 */}

			<CameraController chasePos={posRef}/>
      
      {/* マウス操作できるカメラ */}
      <OrbitControls />
      
      {/* 照明 */}
			<ambientLight intensity={1.0} />
			<directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      
      

      <Physics gravity={[0, -9.81, 0]}>
				<Debug>
					<Model position={[0, 0, 0]} /> 
					<Ball ballPos={ballPos} setBallPos = {setBallPos} posRef = {posRef}/>
					<Floor />
					<ClickSpawner />
				</Debug>
      </Physics>
    </Canvas>
  );
};

const CameraController = ({ chasePos }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (chasePos.current) {
      camera.position.lerp(
        new THREE.Vector3(
          chasePos.current[0],
          chasePos.current[1] + 5, // 🎯 カメラの高さを調整
          chasePos.current[2] + 5 // 🎯 後ろから追従
					
					//0,0,-30
        ),
        0.001 // 🎯 カメラの追従速度 (0.1 = なめらか)
      );
      camera.lookAt(
        new THREE.Vector3(chasePos.current[0], chasePos.current[1], chasePos.current[2])
      ); // 🎯 追跡対象を見る
    }
  });

  return null; // 🎯 画面に何も描画しない
};


const Floor = () => {
  const [ref] = usePlane(() => ({
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0], // 水平にする
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

const ClickSpawner = () => {
  const { scene, camera } = useThree();
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    const handleClick = (event) => {
      event.stopPropagation();
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // マウス座標を正規化
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // クリック位置にレイキャスト
      raycaster.setFromCamera(mouse, camera);

  		// 仮	想の Z=0 平面（XY 平面）を作る
			const xyPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // 法線が Z 方向で、Z=0 の平面
			const intersectionPoint = new THREE.Vector3();

			// レイが XY 平面（Z=0）と交差するか判定
			if (raycaster.ray.intersectPlane(xyPlane, intersectionPoint)) {
				// Z を 0 に固定
				setObjects((prev) => [
					...prev,
					{ id: Date.now(), position: [intersectionPoint.x, intersectionPoint.y, 0] }]);
			}
		};

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [scene, camera]); // 依存関係を設定

  return (
    <>
      {objects.map((obj) => (
        <Bomb key={obj.id} position={obj.position} />
      ))}
    </>
  );
};


const Bomb = ({ position }) => {
  const [ref, api] = useBox(() => ({
    mass: 0,
    position: position,
		userData: { // 物体にカスタムデータを追加
      type: 'bomb',  // 例えば「爆弾」として設定
    }
  }));

  return (
		<mesh ref={ref}>
    	<boxGeometry args={[1, 1, 1]} />
  	  <meshStandardMaterial color="blue" />
	  </mesh>
  );
};

const Ball = ({ ballPos, setBallPos, posRef }) => {
  const [ref, api] = useSphere(() => ({
    mass: 1, 
    position: [0, 5, 0],
    args: [0.5], 
    onCollide: (e) => {

			const collisionData = e.contact;
      const collidedObject = e.body;

      // 物体のuserDataに格納した文字列をチェック
      if (collidedObject.userData && collidedObject.userData.type === 'bomb') {
        // 「爆弾」に当たった場合、反対方向に飛ばす
        const impulseDirection = [
          collisionData.contactNormal[0] * 10,
          collisionData.contactNormal[1] * 10,
          collisionData.contactNormal[2] * 10,
        ];

        // インパルスを与える
        api.applyImpulse(impulseDirection, [0,0,0]);
			}
		},
  }));

	useEffect(() => {
    const unsubscribe = api.position.subscribe((pos) => {
      posRef.current = [...pos]; // `useRef` に値を保存（親で定期チェック）
    });
		

    return () => unsubscribe();
  }, []);




  return (
    <mesh ref={ref}> {/* 物理ボディを Three.js の mesh に結びつける */}
		<OrbitControls />
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};





const MyComponent = ({ numInstances }) => {
  // インスタンスの位置を設定する配列を生成
  const positions = Array.from({ length: numInstances }, (_, index) => ({
    x: index * 2,
    y: 0,
    z: 0,
  }));

	useEffect(() => {
    console.log("Generated positions:", positions);
  }, [positions]); // positionsが更新されたときにログを出力

  return (
    <group>
      {positions.map((position, index) => (
        <InstancedBlock key={index} position={[position.x, position.y, position.z]} />
      ))}
    </group>
  );
};

const InstancedBlock = ({ position }) => {
  const instancedMeshRef = useRef();

	console.log(position);
	
  const [ref, api] = useBox(() => ({ 
		mass: 0, position: [position[0], 0, 0],
		onCollide: (e) => {
      const body = e.body;

      if (!body.applyImpulse) {
        console.warn("相手の物理ボディが取得できていません:", body);
        return;
      }

      // 衝突したオブジェクトに力を加える
      body.applyImpulse([5, 2, 0], [0, 0, 0]);
    }, 
	})); // 物理演算用

  useEffect(() => {
    if (!instancedMeshRef.current) return;

    const matrix = new THREE.Matrix4();
    api.position.subscribe((pos) => {
      matrix.setPosition(...pos);
      instancedMeshRef.current.setMatrixAt(0, matrix);
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    });
  }, [api]);

  return (
    <instancedMesh
			ref={instancedMeshRef}
			args={[new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: "red" }), 1]}
		/>
	);
}


// 背景の球体を配置
/*function backWorld(scene){
	//背景用の球体を配置
	const texture = new THREE.TextureLoader().load(check);
	const sphereGeometry = new THREE.SphereGeometry(500, 100, 100); // 球体の半径を大きく
	const material = new THREE.MeshBasicMaterial({
		map: texture,
		side: THREE.BackSide, // 球体の内側にテクスチャを貼る
	});
	const sphere = new THREE.Mesh(sphereGeometry, material);
	scene.add(sphere);
}*/

/*function createSingleColoredInstanceWithPhysics(world, scene, blockSize) {
  // ジオメトリとマテリアルを作成
  const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

  // インスタンスを作成
  const instancedMesh = new THREE.InstancedMesh(geometry, material, 1);

  // 色の設定
  const color = new THREE.Color("red"); // 赤色に設定
  const colors = new Float32Array(3); // RGB値を格納
  color.toArray(colors); // 色をRGB配列に変換

  // インスタンスの色を設定
  instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array([255, 0, 0]), 3);
  instancedMesh.instanceColor.needsUpdate = true;

  // インスタンスをシーンに追加
  scene.add(instancedMesh);

  // インスタンスの位置を設定
  const matrix = new THREE.Matrix4();
  matrix.setPosition(1, 0, 0); // インスタンスの位置を(0, 0, 0)に設定
  instancedMesh.setMatrixAt(0, matrix);

  // 物理ボディを作成
  const body = new CANNON.Body({
    mass: 1, // 質量
    position: new CANNON.Vec3(0, 0, 0), // 初期位置
    shape: new CANNON.Box(new CANNON.Vec3(blockSize / 2, blockSize / 2, blockSize / 2)) // 衝突判定用の形状
  });

  // 物理エンジンにボディを追加
  world.addBody(body);

  // 物理演算を使ってインスタンスの位置を更新
  function updatePhysics() {
    instancedMesh.position.copy(body.position);
    instancedMesh.rotation.setFromRotationMatrix(body.rotation);
  }

  return { instancedMesh, body, updatePhysics };
}*/


/*function createLargeBlock(world, scene, blockSize, gridSize) {
  const geometryRed = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
  const geometryBlue = new THREE.BoxGeometry(blockSize, blockSize, blockSize);

  const materialRed = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true }); // 赤
  const materialBlue = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: true }); // 青
  const bodies = [];

  const maxBlocks = (gridSize ** 3) - ((gridSize - 2) ** 3);
  const instancedMeshRed = new THREE.InstancedMesh(geometryRed, materialRed, Math.ceil(maxBlocks / 2)); // 赤用
  const instancedMeshBlue = new THREE.InstancedMesh(geometryBlue, materialBlue, Math.floor(maxBlocks / 2)); // 青用

  let indexRed = 0;
  let indexBlue = 0;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        if (
          x !== 0 && x !== gridSize - 1 &&
          y !== 0 && y !== gridSize - 1 &&
          z !== 0 && z !== gridSize - 1
        ) {
          continue;
        }

        const matrix = new THREE.Matrix4();
        matrix.setPosition(x * blockSize, y * blockSize, z * blockSize);

        if ((x + y + z) % 2 === 0) {
          instancedMeshRed.setMatrixAt(indexRed, matrix);
          indexRed++;

        } else {
          instancedMeshBlue.setMatrixAt(indexBlue, matrix);
          indexBlue++;
        }

        const body = new CANNON.Body({
          mass: 1,
          shape: new CANNON.Box(new CANNON.Vec3(blockSize / 2, blockSize / 2, blockSize / 2)),
          position: new CANNON.Vec3(x * blockSize, y * blockSize + 5, z * blockSize),
        });

        world.addBody(body);
        bodies.push(body);
      }
    }
  }

  // インスタンスの行列を更新
  instancedMeshRed.instanceMatrix.needsUpdate = true;
  instancedMeshBlue.instanceMatrix.needsUpdate = true;

  scene.add(instancedMeshRed);
  scene.add(instancedMeshBlue);

	return { instancedMeshRed, instancedMeshBlue, bodies }
}*/





/*function removeOnClick(scene, camera, renderer, instancedMesh) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(instancedMesh);

    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId; // クリックされたインスタンスのID
      if (instanceId !== undefined) {
        const dummy = new THREE.Object3D();

        // インスタンスを遠くに移動（見えなくする）
        dummy.position.set(9999, 9999, 9999);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(instanceId, dummy.matrix);

        // 色も透明にする（見た目上消えるように）
        const color = new THREE.Color(0x000000);
        instancedMesh.setColorAt(instanceId, color);

        // 更新フラグを立てる
        instancedMesh.instanceMatrix.needsUpdate = true;
        instancedMesh.instanceColor.needsUpdate = true;
      }
    }
  });
}*/



export default SceneComponent;
