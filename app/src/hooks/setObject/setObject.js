import { Canvas } from "@react-three/fiber";
import { Evaluator, Brush, SUBTRACTION } from "three-bvh-csg";
import * as THREE from "three";
import { useRef, useEffect, useState, useLayoutEffect  } from "react";
import { Physics, useTrimesh} from "@react-three/cannon";
import ThreeBSP from 'three-csg';


function DeformMesh() {
  const meshRef = useRef();
  const [geometry, setGeometry] = useState(null);
	const [collisionArgs, setCollisionArgs] = useState([[], []]);

	// コリジョン用のリファレンス
	const [collisionRef] = useTrimesh(() => ({
		args: collisionArgs,
		mass: 1,
	}));

	useLayoutEffect(() => {
		console.log(meshRef.current); // これなら `Mesh` が取得できる可能性が高い
	}, []);

  useEffect(() => {
		console.log(meshRef.current);

    // ベースの立方体（くり抜かれる側）
    const box1 = new Brush(new THREE.BoxGeometry(3, 2, 1));

    // くり抜くための立方体
    const box2 = new Brush(new THREE.BoxGeometry(2, 2, 2));

    // box2 の位置を調整
    const matrix = new THREE.Matrix4().makeTranslation(0, 0, 0.5);
    const rotationMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 8);
    matrix.multiply(rotationMatrix);
    box2.geometry.applyMatrix4(matrix);

    // CSG 操作（box1 から box2 をくり抜く）
    const evaluator = new Evaluator();
    const result = evaluator.evaluate(box1, box2, SUBTRACTION);
		
		setTimeout(() => {
			const r = result.geometry.toNonIndexed();
			
			console.log("Vertices:", r.attributes.position.array);
			console.log("Indices:", r.index ? box2.geometry.index.array : "No index");
		}, 100);
		setGeometry(result.geometry.clone());

		console.log("発生");

		const geometry1 = new THREE.BoxGeometry(1, 1, 1);
		const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		
		// ThreeBSP を使用してジオメトリを操作
		const bsp1 = new ThreeBSP(geometry1);
		const bsp2 = new ThreeBSP(geometry2);
		
		// 差分を取得
		const re = bsp1.subtract(bsp2);  // 差分操作
		const resultGeometry = re.toGeometry();

	}, []);



  const [collisionBind] = useTrimesh(() => ({
    args: [[], []], // 初期値（geometry の計算前）
    mass: 1,
		position: [0,2,0],
		color:"blue"
  }));

  return (
		<>
			<mesh ref={geometry} >
				{geometry && (
					<>
						<primitive object={new THREE.Mesh(geometry)} />
						<meshStandardMaterial color="blue" />
					</>
				)}
			</mesh>


      {/* 物理エンジン用のコリジョン設定 
      <mesh ref={collisionRef} />*/}
		</>
  );
}

function createBox({
  size = [1, 1, 1],
  position = [0, 0, 0],
  color = 'blue',
  wireframe = false
} = {}) {
  // ジオメトリ（形状）
  const geometry = new THREE.BoxGeometry(...size);
  
  // マテリアル（見た目）
  const material = new THREE.MeshStandardMaterial({ color, wireframe });
  
  // メッシュ作成
  const box = new THREE.Mesh(geometry, material);
  
  // 位置設定
  box.position.set(...position);


  return box;
}


export { createBox };
