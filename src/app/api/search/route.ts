import { db } from '@/lib/firebase';
import { collection, getDocsFromServer } from 'firebase/firestore';
import { remove as removeAccents } from 'diacritics';

interface Product {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  category?: string;
  color?: string;
  price: number;
  discount?: number;
  rating?: number;
  vendorVerified?: boolean;
  advertised?: boolean;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = removeAccents(searchParams.get('q')?.toLowerCase().trim() || '');
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
  const sort = searchParams.get('sort') || 'relevance';
  const categoryFilter = searchParams.get('category')?.toLowerCase();
  const colorFilter = searchParams.get('color')?.toLowerCase();
  const withDiscount = searchParams.get('withDiscount') === 'true';

  if (!q) {
    return new Response(JSON.stringify({ ads: [], results: [] }), { status: 200 });
  }

  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocsFromServer(productsRef);

    const allMatches: Product[] = snapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as Omit<Product, 'id'>) }))
      .filter(product => {
        const title = removeAccents(product.title?.toLowerCase() || '');
        const description = removeAccents(product.description?.toLowerCase() || '');
        const tags = (product.tags || []).map(t => removeAccents(t.toLowerCase()));
        const category = removeAccents(product.category?.toLowerCase() || '');
        const color = product.color?.toLowerCase() || '';

        const textMatch = title.includes(q) || description.includes(q) || tags.includes(q);
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;
        const categoryMatch = categoryFilter ? category === categoryFilter : true;
        const colorMatch = colorFilter ? color === colorFilter : true;
        const discountMatch = withDiscount ? product.discount && product.discount > 0 : true;

        return textMatch && priceMatch && categoryMatch && colorMatch && discountMatch;
      });

    if (sort === 'price-asc') {
      allMatches.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      allMatches.sort((a, b) => b.price - a.price);
    } else if (sort === 'popularity' || sort === 'rating') {
      allMatches.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'verified') {
      allMatches.sort((a, b) => (b.vendorVerified === true ? 1 : 0) - (a.vendorVerified === true ? 1 : 0));
    }

    const ads = allMatches.filter(p => p.advertised === true);
    const results = allMatches.filter(p => !p.advertised);

    return new Response(JSON.stringify({ ads, results }), { status: 200 });
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
}
