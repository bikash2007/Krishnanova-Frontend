import React, { useEffect, useRef, useState, useMemo } from "react";
import { PeacockFeatherSVG } from "../UI/Svg";
import {
  FaOm,
  FaHeart,
  FaMoon,
  FaMusic,
  FaMountain,
  FaChild,
  FaStar,
  FaGlobe,
  FaShieldAlt,
  FaPray,
  FaCrown,
  FaRunning,
  FaLandmark,
  FaHome,
  FaSearch,
  FaTheaterMasks,
  FaDharmachakra,
  FaCloudRain,
} from "react-icons/fa";
import {
  GiFlute,
  GiFeather,
  GiLotusFlower,
  GiCandleLight,
  GiPrayerBeads,
  GiCow,
  GiRopeCoil,
  GiBowArrow,
} from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";

const KrishnaNames = () => {
  const sectionRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    // Default to list view on mobile for better UX
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return "list";
    }
    return "grid";
  });
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAllNames, setShowAllNames] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // SEO Meta tags
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "108 Divine Krishna Names & Meanings | Krishnova";

    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.content;
    if (metaDescription) {
      metaDescription.content =
        "Discover the 108 sacred names of Lord Krishna with meanings. Govinda, Kanha, Madhava, Shyam - explore divine Krishna names for spiritual enlightenment at Krishnova.";
    }

    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.content = originalDescription;
      }
    };
  }, []);

  const krishnaNames = [
    // Divine Forms & Attributes
    {
      id: "govinda",
      name: "Govinda",
      meaning: "Protector of Cows",
      sanskrit: "गोविन्द",
      description: "The divine protector who tends to all beings with love",
      mantra: "ॐ गोविन्दाय नमः",
      icon: <GiCow />,
      category: "divine",
    },
    {
      id: "ladoo-gopal",
      name: "Ladoo Gopal",
      meaning: "Sweet Child Krishna",
      sanskrit: "लड्डू गोपाल",
      description: "The adorable child form who loves sweet offerings",
      mantra: "ॐ बाल गोपालाय नमः",
      icon: <FaHeart />,
      category: "child",
    },
    {
      id: "radha-ramana",
      name: "Radha Ramana",
      meaning: "Beloved of Radha",
      sanskrit: "राधा रमण",
      description: "The eternal lover, embodiment of divine romance",
      mantra: "ॐ राधा रमणाय नमः",
      icon: <FaHeart />,
      category: "love",
    },
    {
      id: "kanaiya",
      name: "Kanaiya",
      meaning: "Playful One",
      sanskrit: "कन्हैया",
      description: "The mischievous divine child full of joy",
      mantra: "ॐ कन्हैयाय नमः",
      icon: <FaTheaterMasks />,
      category: "child",
    },
    {
      id: "kanha",
      name: "Kanha",
      meaning: "Dark Beautiful",
      sanskrit: "कान्हा",
      description: "The enchanting dark-complexioned lord",
      mantra: "ॐ कान्हाय नमः",
      icon: <FaMoon />,
      category: "beauty",
    },
    {
      id: "hari",
      name: "Hari",
      meaning: "Remover of Sorrows",
      sanskrit: "हरि",
      description: "The compassionate one who removes all suffering",
      mantra: "ॐ हरये नमः",
      icon: <IoSparkles />,
      category: "divine",
    },
    {
      id: "banke-bihari",
      name: "Banke Bihari",
      meaning: "Bent in Three Places",
      sanskrit: "बांके बिहारी",
      description: "The graceful one with the iconic tribhanga pose",
      mantra: "ॐ बांके बिहारीये नमः",
      icon: <GiFlute />,
      category: "divine",
    },
    {
      id: "shyam",
      name: "Shyam",
      meaning: "Dark Beauty",
      sanskrit: "श्याम",
      description: "The mesmerizing dark-hued divine beauty",
      mantra: "ॐ श्यामाय नमः",
      icon: <GiFeather />,
      category: "beauty",
    },
    {
      id: "madhava",
      name: "Madhava",
      meaning: "Sweet Like Honey",
      sanskrit: "माधव",
      description: "The spring of sweetness and divine nectar",
      mantra: "ॐ माधवाय नमः",
      icon: <GiLotusFlower />,
      category: "divine",
    },
    // Additional Names
    {
      id: "murlidhar",
      name: "Murlidhar",
      meaning: "Holder of the Flute",
      sanskrit: "मुरलीधर",
      description: "The divine musician whose flute enchants all creation",
      mantra: "ॐ मुरलीधराय नमः",
      icon: <FaMusic />,
      category: "divine",
    },
    {
      id: "giridhara",
      name: "Giridhara",
      meaning: "Lifter of Mountains",
      sanskrit: "गिरिधर",
      description: "The one who lifted Govardhan to protect devotees",
      mantra: "ॐ गिरिधराय नमः",
      icon: <FaMountain />,
      category: "divine",
    },
    {
      id: "damodara",
      name: "Damodara",
      meaning: "Bound by Rope",
      sanskrit: "दामोदर",
      description: "Bound by mother Yashoda's love and devotion",
      mantra: "ॐ दामोदराय नमः",
      icon: <GiRopeCoil />,
      category: "child",
    },
    {
      id: "gopala",
      name: "Gopala",
      meaning: "Cowherd Boy",
      sanskrit: "गोपाल",
      description: "The divine cowherd who protects and nurtures",
      mantra: "ॐ गोपालाय नमः",
      icon: <GiCow />,
      category: "child",
    },
    {
      id: "nandakumara",
      name: "Nandakumara",
      meaning: "Son of Nanda",
      sanskrit: "नन्दकुमार",
      description: "The beloved son who brought joy to Nanda",
      mantra: "ॐ नन्दकुमाराय नमः",
      icon: <FaChild />,
      category: "child",
    },
    {
      id: "vaasudeva",
      name: "Vaasudeva",
      meaning: "Son of Vasudeva",
      sanskrit: "वासुदेव",
      description: "The supreme being, son of Vasudeva",
      mantra: "ॐ वासुदेवाय नमः",
      icon: <FaStar />,
      category: "divine",
    },
    {
      id: "jagannatha",
      name: "Jagannatha",
      meaning: "Lord of the Universe",
      sanskrit: "जगन्नाथ",
      description: "The supreme lord of all creation",
      mantra: "ॐ जगन्नाथाय नमः",
      icon: <FaGlobe />,
      category: "divine",
    },
    {
      id: "makhan-chor",
      name: "Makhan Chor",
      meaning: "Butter Thief",
      sanskrit: "माखन चोर",
      description: "The mischievous child who steals butter and hearts",
      mantra: "ॐ माखन चोराय नमः",
      icon: <FaChild />,
      category: "child",
    },
    {
      id: "mohan",
      name: "Mohan",
      meaning: "The Enchanter",
      sanskrit: "मोहन",
      description: "The one who enchants and captivates all minds",
      mantra: "ॐ मोहनाय नमः",
      icon: <IoSparkles />,
      category: "beauty",
    },
    {
      id: "kesava",
      name: "Keshava",
      meaning: "Beautiful Haired",
      sanskrit: "केशव",
      description: "The lord with beautiful, flowing locks",
      mantra: "ॐ केशवाय नमः",
      icon: <FaStar />,
      category: "beauty",
    },
    {
      id: "achyuta",
      name: "Achyuta",
      meaning: "Infallible One",
      sanskrit: "अच्युत",
      description: "The one who never fails or falls",
      mantra: "ॐ अच्युताय नमः",
      icon: <FaShieldAlt />,
      category: "divine",
    },
    {
      id: "narayana",
      name: "Narayana",
      meaning: "Refuge of All",
      sanskrit: "नारायण",
      description: "The ultimate refuge and shelter for all souls",
      mantra: "ॐ नारायणाय नमः",
      icon: <FaPray />,
      category: "divine",
    },
    {
      id: "purushottama",
      name: "Purushottama",
      meaning: "Supreme Being",
      sanskrit: "पुरुषोत्तम",
      description: "The highest among all beings",
      mantra: "ॐ पुरुषोत्तमाय नमः",
      icon: <FaCrown />,
      category: "divine",
    },
    {
      id: "ranchod",
      name: "Ranchod",
      meaning: "Who Left the Battlefield",
      sanskrit: "रणछोड़",
      description: "The strategic one who fled battle to protect devotees",
      mantra: "ॐ रणछोड़ाय नमः",
      icon: <FaRunning />,
      category: "divine",
    },
    {
      id: "dwarkadhish",
      name: "Dwarkadhish",
      meaning: "King of Dwarka",
      sanskrit: "द्वारकाधीश",
      description: "The majestic ruler of the golden city Dwarka",
      mantra: "ॐ द्वारकाधीशाय नमः",
      icon: <FaLandmark />,
      category: "divine",
    },
    {
      id: "parthasarathi",
      name: "Parthasarathi",
      meaning: "Charioteer of Arjuna",
      sanskrit: "पार्थसारथी",
      description: "The divine guide who drove Arjuna's chariot",
      mantra: "ॐ पार्थसारथये नमः",
      icon: <GiBowArrow />,
      category: "divine",
    },
    {
      id: "gokulnath",
      name: "Gokulnath",
      meaning: "Lord of Gokul",
      sanskrit: "गोकुलनाथ",
      description: "The beloved lord of Gokul village",
      mantra: "ॐ गोकुलनाथाय नमः",
      icon: <FaHome />,
      category: "child",
    },
    {
      id: "rasbihari",
      name: "Rasbihari",
      meaning: "Lord of Divine Dance",
      sanskrit: "रासबिहारी",
      description: "The one who performs the divine Raas Leela",
      mantra: "ॐ रासबिहारीये नमः",
      icon: <FaMusic />,
      category: "love",
    },
    {
      id: "radheshyam",
      name: "Radheshyam",
      meaning: "Radha's Dark Lord",
      sanskrit: "राधेश्याम",
      description: "The eternal consort of Radha",
      mantra: "ॐ राधेश्यामाय नमः",
      icon: <FaHeart />,
      category: "love",
    },
    {
      id: "ghanshyam",
      name: "Ghanshyam",
      meaning: "Dark as Rain Cloud",
      sanskrit: "घनश्याम",
      description: "Beautiful as the dark monsoon clouds",
      mantra: "ॐ घनश्यामाय नमः",
      icon: <FaCloudRain />,
      category: "beauty",
    },
    {
      id: "pitambara",
      name: "Pitambara",
      meaning: "Wearer of Yellow Robes",
      sanskrit: "पीताम्बर",
      description: "The resplendent one in golden yellow garments",
      mantra: "ॐ पीताम्बराय नमः",
      icon: <FaStar />,
      category: "beauty",
    },
    {
      id: "muraari",
      name: "Muraari",
      meaning: "Slayer of Mura",
      sanskrit: "मुरारी",
      description: "The victorious one who defeated demon Mura",
      mantra: "ॐ मुरारये नमः",
      icon: <FaShieldAlt />,
      category: "divine",
    },
    {
      id: "nandlala",
      name: "Nandlala",
      meaning: "Darling of Nanda",
      sanskrit: "नन्दलाला",
      description: "The cherished darling child of Nanda",
      mantra: "ॐ नन्दलालाय नमः",
      icon: <GiLotusFlower />,
      category: "child",
    },
    {
      id: "yashoda-nandana",
      name: "Yashoda Nandana",
      meaning: "Joy of Yashoda",
      sanskrit: "यशोदा नन्दन",
      description: "The beloved son who brought joy to mother Yashoda",
      mantra: "ॐ यशोदानन्दनाय नमः",
      icon: <FaHeart />,
      category: "child",
    },
    {
      id: "vrindavanchandra",
      name: "Vrindavanchandra",
      meaning: "Moon of Vrindavan",
      sanskrit: "वृन्दावनचन्द्र",
      description: "The luminous moon who lights up Vrindavan",
      mantra: "ॐ वृन्दावनचन्द्राय नमः",
      icon: <FaMoon />,
      category: "beauty",
    },
    {
      id: "madan-mohan",
      name: "Madan Mohan",
      meaning: "Enchanter of Cupid",
      sanskrit: "मदन मोहन",
      description: "The one whose beauty enchants even Kamadeva",
      mantra: "ॐ मदनमोहनाय नमः",
      icon: <FaHeart />,
      category: "love",
    },
    {
      id: "chakradhari",
      name: "Chakradhari",
      meaning: "Bearer of Chakra",
      sanskrit: "चक्रधारी",
      description: "The wielder of the divine Sudarshana Chakra",
      mantra: "ॐ चक्रधारीणे नमः",
      icon: <FaDharmachakra />,
      category: "divine",
    },
  ];

  const categories = [
    { id: "all", label: "All Names", icon: <FaOm /> },
    { id: "divine", label: "Divine Forms", icon: <IoSparkles /> },
    { id: "child", label: "Child Krishna", icon: <FaChild /> },
    { id: "beauty", label: "Beauty", icon: <GiFeather /> },
    { id: "love", label: "Divine Love", icon: <FaHeart /> },
  ];

  const filteredNames = useMemo(() => {
    return krishnaNames.filter((name) => {
      const matchesSearch =
        name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.sanskrit.includes(searchQuery);
      const matchesCategory =
        activeCategory === "all" || name.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const viewModes = [
    {
      id: "grid",
      icon: "⊞",
      label: "Grid",
      fullLabel: "Grid View",
      mobileIcon: "⊞",
    },
    {
      id: "list",
      icon: "☰",
      label: "List",
      fullLabel: "List View",
      mobileIcon: "☰",
    },
  ];

  return (
    <section className="relative md:min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Static Mandala Background */}

      {/* Grid Pattern - hidden on mobile */}
      {/* {!isMobile && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #fbbf24 1px, transparent 1px),
              linear-gradient(to bottom, #fbbf24 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      )} */}

      {/* Static Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-xl"
          style={{ left: "10%", top: "20%" }}
        />
        <div
          className="absolute w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-xl"
          style={{ left: "80%", top: "60%" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <PeacockFeatherSVG className="absolute w-48 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30" />
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          {/* Sacred Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg mb-3 sm:mb-5">
            <span className="text-amber-300 text-xs sm:text-sm">✦</span>
            <span className="text-amber-100 font-medium tracking-wide text-[11px] sm:text-sm">
              {filteredNames.length} Divine Names
            </span>
            <span className="text-amber-300 text-xs sm:text-sm">✦</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 leading-tight">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Divine Names of Krishna
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-blue-100/80 max-w-xl mx-auto px-2 leading-relaxed">
            Each name reveals a unique aspect of the Lord's infinite nature
          </p>

          <div className="flex items-center justify-center space-x-2 text-amber-200/60 text-[10px] sm:text-xs mt-2 sm:mt-3">
            <GiCandleLight className="inline" />
            <span className="italic hidden sm:inline">
              "Sahasranāmatatulyam Rāmanāma Varānane" - Vishnu Sahasranama
            </span>
            <span className="italic sm:hidden">Vishnu Sahasranama</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-4 sm:mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, meaning, or Sanskrit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 bg-white/10 backdrop-blur-md border border-amber-400/30 rounded-full text-amber-100 placeholder-amber-200/50 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 text-xs sm:text-sm"
            />
            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-amber-300 text-sm sm:text-base" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-amber-300 hover:text-amber-100 transition-colors text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-amber-400/30 to-orange-500/30 border-amber-400/60 text-amber-200"
                    : "border-white/20 text-white/60 hover:border-amber-400/40 hover:text-amber-200/80"
                }
                px-2.5 sm:px-3 py-1 sm:py-1.5
                rounded-full border
                backdrop-blur-sm
                transition-all duration-300
                text-[10px] sm:text-xs
                flex items-center gap-1
              `}
            >
              <span className="text-sm sm:text-base">{category.icon}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          ))}
        </div>

        {/* View Mode Toggle - Responsive Design */}
        <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6 md:mb-8">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`
                ${
                  viewMode === mode.id
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 shadow-lg shadow-amber-500/30"
                    : "border border-amber-400/50 text-amber-200 backdrop-blur-md bg-white/5 hover:bg-amber-400/10"
                }
                px-3 sm:px-4 md:px-5
                py-1.5 sm:py-2 md:py-2.5
                rounded-full 
                font-medium
                transition-all duration-300
                text-[11px] sm:text-xs md:text-sm
                flex items-center gap-1 sm:gap-1.5
              `}
            >
              <span className="text-xs sm:text-sm">{mode.icon}</span>
              <span className="hidden sm:inline">{mode.fullLabel}</span>
              <span className="sm:hidden">{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex justify-center items-center gap-3 sm:gap-6 mb-3 sm:mb-5 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5 text-amber-200/60">
            <GiPrayerBeads className="text-amber-400 text-sm" />
            <span>{krishnaNames.length} Total Names</span>
          </div>
          {searchQuery || activeCategory !== "all" ? (
            <div className="flex items-center gap-2 text-cyan-300/60">
              <FaSearch className="inline" />
              <span>{filteredNames.length} Showing</span>
            </div>
          ) : null}
        </div>

        {/* Names Display */}
        <>
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {filteredNames.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FaSearch className="text-4xl mb-4 mx-auto text-amber-300/60" />
                  <p className="text-amber-200/60">
                    No names found. Try a different search.
                  </p>
                </div>
              ) : (
                <>
                  {(showAllNames
                    ? filteredNames
                    : filteredNames.slice(0, isMobile ? 4 : 8)
                  ).map((item, index) => (
                    <div
                      key={item.id}
                      className="group relative backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden will-change-transform hover:scale-[1.02] hover:-translate-y-1"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 will-change-opacity" />

                      {/* Category badge */}
                      <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-white/10 text-amber-200/60 capitalize">
                        {item.category}
                      </div>

                      {/* Icon */}
                      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300 will-change-transform">
                        {item.icon}
                      </div>

                      {/* Sanskrit Name */}
                      <h4 className="text-lg sm:text-xl text-amber-200/80 font-sanskrit mb-1">
                        {item.sanskrit}
                      </h4>

                      {/* English Name */}
                      <h3 className="text-xl sm:text-2xl text-amber-300 font-bold mb-1.5 sm:mb-2 group-hover:text-amber-200 transition-colors">
                        {item.name}
                      </h3>

                      {/* Meaning */}
                      <p className="text-cyan-300/80 text-xs sm:text-sm mb-2 sm:mb-3">
                        {item.meaning}
                      </p>

                      {/* Description */}
                      <p className="text-blue-200/60 text-xs leading-relaxed">
                        {item.description}
                      </p>

                      {/* Mantra on hover - desktop only */}
                      {!isMobile && (
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900/90 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 will-change-transform"
                          style={{ transform: "translate3d(0, 100%, 0)" }}
                        >
                          <p className="text-amber-200/80 text-xs font-sanskrit">
                            {item.mantra}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* View All Names Button for Grid */}
                  {filteredNames.length > (isMobile ? 4 : 8) &&
                    !showAllNames && (
                      <div className="col-span-full flex justify-center mt-2">
                        <button
                          onClick={() => setShowAllNames(true)}
                          className="px-8 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/40 rounded-xl text-amber-200 font-medium text-sm flex items-center gap-2 hover:border-amber-400/60 hover:scale-105 transition-all duration-300"
                        >
                          <GiPrayerBeads className="inline" />
                          <span>
                            View All {filteredNames.length} Divine Names
                          </span>
                          <span>↓</span>
                        </button>
                      </div>
                    )}

                  {/* Collapse button for Grid */}
                  {showAllNames &&
                    filteredNames.length > (isMobile ? 4 : 8) && (
                      <div className="col-span-full flex justify-center mt-2">
                        <button
                          onClick={() => setShowAllNames(false)}
                          className="px-8 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-md border border-purple-400/40 rounded-xl text-purple-200 font-medium text-sm flex items-center gap-2 hover:border-purple-400/60 hover:scale-105 transition-all duration-300"
                        >
                          <span>↑</span>
                          <span>Show Less</span>
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>
          )}

          {viewMode === "list" && (
            <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3">
              {filteredNames.length === 0 ? (
                <div className="text-center py-12">
                  <FaSearch className="text-4xl mb-4 mx-auto text-amber-300/60" />
                  <p className="text-amber-200/60">
                    No names found. Try a different search.
                  </p>
                </div>
              ) : (
                <>
                  {(showAllNames
                    ? filteredNames
                    : filteredNames.slice(0, 5)
                  ).map((item, index) => (
                    <div
                      key={item.id}
                      className="group backdrop-blur-sm bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-3 sm:p-4 border border-white/20 hover:border-amber-400/50 transition-all duration-300 flex items-center gap-3 sm:gap-4"
                    >
                      {/* Number */}
                      <div className="flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-300 font-bold text-xs sm:text-sm">
                        {index + 1}
                      </div>

                      {/* Icon */}
                      <div className="flex-shrink-0 text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mb-0.5">
                          <h3 className="text-base sm:text-lg text-amber-300 font-bold truncate">
                            {item.name}
                          </h3>
                          <span className="text-amber-200/60 font-sanskrit text-xs sm:text-sm hidden sm:inline">
                            {item.sanskrit}
                          </span>
                        </div>
                        <p className="text-cyan-300/80 text-[11px] sm:text-xs truncate">
                          {item.meaning}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* View All Names Button - Works on all screen sizes */}
                  {filteredNames.length > 5 && !showAllNames && (
                    <button
                      onClick={() => setShowAllNames(true)}
                      className="w-full mt-3 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/40 rounded-xl text-amber-200 font-medium text-sm flex items-center justify-center gap-2 hover:border-amber-400/60 transition-all duration-300"
                    >
                      <GiPrayerBeads className="inline" />
                      <span>View All {filteredNames.length} Divine Names</span>
                      <span>↓</span>
                    </button>
                  )}

                  {/* Collapse button when showing all */}
                  {showAllNames && filteredNames.length > 5 && (
                    <button
                      onClick={() => setShowAllNames(false)}
                      className="w-full mt-3 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-md border border-purple-400/40 rounded-xl text-purple-200 font-medium text-sm flex items-center justify-center gap-2 hover:border-purple-400/60 transition-all duration-300"
                    >
                      <span>↑</span>
                      <span>Show Less</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {viewMode === "cards" && (
            <div className="max-w-4xl mx-auto">
              {filteredNames.length === 0 ? (
                <div className="text-center py-12">
                  <FaSearch className="text-4xl mb-4 mx-auto text-amber-300/60" />
                  <p className="text-amber-200/60">
                    No names found. Try a different search.
                  </p>
                </div>
              ) : (
                filteredNames.map((item, index) => (
                  <div key={item.id} className="mb-4 sm:mb-5 md:mb-6">
                    <div
                      className="group relative backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-white/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden will-change-transform"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                    >
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-br from-amber-400/5 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 md:-translate-y-32 translate-x-16 sm:translate-x-24 md:translate-x-32" />

                      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8">
                        {/* Left side - Icon and Sanskrit */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 will-change-transform">
                            <span className="text-4xl sm:text-5xl">
                              {item.icon}
                            </span>
                          </div>
                        </div>

                        {/* Right side - Details */}
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2">
                            <h3 className="text-2xl sm:text-3xl font-bold text-amber-300">
                              {item.sanskrit}
                            </h3>
                            <span className="text-lg sm:text-xl text-blue-100 font-semibold">
                              {item.name}
                            </span>
                          </div>

                          <p className="text-cyan-300 mb-2 sm:mb-3 text-sm sm:text-base">
                            {item.meaning}
                          </p>

                          <p className="text-blue-200/80 mb-3 sm:mb-4 text-sm sm:text-base">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-2 text-amber-200/60 text-xs sm:text-sm">
                            <GiPrayerBeads className="inline" />
                            <span className="font-sanskrit italic">
                              {item.mantra}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      </div>
    </section>
  );
};

export default KrishnaNames;
