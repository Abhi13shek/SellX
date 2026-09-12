#!/usr/bin/env python3
"""
Generate and export 384-dimensional all-MiniLM-L6-v2 embeddings
for all products in the SellX database.
"""

import os
import json
import numpy as np
from sentence_transformers import SentenceTransformer


def build_product_text(product):
    """
    Convert the important product information into one text string
    that will be converted into an embedding.
    """

    highlights = ", ".join(product.get("highlights", []))
    includes = ", ".join(product.get("includes", []))

    text = f"""
Product name: {product.get("name", "")}
Category: {product.get("category", "")}
Description: {product.get("description", "")}
Highlights: {highlights}
Condition: {product.get("condition", "")}
City: {product.get("city", "")}
Locality: {product.get("locality", "")}
Includes: {includes}
"""

    return " ".join(text.split())


def main():

    # Locate db.json
    db_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "server",
        "data_storage",
        "db.json"
    )

    # Output file
    output_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "server",
        "data_storage",
        "product_embeddings.json"
    )

    # Check database exists
    if not os.path.exists(db_path):
        print(f"Error: db.json not found at {db_path}")
        return

    # Load database
    with open(db_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    products = data.get("products", [])

    print(f"Found {len(products)} products in db.json.")

    if not products:
        print("No products found.")
        return

    # Load MiniLM
    print("Loading all-MiniLM-L6-v2...")

    model = SentenceTransformer("all-MiniLM-L6-v2")

    print("Model loaded successfully.")

    # Prepare product text
    product_texts = [
        build_product_text(product)
        for product in products
    ]

    # Generate embeddings
    print("Generating embeddings...")

    embeddings = model.encode(
        product_texts,
        show_progress_bar=True,
        normalize_embeddings=True
    )

    print(f"Generated embeddings with shape: {embeddings.shape}")

    # Convert numpy arrays to normal Python lists
    embedding_list = embeddings.tolist()

    # Create output data
    output = []

    for product, text, embedding in zip(
        products,
        product_texts,
        embedding_list
    ):
        output.append({
            "productId": product.get("id"),
            "text": text,
            "embedding": embedding
        })

    # Save embeddings
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f)

    print()
    print("========================================")
    print("Embedding generation completed!")
    print("========================================")
    print(f"Products processed: {len(products)}")
    print(f"Embedding dimensions: {embeddings.shape[1]}")
    print(f"Saved to: {output_path}")


if __name__ == "__main__":
    main()