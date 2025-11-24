import React from "react";
import { motion } from "framer-motion";
import {
  GiPrayerBeads,
  GiLotusFlower,
  GiSunRadiations,
  GiCrystalShrine,
  GiIncense,
  GiPrayer,
} from "react-icons/gi";
import { IoSparkles, IoHeart, IoShield } from "react-icons/io5";
import { FaOm } from "react-icons/fa";

const MantraIntro = ({ onContinue }) => {
  const sections = [
    {
      icon: <FaOm className="text-4xl" />,
      title: "The Power of Mantra Chanting",
      content:
        "Mantras are sacred sound vibrations that have been passed down through millennia. When chanted with devotion and focus, they purify the mind, awaken spiritual consciousness, and connect us directly with the divine energy. Each syllable carries profound spiritual power.",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: <GiPrayerBeads className="text-4xl" />,
      title: "The Power of Nama (Holy Name)",
      content:
        "The Holy Name is non-different from the Supreme Lord Himself. By chanting Krishna's names—Hare Krishna, Govinda, Madhava—we invoke His divine presence. The Name is so powerful that even unconscious chanting brings spiritual benefit, but conscious, devotional chanting transforms the heart completely.",
      gradient: "from-pink-400 to-rose-500",
    },
    {
      icon: <GiSunRadiations className="text-4xl" />,
      title: "Benefits of Mantra Chanting",
      content:
        "Regular mantra chanting brings peace of mind, reduces stress and anxiety, improves concentration, purifies consciousness, awakens divine love, protects from negative energies, and gradually reveals our eternal spiritual nature. It is the easiest and most powerful spiritual practice for this age.",
      gradient: "from-purple-400 to-indigo-500",
    },
    {
      icon: <GiIncense className="text-4xl" />,
      title: "Importance of Purity & Cleanliness",
      content:
        "Before chanting, it is ideal to bathe and wear clean clothes. Sit in a clean, quiet place facing east or north. Keep your mind pure by avoiding negative thoughts. This external and internal cleanliness creates the perfect environment for the mantra to work its magic on your consciousness.",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      icon: <GiCrystalShrine className="text-4xl" />,
      title: "Guru-Given Mantra vs General Mantra",
      content:
        "A mantra received from a bonafide spiritual master (Guru) through initiation carries special potency and is tailored to your spiritual journey. However, general mantras like the Hare Krishna Maha Mantra can be chanted by anyone without initiation and are equally powerful when chanted with sincerity and devotion.",
      gradient: "from-green-400 to-emerald-500",
    },
  ];

  const benefits = [
    {
      icon: <IoHeart />,
      title: "Inner Peace",
      description: "Calms the mind and heart",
      color: "from-pink-400 to-rose-500",
    },
    {
      icon: <IoSparkles />,
      title: "Spiritual Awakening",
      description: "Reveals your true self",
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: <IoShield />,
      title: "Divine Protection",
      description: "Guards against negativity",
      color: "from-purple-400 to-indigo-500",
    },
    {
      icon: <GiPrayer />,
      title: "Devotional Love",
      description: "Awakens love for Krishna",
      color: "from-blue-400 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
              <GiPrayerBeads className="text-4xl md:text-5xl text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold text-amber-200 mb-3">
            Sacred Mantra Chanting
          </h1>
          <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto">
            Discover the ancient science of mantra meditation and transform your
            consciousness through the power of the Holy Name
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl hover:border-amber-400/50 transition-all"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg`}
                >
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-amber-200 mb-3">
                    {section.title}
                  </h2>
                  <p className="text-blue-100/90 leading-relaxed text-sm md:text-base">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 md:mt-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-amber-200 text-center mb-6">
            Benefits of Regular Chanting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 text-center border border-white/20 hover:border-amber-400/50 transition-all"
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-3 text-xl shadow-lg`}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-amber-200 font-bold mb-1">
                  {benefit.title}
                </h3>
                <p className="text-blue-100/70 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sacred Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 backdrop-blur-md bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-2xl p-6 border border-amber-400/30 text-center"
        >
          <GiLotusFlower className="text-5xl text-amber-300 mx-auto mb-3" />
          <p className="text-amber-100 text-lg md:text-xl font-semibold italic">
            "The chanting of the Holy Name is the most sublime process for
            self-realization in this age. It requires no qualification—only
            sincerity and devotion."
          </p>
          <p className="text-blue-100/70 mt-2">— Ancient Vedic Wisdom</p>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-8 md:mt-12 text-center"
        >
          <motion.button
            onClick={onContinue}
            className="px-8 md:px-12 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold text-lg md:text-xl shadow-2xl hover:shadow-amber-400/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin Mantra Chanting
            <GiPrayerBeads className="inline-block ml-2" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MantraIntro;
