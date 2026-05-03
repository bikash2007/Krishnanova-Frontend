import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  IoSparkles,
  IoTime,
  IoCheckmark,
  IoBookmark,
  IoBookmarkOutline,
  IoThumbsUp,
  IoThumbsDown,
  IoLocation,
} from "react-icons/io5";
import { GiScrollUnfurled } from "react-icons/gi";
import { MdMenuBook } from "react-icons/md";
import KrishnaVoiceElevenLabs from "../KrishnaVoiceElevenLabs";
import { SafeMotionDiv, SafeMotionButton } from "../Shared/SafeMotion";
import kpng from "../../../../Media/k.webp";

/**
 * EnhancedKrishnaMessage — renders a single Krishna AI response
 * with structured blocks (sanskrit, translation, practice, etc.),
 * TTS, feedback, and bookmark controls.
 */
const EnhancedKrishnaMessage = ({
  message,
  onFeedback,
  onAcceptPractice,
  hasActivePractice,
  isMobile,
  voiceSettings,
  onSaveMessage,
  isSaved = false,
  userId,
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const [practiceAccepted, setPracticeAccepted] = useState(false);
  const [isMessageSaved, setIsMessageSaved] = useState(isSaved);

  const getPlainTextForSpeech = () => {
    const blocks = message.blocks ||
      message.structured_message?.blocks ||
      message.message?.blocks || [
        {
          type: "text",
          content: message.text || message.reply || message.content,
        },
      ];

    let speechText = "";
    blocks.forEach((block) => {
      if (block.type === "sanskrit") {
        speechText += block.content + "... ";
      } else if (
        block.type === "translation" ||
        block.type === "text" ||
        block.type === "explanation"
      ) {
        speechText += block.content + " ";
      } else if (block.type === "verse_reference") {
        speechText += "From " + block.content + ". ";
      }
    });
    return speechText.trim();
  };

  const handleFeedback = async (type) => {
    if (feedbackGiven) return;
    setFeedbackGiven(type);
    await onFeedback(message.id || message.messageId, type, message);
  };

  const handleAcceptPractice = (practice) => {
    if (!hasActivePractice && !practiceAccepted) {
      onAcceptPractice(practice);
      setPracticeAccepted(true);
    }
  };

  const handleSaveMessage = () => {
    setIsMessageSaved(!isMessageSaved);
    onSaveMessage(message, !isMessageSaved);
  };

  const blocks = message.blocks ||
    message.structured_message?.blocks ||
    message.message?.blocks || [
      {
        type: "text",
        content: message.text || message.reply || message.content,
      },
    ];

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "sanskrit":
        return (
          <div key={index} className="mb-3 md:mb-4">
            <h4 className="text-amber-200 text-xs md:text-sm font-semibold mb-2 flex items-center gap-2">
              <GiScrollUnfurled className="text-amber-300" /> Sanskrit
            </h4>
            <div className="bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-lg p-3 md:p-4 border border-amber-400/20">
              <p className="text-amber-100 font-serif text-base md:text-lg leading-relaxed break-words">
                {block.content}
              </p>
            </div>
          </div>
        );

      case "translation":
        return (
          <div key={index} className="mb-3 md:mb-4">
            <h4 className="text-amber-200 text-xs md:text-sm font-semibold mb-2 flex items-center gap-2">
              <MdMenuBook className="text-amber-300" /> Translation
            </h4>
            <div className="border-l-3 border-amber-400/50 pl-3 md:pl-4 text-blue-100/90 italic text-sm md:text-base">
              {block.content}
            </div>
          </div>
        );

      case "verse_reference":
        return (
          <div
            key={index}
            className="mb-3 inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-amber-400/30"
          >
            <IoLocation className="text-amber-300" />
            <span className="text-amber-200 font-semibold text-xs md:text-sm">
              {block.content}
            </span>
          </div>
        );

      case "practice":
        if (hasActivePractice || practiceAccepted) return null;
        return (
          <div
            key={index}
            className="mt-3 md:mt-4 bg-gradient-to-r from-amber-400/20 to-orange-500/20 backdrop-blur-md rounded-xl p-3 md:p-4 border border-amber-400/30"
          >
            <h4 className="text-amber-200 font-semibold text-sm md:text-base mb-2 flex items-center gap-2">
              <IoSparkles className="text-amber-300" /> Suggested Practice
            </h4>
            <p className="text-blue-100/90 text-sm md:text-base mb-3">
              {block.content}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <SafeMotionButton
                onClick={() =>
                  handleAcceptPractice({
                    category: block.category || message.practice_category,
                    text: block.content,
                    duration: block.duration,
                  })
                }
                className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoCheckmark /> Accept Practice
              </SafeMotionButton>
              <SafeMotionButton
                onClick={() => setPracticeAccepted(true)}
                className="px-3 py-2 md:px-4 md:py-2 bg-white/10 text-blue-100 rounded-lg font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoTime /> Maybe Later
              </SafeMotionButton>
            </div>
          </div>
        );

      default:
        return (
          <div
            key={index}
            className="text-blue-100/90 prose prose-sm md:prose-base prose-invert max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {block.content || block.text || ""}
            </ReactMarkdown>
          </div>
        );
    }
  };

  return (
    <SafeMotionDiv
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start mb-3 md:mb-4 w-full"
    >
      <div
        className={`flex gap-2 md:gap-3 ${
          isMobile ? "max-w-[95%]" : "max-w-[85%]"
        }`}
      >
        <div className="flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg text-sm md:text-base">
            <img src={kpng} className="h-8" alt="Krishna" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-gradient-to-r from-purple-400/10 to-blue-500/10 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-5 border border-purple-400/30 shadow-xl">
            <div className="space-y-2 md:space-y-3">
              {blocks.map((block, index) => renderBlock(block, index))}
            </div>

            <div className="flex items-center justify-between mt-3 md:mt-4 pt-2 md:pt-3 border-t border-purple-400/20">
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-100/50">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>

                <div className="flex items-center gap-1">
                  <KrishnaVoiceElevenLabs
                    text={getPlainTextForSpeech()}
                    messageId={message.id || message.messageId}
                    userId={userId}
                    voiceSettings={voiceSettings}
                    isProactive={message.isProactive || false}
                    autoPlay={
                      message.isProactive &&
                      voiceSettings?.autoSpeak &&
                      message.sender === "krishna"
                    }
                  />

                  <SafeMotionButton
                    onClick={handleSaveMessage}
                    className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${
                      isMessageSaved
                        ? "text-amber-400"
                        : "text-blue-100/50 hover:text-amber-400"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={
                      isMessageSaved ? "Remove from saved" : "Save this message"
                    }
                  >
                    {isMessageSaved ? (
                      <IoBookmark className="text-lg" />
                    ) : (
                      <IoBookmarkOutline className="text-lg" />
                    )}
                  </SafeMotionButton>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                {!feedbackGiven && !message.isProactive ? (
                  <>
                    <SafeMotionButton
                      onClick={() => handleFeedback("thumbs_up")}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-blue-100/50 hover:text-green-400 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="This was helpful"
                    >
                      <IoThumbsUp className="text-lg" />
                    </SafeMotionButton>
                    <SafeMotionButton
                      onClick={() => handleFeedback("thumbs_down")}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-blue-100/50 hover:text-red-400 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="This needs improvement"
                    >
                      <IoThumbsDown className="text-lg" />
                    </SafeMotionButton>
                  </>
                ) : (
                  feedbackGiven && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <IoCheckmark /> Feedback received
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeMotionDiv>
  );
};

export default EnhancedKrishnaMessage;
