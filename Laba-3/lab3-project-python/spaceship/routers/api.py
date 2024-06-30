from fastapi import APIRouter, HTTPException
import numpy as np

router = APIRouter()


@router.get('')
def hello_world() -> dict:
    return {'msg': 'Hello, World!'}


@router.get("/matrices")
def get_matrices():
    try:
        matrix_a = np.random.rand(10, 10)
        matrix_b = np.random.rand(10, 10)
        product = np.dot(matrix_a, matrix_b)

        return {
            "matrix_a": matrix_a.tolist(),
            "matrix_b": matrix_b.tolist(),
            "product": product.tolist(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
