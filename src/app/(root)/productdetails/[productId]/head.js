import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseConfig";

export default async function Head({ params }) {
  const { productId } = params;
  let product = null;

  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      product = productSnap.data();
    }
  } catch (e) {
    // fallback or log error
  }

  if (!product) {
    return (
      <>
        <title>Product Not Found</title>
        <meta name="description" content="This product does not exist." />
      </>
    );
  }

  const url = `https://bhawbhaw-one.vercel.app/productdetails/${productId}`;
  const image = product.images?.[0] || "/images/product-placeholder.webp";

  return (
    <>
      <title>{product.title}</title>
      <meta name="description" content={product.description} />
      {/* Open Graph tags */}
      <meta property="og:title" content={product.title} />
      <meta property="og:description" content={product.description} />
      <meta property="og:image" content={product.images[0]} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="product" />
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={product.title} />
      <meta name="twitter:description" content={product.description} />
      <meta name="twitter:image" content={image} />
    </>
  );
} 