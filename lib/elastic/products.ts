import { esClient } from "./client";

const INDEX_NAME = "products";

export async function indexProduct(product: unknown) {
  if (!esClient) return;

  if (typeof product !== "object" || product === null || !("_id" in product)) {
    return;
  }

  const id = String((product as { _id: unknown })._id);

  try {
    await esClient.index({
      index: INDEX_NAME,
      id,
      document: product,
    });
  } catch (error) {
    console.warn("ES index failed, skipping:", error);
  }
}

export async function updateProductIndex(id: string, product: unknown) {
  if (!esClient) return;

  try {
    await esClient.update({
      index: INDEX_NAME,
      id,
      doc: product,
    });
  } catch (error) {
    console.warn("ES update failed, skipping:", error);
  }
}

export async function deleteProductIndex(id: string) {
  if (!esClient) return;

  try {
    await esClient.delete({
      index: INDEX_NAME,
      id,
    });
  } catch (error) {
    console.warn("ES delete failed, skipping:", error);
  }
}
