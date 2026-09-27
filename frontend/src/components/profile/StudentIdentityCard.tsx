import { FC } from 'react';
import { Mail, GraduationCap, BookOpen, AlertCircle, Pencil, X } from 'lucide-react';

interface StudentIdentityCardProps {
  profileData: any;
  userEmail?: string;
  avatarInitial: string;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const StudentIdentityCard: FC<StudentIdentityCardProps> = ({
  profileData,
  userEmail,
  avatarInitial,
  isEditing,
  onToggleEdit,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Identity Left */}
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-psu-navy to-slate-900 dark:from-psu-blue dark:to-psu-navy text-white flex items-center justify-center text-3xl font-extrabold shadow-md border-2 border-white/80 dark:border-slate-700">
              {avatarInitial}
            </div>
            <span
              className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white dark:border-slate-900 w-4 h-4 rounded-full shadow-sm"
              title="Active Student Status"
            />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-1">
              {profileData?.first_name} {profileData?.last_name}
            </h1>
            <p className="text-sm font-semibold text-psu-navy dark:text-psu-light">
              Student ID: {profileData?.student_id} • {profileData?.faculty}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {profileData?.major} • Prince of Songkla University, Phuket Campus
            </p>
          </div>
        </div>

        {/* Action Button Right */}
        <div className="flex md:self-start items-center gap-2">
          <button
            type="button"
            onClick={onToggleEdit}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              isEditing
                ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100'
                : 'bg-psu-navy hover:bg-psu-blue text-white'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancel Editing</span>
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Read-Only 4-Card Metadata Grid (When not editing) */}
      {!isEditing && (
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {/* Email */}
          <div className="bg-white/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Mail className="w-3.5 h-3.5 text-psu-blue" />
              <span>Student Email</span>
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm truncate" title={userEmail}>
              {userEmail || 'N/A'}
            </div>
          </div>

          {/* Faculty & Major */}
          <div className="bg-white/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-psu-blue" />
              <span>Academic Unit</span>
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm truncate" title={profileData?.faculty}>
              {profileData?.faculty || 'PSU Phuket'}
            </div>
          </div>

          {/* Religion */}
          <div className="bg-white/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-psu-blue" />
              <span>Personal Belief</span>
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm truncate">
              {profileData?.religion || 'Not specified'}
            </div>
          </div>

          {/* Allergies / Medical */}
          <div className="bg-white/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Diet & Allergies</span>
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm truncate" title={profileData?.allergies}>
              {profileData?.allergies || 'None recorded'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentIdentityCard;
