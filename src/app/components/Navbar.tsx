'use client';

import { useEffect, useState } from 'react';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { onSnapshot, doc, collection } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Détection de votre position...');
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('utilisateur');
  const [wallet, setWallet] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [languageCode, setLanguageCode] = useState('fr');
  const [flagUrl, setFlagUrl] = useState('https://flagcdn.com/fr.svg');
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const emojis = ['🔥', '🚀', '🎉', '💡', '🛍️', '📢', '✨', '🎯', '💬'];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Bonjour');
    else if (hour >= 12 && hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || '';
            const country = data.address.country || '';
            const countryCode = data.address.country_code?.toLowerCase() || 'fr';

            setLocation(`Vous êtes actuellement à ${city}, ${country}`);
            setLanguageCode(countryCode);
            setFlagUrl(`https://flagcdn.com/${countryCode}.svg`);
          } catch {
            setLocation('Impossible de détecter la localisation');
          }
        },
        () => {
          setLocation('Accès à la localisation refusé');
        }
      );
    } else {
      setLocation('Géolocalisation non supportée');
    }
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.displayName || 'utilisateur');

        if (Notification.permission !== 'granted') {
          Notification.requestPermission();
        }

        let lastAmount = 0;
        const earningsRef = doc(db, 'users', user.uid, 'earnings', 'current');

        const unsubscribeEarnings = onSnapshot(earningsRef, (snapshot) => {
          const data = snapshot.data();
          const amount = data?.amount || 0;

          if (amount > lastAmount && Notification.permission === 'granted') {
            new Notification('📈 Nouveau gain reçu !', {
              body: `Vous avez gagné FCFA ${amount - lastAmount}`,
              icon: '/cauri-icon.png',
            });
          }

          lastAmount = amount;
          setWallet(amount);
        });

        const unsubscribeCart = onSnapshot(collection(db, 'users', user.uid, 'cart'), (snapshot) => {
          setCartCount(snapshot.size);
        });

        return () => {
          unsubscribeEarnings();
          unsubscribeCart();
        };
      } else {
        setIsLoggedIn(false);
        setUserName('utilisateur');
        setWallet(0);
        setCartCount(0);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = () => {
      const stored = localStorage.getItem('announcements');
      if (stored) {
        const parsed = JSON.parse(stored) as { text: string; scheduledAt?: string }[];
        const now = new Date();
        const active = parsed
          .filter((a) => !a.scheduledAt || new Date(a.scheduledAt) <= now)
          .map((a) => a.text);
        setAnnouncements(active);
      }
    };

    fetchAnnouncements();

    const handleStorage = () => fetchAnnouncements();
    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUserName('utilisateur');
    setWallet(0);
    setCartCount(0);
    router.push('/');
    toast.success('Vous vous êtes déconnecté avec succès');
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full bg-[#131921] text-white text-sm font-medium">
      <div className="flex items-center px-4 py-2 space-x-4">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => router.push('/')}>
          <Image src="/cauri-icon.png" alt="Logo Cauri" width={24} height={24} />
          <h1 className="text-2xl font-bold text-blue-500">Cauri</h1>
        </div>

        <div className="flex items-center text-xs leading-tight cursor-pointer max-w-xs">
          <MdLocationOn size={20} className="mr-1" />
          <div>
            <p className="text-gray-300">{location}</p>
            <p className="font-semibold text-white hover:underline">Mettre à jour la position</p>
          </div>
        </div>

        <div className="flex flex-grow mx-4 bg-white rounded overflow-hidden text-black max-w-3xl">
          <select
            className="bg-gray-100 px-2 border-r border-gray-300 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {['Tout', 'Électronique', 'Vêtements', 'Maison', 'Livres', 'Jouets', 'Beauté', 'Épicerie'].map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={`Rechercher dans ${selectedCategory}`}
            className="flex-grow px-2 py-2 outline-none"
          />
          <button
            className="bg-yellow-400 px-4 flex items-center justify-center"
            onClick={handleSearch}
            title="Rechercher"
          >
            <FaSearch />
          </button>
        </div>

        <div className="flex items-center space-x-1 cursor-pointer">
          <Image src={flagUrl} alt={languageCode.toUpperCase()} width={20} height={20} className="w-5 h-5" unoptimized />
          <span className="uppercase">{languageCode}</span>
          <IoMdArrowDropdown />
        </div>

        <div className="flex flex-col justify-center cursor-pointer">
          <span className="text-gray-300">
            {greeting}, {userName}
          </span>
          {isLoggedIn ? (
            <span onClick={handleLogout} className="font-semibold hover:underline">
              Se déconnecter
            </span>
          ) : (
            <>
              <span onClick={() => router.push('/auth/signin')} className="font-semibold hover:underline">
                Se connecter
              </span>
              <span onClick={() => router.push('/auth/signup')} className="font-semibold hover:underline">
                S’inscrire
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col justify-center text-left cursor-pointer">
          <span onClick={() => router.push('/retours')} className="text-gray-300 hover:underline">
            Retours
          </span>
          <span onClick={() => router.push('/commandes')} className="font-semibold hover:underline">
            &amp; Commandes
          </span>
        </div>

        <div
          onClick={() => router.push(isLoggedIn ? '/wallet' : '/auth/signin')}
          title="Cliquez pour voir les détails"
          className="flex flex-col justify-center items-end cursor-pointer hover:underline"
        >
          <span className="text-green-400 font-bold">FCFA {wallet.toLocaleString()}</span>
          <span className="text-xs">Portefeuille</span>
        </div>

        <div
          onClick={() => router.push('/panier')}
          className="relative flex items-center cursor-pointer hover:underline"
          title="Voir votre panier"
        >
          <FaShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute top-[-6px] left-3 bg-yellow-400 text-black text-xs font-bold px-1 rounded-full">
              {cartCount}
            </span>
          )}
          <span className="ml-1">Panier</span>
        </div>
      </div>

      {announcements.length > 0 && (
        <div dir="rtl" className="bg-[#232f3e] py-2 text-white text-sm overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block px-4">
            {announcements.map((msg, i) => (
              <span key={i} className="mx-6">{`${emojis[i % emojis.length]} ${msg}`}</span>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
