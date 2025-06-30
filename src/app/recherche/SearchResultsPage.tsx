'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';

type Product = {
  id?: string;
  image: string;
  title: string;
  price: number;
};

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'relevance';

  const filters = useMemo(() => ({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    category: searchParams.get('category') || '',
    color: searchParams.get('color') || '',
    size: searchParams.get('size') || '',
    brand: searchParams.get('brand') || '',
    withDiscount: searchParams.get('withDiscount') === 'true',
  }), [searchParams]);

  const [ads, setAds] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: query, sort });
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();

        setAds(data.ads || []);
        setResults(data.results || []);
        setRelated((data.results || []).slice(0, 4));
      } catch (error) {
        console.error('Erreur recherche :', error);
        setAds([]);
        setResults([]);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query, sort, filters]);

  const updateParam = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
    router.push(`/recherche?${params.toString()}`);
  };

  const renderProductGrid = (items: Product[]) => (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <li key={idx} className="border p-2 rounded shadow-sm hover:shadow-md">
          <div className="relative w-full h-40 mb-2">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
          <h3 className="font-semibold text-lg truncate">{item.title}</h3>
          <p className="text-sm text-gray-600">
            FCFA {item.price?.toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">
          Résultats pour : <span className="text-blue-600">{query}</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="number"
            placeholder="Prix min"
            value={filters.minPrice}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />
          <input
            type="number"
            placeholder="Prix max"
            value={filters.maxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Catégorie"
            value={filters.category}
            onChange={(e) => updateParam('category', e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Couleur"
            value={filters.color}
            onChange={(e) => updateParam('color', e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Taille"
            value={filters.size}
            onChange={(e) => updateParam('size', e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Marque"
            value={filters.brand}
            onChange={(e) => updateParam('brand', e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />
          <label className="flex items-center text-sm gap-1">
            <input
              type="checkbox"
              checked={filters.withDiscount}
              onChange={(e) => updateParam('withDiscount', e.target.checked)}
            />
            Avec remise
          </label>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="relevance">Pertinence</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Note</option>
            <option value="verified">Vendeur vérifié</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      ) : (
        <>
          {ads.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Produits sponsorisés</h2>
              {renderProductGrid(ads)}
            </div>
          )}

          {results.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Autres résultats</h2>
              {renderProductGrid(results)}
            </div>
          ) : (
            <div className="text-gray-500 flex items-center gap-2">
              <FaSearch /> Aucun résultat trouvé.
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Produits similaires</h2>
              {renderProductGrid(related)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
