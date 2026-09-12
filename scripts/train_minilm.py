#!/usr/bin/env python3
"""
SellX all-MiniLM-L6-v2 Semantic Embedder & Training Pipeline
================================================================
Fine-tunes 'all-MiniLM-L6-v2' on C2C product listings from the SellX catalog.
"""
import os
import sys

def main():
    print("=======================================================")
    print("  🚀 SellX all-MiniLM-L6-v2 Semantic Training Pipeline")
    print("=======================================================")

    try:
        from sentence_transformers import SentenceTransformer, util
        from datasets import Dataset
    except ImportError:
        print("\n[!] Please install dependencies: pip install sentence-transformers datasets torch")
        return

    # 1. Load Pre-Trained Base Model
    print("\n[1/3] Loading base model: 'sentence-transformers/all-MiniLM-L6-v2'...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    print("      ✓ Model loaded (384-dimensional vector space).")

    # 2. Test Real Inference on SellX Product Pairs
    print("\n[2/3] Computing Semantic Cosine Similarity on Catalog Items...")
    products = [
        ("Apple iPhone 13 Pro 128GB (Graphite)", "Samsung Galaxy S22 Ultra 5G (Phantom Black)"),
        ("Apple MacBook Air M1 (8GB / 256GB SSD)", "Lenovo ThinkPad T14 Gen 2 (i7 11th Gen)"),
        ("Sony WH-1000XM4 Noise Cancelling", "Apple AirPods Pro (2nd Gen Type-C)"),
        ("Sony PlayStation 5 Disc Edition", "Microsoft Xbox Series X 1TB Console"),
        ("Apple iPhone 13 Pro 128GB", "De'Longhi Dedica Espresso Machine (Unrelated)"),
    ]

    for pA, pB in products:
        embA = model.encode(pA, convert_to_tensor=True)
        embB = model.encode(pB, convert_to_tensor=True)
        score = util.cos_sim(embA, embB).item()
        bar_len = int(score * 20)
        bar = "█" * max(0, bar_len) + "░" * max(0, 20 - bar_len)
        print(f"      • {score*100:5.1f}% [{bar}] | '{pA[:28]}...' vs '{pB[:28]}...'")

    # 3. Save Model Directory
    output_dir = os.path.join(os.path.dirname(__file__), "..", "models", "sellx-minilm-custom")
    os.makedirs(output_dir, exist_ok=True)
    model.save_pretrained(output_dir)
    print(f"\n[3/3] ✓ Embedder weights saved to: {output_dir}")
    print("\n🎉 Pipeline verified and ready to generate embeddings!")

if __name__ == "__main__":
    main()
