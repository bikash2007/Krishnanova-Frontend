import React from "react";
import { motion } from "framer-motion";
import {
  GiMeditation,
  GiLotusFlower,
  GiPrayerBeads,
  GiSunRadiations,
  GiThirdEye,
  GiInnerSelf,
} from "react-icons/gi";
import { IoSparkles, IoHeart, IoLeaf } from "react-icons/io5";

const MeditationIntro = ({ onContinue }) => {
  const sections = [
    {
      icon: <GiMeditation className="text-4xl" />,
      title: "What is Meditation?",
      content:
        "Meditation is the ancient practice of quieting the mind and turning inward to connect with the divine consciousness. It is a journey from the external world to the inner sanctuary of peace, where the soul meets the Supreme.",
      gradient: "from-purple-400 to-indigo-500",
    },
    {
      icon: <GiPrayerBeads className="text-4xl" />,
      title: "About Ashtanga Bhakti",
      content:
        "Ashtanga Bhakti refers to the eight-fold path of devotion: Shravanam (hearing), Kirtanam (chanting), Smaranam (remembering), Pada-sevanam (serving the lotus feet), Archanam (worship), Vandanam (offering prayers), Dasyam (servitude), and Sakhyam (friendship). These practices purify the heart and awaken divine love.",
      gradient: "from-pink-400 to-rose-500",
    },
    {
      icon: <GiThirdEye className="text-4xl" />,
      title: "Roopa Dhayana & Sthiratha",
      content:
        "Roopa Dhayana is the meditation on the divine form of the Lord. By visualizing Krishna's beautiful form—His lotus eyes, peacock feather crown, and enchanting smile—the mind becomes absorbed in divine beauty. Sthiratha (steadiness) develops when the mind remains fixed on this form without wavering, leading to deep spiritual experiences.",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: <GiSunRadiations className="text-4xl" />,
      title: "Benefits of Breath Awareness",
      content:
        "Conscious breathing is the bridge between body and mind. By observing the breath, we anchor ourselves in the present moment, calm the nervous system, reduce stress, and prepare the mind for deeper meditation. Each breath becomes a prayer, connecting us to the life force (prana) that sustains all existence.",
      gradient: "from-cyan-400 to-blue-500",
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
              <GiLotusFlower className="text-4xl md:text-5xl text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold text-amber-200 mb-3">
            The Path of Meditation
          </h1>
          <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto">
            Discover the ancient wisdom of meditation and prepare your mind for
            divine communion
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
          transition={{ delay: 0.8 }}
          className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              icon: <IoHeart />,
              text: "Inner Peace",
              color: "from-pink-400 to-rose-500",
            },
            {
              icon: <IoSparkles />,
              text: "Mental Clarity",
              color: "from-amber-400 to-orange-500",
            },
            {
              icon: <GiInnerSelf />,
              text: "Self-Realization",
              color: "from-purple-400 to-indigo-500",
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 text-center border border-white/20"
            >
              <div
                className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-2 text-xl`}
              >
                {benefit.icon}
              </div>
              <p className="text-amber-200 font-semibold">{benefit.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 md:mt-12 text-center"
        >
          <motion.button
            onClick={onContinue}
            className="px-8 md:px-12 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold text-lg md:text-xl shadow-2xl hover:shadow-amber-400/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin Your Meditation Journey
            <IoSparkles className="inline-block ml-2" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MeditationIntro;
