#!/usr/bin/env python3

from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI(title="SellX Embedding Service")

print("Loading all-MiniLM-L6-v2...")

model = SentenceTransformer("all-MiniLM-L6-v2")

print("all-MiniLM-L6-v2 loaded successfully.")


class EmbeddingRequest(BaseModel):
    text: str


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "model": "all-MiniLM-L6-v2",
        "dimensions": 384
    }


@app.post("/embed")
def generate_embedding(request: EmbeddingRequest):

    embedding = model.encode(
        request.text,
        normalize_embeddings=True
    )

    return {
        "embedding": embedding.tolist(),
        "dimensions": len(embedding),
        "model": "all-MiniLM-L6-v2"
    }