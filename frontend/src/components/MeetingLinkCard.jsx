import React from "react";
import { extractMeetingUrl, getMeetingTheme } from "../utils/meetingLinks";

export default function MeetingLinkCard({ text }) {
  const meetUrl = extractMeetingUrl(text);
  if (!meetUrl) return text;

  const theme = getMeetingTheme(meetUrl);
  const textWithoutUrl = text.replace(meetUrl, "").trim();

  return (
    <div className="space-y-2 my-1">
      {textWithoutUrl && <div className="text-sm leading-relaxed">{textWithoutUrl}</div>}
      <div className={`p-3 bg-gradient-to-br ${theme.bg} rounded-xl border ${theme.border} shadow-sm text-left`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-full ${theme.iconBg} flex items-center justify-center ${theme.iconText} shrink-0`}>
            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h4 className={`font-semibold text-xs ${theme.iconText} leading-none`}>{theme.title}</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{theme.subtitle}</p>
          </div>
        </div>
        <a
          href={meetUrl}
          {...(theme.sameTab ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className={`inline-flex items-center justify-center w-full px-3 py-1.5 bg-gradient-to-r ${theme.btn} text-white rounded-lg text-xs font-semibold shadow-sm transition-all focus:outline-none`}
        >
          <span>Join Call</span>
          <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
