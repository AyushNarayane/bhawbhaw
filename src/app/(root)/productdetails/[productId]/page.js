import ProductDetailsClient from "./ProductDetailsClient";

export async function generateMetadata({ params }) {
  const { productId } = params;
  let product = null;

  try {
    const apiUrl = `https://bhawbhaw-one.vercel.app/api/products/getProductById?productId=${productId}`;
    const res = await fetch(apiUrl, { cache: "no-store" });
    const data = await res.json();
    if (data.success) {
      product = data.product;
    }
  } catch (e) {}

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist.",
    };
  }

  const url = `https://bhawbhaw-one.vercel.app/productdetails/${productId}`;
  const image = product.images?.[0]?.startsWith('http')
    ? product.images[0]
    : `https://bhawbhaw-one.vercel.app${product.images?.[0] || '/images/product-placeholder.webp'}`;

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [image],
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [image],
    },
  };
}

export default function Page({ params }) {
  return <ProductDetailsClient productId={params.productId} />;
}
