import React, { useState, ChangeEvent } from 'react';
import { Image as ImageIcon, MessageCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export interface JobMediaSectionProps {
  posterImageUrl: string;
  lineGroupUrl: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function JobMediaSection({
  posterImageUrl,
  lineGroupUrl,
  onChange,
}: JobMediaSectionProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Poster Image URL */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="posterUrl"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none flex items-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Poster Image URL</span>
          </label>
          <span className="text-[11px] font-semibold text-slate-400 select-none">
            High Res (16:9 or Banner)
          </span>
        </div>

        <div className="relative flex items-center">
          <ImageIcon className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            id="posterUrl"
            name="poster_image_url"
            type="url"
            value={posterImageUrl}
            onChange={(e) => {
              setImageError(false);
              onChange(e);
            }}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full h-11 pl-10 pr-24 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-psu-blue focus:ring-2 focus:ring-psu-blue/20 outline-none transition-all placeholder:text-slate-400 truncate"
          />
          {posterImageUrl && (
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className="absolute right-2 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-700 hover:bg-psu-blue hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              title="Toggle image preview"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Live Poster Thumbnail Preview */}
        {posterImageUrl && showPreview && (
          <div className="mt-1.5 p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 overflow-hidden">
            {!imageError ? (
              <img
                src={posterImageUrl}
                alt="Job poster preview"
                onError={() => setImageError(true)}
                className="w-20 h-14 object-cover rounded-lg shadow-2xs shrink-0 bg-slate-200 dark:bg-slate-700"
              />
            ) : (
              <div className="w-20 h-14 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500 text-[10px] font-bold text-center px-1 shrink-0">
                Invalid Image URL
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                Poster Preview
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {imageError ? 'Unable to load image from URL' : 'Live promotional banner preview'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* LINE Group Invitation URL */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="lineUrl"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#00b900]" />
            <span>LINE Group Invitation URL</span>
          </label>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00b900] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00b900] inline-block" />
            <span>LINE OpenChat</span>
          </span>
        </div>

        <div className="relative flex items-center">
          <MessageCircle className="w-4 h-4 absolute left-3.5 text-[#00b900] pointer-events-none" />
          <input
            id="lineUrl"
            name="line_group_url"
            type="url"
            value={lineGroupUrl}
            onChange={onChange}
            placeholder="https://line.me/ti/g2/..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-psu-blue focus:ring-2 focus:ring-psu-blue/20 outline-none transition-all placeholder:text-slate-400 truncate"
          />
        </div>

        <div className="mt-1.5 p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-psu-blue dark:text-blue-400 shrink-0" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            This invitation link will be automatically shared with students upon application approval.
          </p>
        </div>
      </div>
    </div>
  );
}

export default JobMediaSection;
