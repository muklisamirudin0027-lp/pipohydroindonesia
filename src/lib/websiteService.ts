import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
  author: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export interface WebsiteContent {
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2Highlight: string;
    description: string;
    backgroundImage: string;
  };
  about: {
    titleLine1: string;
    titleLine2Highlight: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    image: string;
  };
  products: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
  }>;
  articles?: Array<Article>;
  gallery?: Array<GalleryItem>;
}

export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
  hero: {
    badge: "100% BEBAS PESTISIDA",
    titleLine1: "Sayuran Segar,",
    titleLine2Highlight: "Berkualitas Premium.",
    description: "Dari kebun hidroponik lokal di Blora, Jawa Tengah. Kami menanam berbagai varietas selada segar, renyah, dan sehat menggunakan metode NFT (Nutrient Film Technique) terbaik.",
    backgroundImage: "https://images.unsplash.com/photo-1557844352-761f2565b576?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  },
  about: {
    titleLine1: "Berawal dari",
    titleLine2Highlight: "Kopi & Inovasi.",
    paragraph1: "Bermula dari obrolan santai sambil ngopi bersama teman-teman, kami menyadari sebuah peluang besar. Kami ingin mematahkan stigma bahwa bertani harus selalu di lahan persawahan yang luas.",
    paragraph2: "Dengan tekad untuk memaksimalkan lahan kosong atau pekarangan rumah, kami membangun sistem hidroponik modern. Pipo Hydro Indonesia membuktikan bahwa pertanian modern bisa dilakukan di lahan terbatas dengan hasil yang jauh lebih optimal.",
    paragraph3: "Kini, kami fokus menanam berbagai varietas selada menggunakan metode hidroponik NFT yang memastikan setiap helai daun yang Anda nikmati bebas pestisida, jauh lebih renyah, dan bergizi tinggi.",
    image: "https://images.unsplash.com/photo-1595806653240-5e36502283eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  products: [
    {
      id: 1,
      title: "SELADA SEMENTEL",
      description: "Daun lebat, tebal, dan renyah. Tumbuh sempurna dengan metode NFT kami, memberikan sensasi segar di setiap gigitan.",
      image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "SELADA CAIPIRA",
      description: "Tekstur lembut dengan rasa manis alami. Cocok untuk salad, burger, dan aneka sajian sehat.",
      image: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "SELADA RZ (RIJK ZWAAN)",
      description: "Benih premium dengan kualitas tinggi. Bebas pestisida dan dipanen saat tingkat kerenyahannya paling maksimal.",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ],
  articles: [
    {
      id: "art-1",
      title: "Panduan Menanam Selada Hidroponik Sistem NFT untuk Pemula",
      category: "Edukasi",
      excerpt: "Kenali sistem NFT (Nutrient Film Technique), cara menyemai benih selada, hingga mengelola nutrisi agar daun tumbuh lebat dan renyah.",
      content: "Sistem NFT (Nutrient Film Technique) adalah salah satu metode hidroponik paling populer untuk tanaman selada. Keunggulan sistem ini adalah aliran air nutrisi yang sangat tipis terus-menerus mengaliri akar tanaman, memastikan pasokan oksigen dan nutrisi seimbang.\n\n### Langkah-langkah Memulai:\n1. **Penyemaian Benih**: Gunakan rockwool sebagai media semai. Basahi rockwool dan masukkan benih selada sedalam 0.5 cm. Tempatkan di area gelap selama 24 jam hingga pecah benih (sprout).\n2. **Pencahayaan**: Setelah pecah benih, segera jemur di bawah sinar matahari pagi agar tanaman tidak kerdil atau mengalami kutilang (kurus tinggi langsing).\n3. **Pemberian Nutrisi**: Gunakan nutrisi AB Mix khusus sayuran daun. Untuk selada, mulai dengan kepekatan 400 PPM di minggu pertama, lalu naikkan bertahap hingga 800 PPM saat dewasa.",
      image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
      createdAt: "2026-07-20",
      author: "Admin Pipo Hydro"
    },
    {
      id: "art-2",
      title: "Manfaat Kesehatan Konsumsi Selada Hidroponik Bebas Pestisida",
      category: "Kesehatan",
      excerpt: "Selada hidroponik bebas pestisida kaya akan antioksidan, vitamin A, K, dan serat alami yang sangat baik untuk menjaga kekebalan tubuh.",
      content: "Mengonsumsi sayur segar bebas pestisida kini menjadi gaya hidup sehat. Selada yang ditanam secara hidroponik memiliki kebersihan yang terjamin karena tidak menyentuh tanah langsung dan dipanen menggunakan metode steril.\n\n### Manfaat Utama Selada Hidroponik:\n* **Bebas Residu Kimia**: Tanpa pestisida sintetis, aman dikonsumsi langsung sebagai lalapan atau salad.\n* **Lebih Renyah & Manis**: Karena dipanen segar langsung dari kebun (farm-to-table), rasa alaminya tetap terjaga.\n* **Kandungan Air & Vitamin Tinggi**: Membantu hidrasi tubuh dan menjaga kesehatan kulit.",
      image: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=800&q=80",
      createdAt: "2026-07-18",
      author: "Pipo Hydro Care"
    }
  ],
  gallery: [
    {
      id: "gal-1",
      imageUrl: "https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&w=800&q=80",
      caption: "Sistem Hidroponik NFT Vertikal di Greenhouse Utama Blora",
      createdAt: "2026-07-20"
    },
    {
      id: "gal-2",
      imageUrl: "https://images.unsplash.com/photo-1595806653240-5e36502283eb?auto=format&fit=crop&w=800&q=80",
      caption: "Pemeriksaan Kualitas Daun Selada Sebelum Dipanen",
      createdAt: "2026-07-19"
    },
    {
      id: "gal-3",
      imageUrl: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80",
      caption: "Selada Caipira Siap Antar ke Pelanggan Restoran",
      createdAt: "2026-07-18"
    }
  ]
};

const DOC_REF_PATH = "website_content";
const DOC_ID = "landing";

export function isOfflineError(error: any): boolean {
  if (!error) return false;
  const errMsg = (error.message || String(error)).toLowerCase();
  const errCode = (error.code || "").toLowerCase();
  return (
    errMsg.includes("offline") ||
    errMsg.includes("could not reach cloud firestore backend") ||
    errMsg.includes("network") ||
    errMsg.includes("unavailable") ||
    errMsg.includes("failed to get document because the client is offline") ||
    errCode === "unavailable" ||
    errCode === "failed-precondition"
  );
}

export async function fetchWebsiteContent(): Promise<WebsiteContent> {
  const docRef = doc(db, DOC_REF_PATH, DOC_ID);
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Partial<WebsiteContent>;
      return {
        hero: { ...DEFAULT_WEBSITE_CONTENT.hero, ...data.hero },
        about: { ...DEFAULT_WEBSITE_CONTENT.about, ...data.about },
        products: Array.isArray(data.products) && data.products.length > 0
          ? data.products
          : DEFAULT_WEBSITE_CONTENT.products,
        articles: Array.isArray(data.articles)
          ? data.articles
          : DEFAULT_WEBSITE_CONTENT.articles,
        gallery: Array.isArray(data.gallery)
          ? data.gallery
          : DEFAULT_WEBSITE_CONTENT.gallery,
      };
    }
  } catch (error: any) {
    if (isOfflineError(error)) {
      console.warn("Client is offline. Operating in offline mode with default website content:", error.message || error);
    } else {
      console.error("Gagal memuat konten website dari Firestore:", error);
      if (error.code === "permission-denied" || (error.message && error.message.includes("permission"))) {
        handleFirestoreError(error, OperationType.GET, `${DOC_REF_PATH}/${DOC_ID}`);
      }
    }
  }
  return DEFAULT_WEBSITE_CONTENT;
}

export async function saveWebsiteContent(content: WebsiteContent): Promise<void> {
  const docRef = doc(db, DOC_REF_PATH, DOC_ID);
  try {
    await setDoc(docRef, content, { merge: true });
  } catch (error: any) {
    if (isOfflineError(error)) {
      console.warn("Gagal menyimpan konten website karena Anda sedang offline. Perubahan disimpan di local session:", error.message || error);
    } else {
      console.error("Gagal menyimpan konten website ke Firestore:", error);
      handleFirestoreError(error, OperationType.WRITE, `${DOC_REF_PATH}/${DOC_ID}`);
    }
  }
}
