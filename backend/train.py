from ml.model_trainer import train_and_evaluate_all

if __name__ == "__main__":
    results, best = train_and_evaluate_all("../data/synthetic_ecommerce_data.csv", "saved_models")
    print("Best model:", best)
    for r in results:
        print(r)
